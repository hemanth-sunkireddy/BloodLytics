// Define margins and dimensions for the visualization
let margin = { top: 25, right: 50, bottom: 50, left: 100 };
let svgWidth = 1200;
let svgHeight = 1100;
let mapHeight = 600;
let chartHeight = 400;
let chartWidth = svgWidth - margin.left - margin.right;

// Append an SVG element to the DOM
let svg = d3.select("#postContents").append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group for the map
let map = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Append a group for the choropleth
let choropleth = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Append a group for the bar chart
let barGraph = svg.append("g")
  .attr("transform", `translate(${svgWidth / 2}, ${mapHeight + margin.top + 30})`);

// Append a div for the tooltip
let div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Load all CSV data asynchronously
Promise.all([
  d3.json("Maps_JSON/india-states.json"),
  d3.csv("Data_Sets/FamilyBloodDonor.csv"),
  d3.csv("Data_Sets/ReplacementBloodDonor.csv"),
  d3.csv("Data_Sets/VoluntaryBloodDonor.csv"),
  d3.csv("Data_Sets/TotalBloodDonor.csv")
]).then(function (data) {
  // Data loading successful

  // Extract required data
  let geoJsonData = data[0];
  let bloodData = {
    'Family': data[1],
    'Replacement': data[2],
    'Voluntary': data[3],
    'Total': data[4]
  };

  // Define projection for the map
  let projection = d3.geoMercator()
    .fitHeight(mapHeight, geoJsonData);
  let pathGenerator = d3.geoPath().projection(projection);

  // Append a group for India map
  let india = map.append('g');

  // Append a group for the legend
  let legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${svgWidth - 150 - margin.right}, ${margin.top})`);

  // Function to update legend based on selected data
  function updateLegend(value) {
    legend.selectAll("*").remove(); // Clear existing legend

    let legendData = [];

    if (value === "Total") {
      // Extract maximum and minimum values of TotalDonors
      let maxTotalDonors = d3.max(bloodData["Total"], d => parseInt(d.TotalDonors));
      let minTotalDonors = d3.min(bloodData["Total"], d => parseInt(d.TotalDonors));

      // Define color scale based on total donors
      let colorScale = d3.scaleLinear()
        .domain([minTotalDonors, maxTotalDonors])
        .range(['lightyellow', 'red']);

      // Generate data for legend
      for (let i = 0; i <= 5; i++) {
        let value = minTotalDonors + (i / 5) * (maxTotalDonors - minTotalDonors);
        legendData.push({
          color: colorScale(value),
          label: Math.round(value)
        });
      }

      legend.append("text")
        .attr("x", -10)
        .attr("y", -10)
        .text("Total Dontations")
        .style("font-weight", "bold");
    }
    else {
      // Define color scale based on fraction of male and female donors
      let colorScale = d3.scaleLinear()
        .domain([0, 1])
        .range(['lightyellow', 'red']);

      // Generate data for legend
      for (let i = 0; i <= 5; i++) {
        legendData.push({
          color: colorScale(i / 5),
          label: (i / 5).toFixed(2)
        });
      }

      legend.append("text")
        .attr("x", -100)
        .attr("y", -10)
        .text("Relative fraction of selected type")
        .style("font-weight", "bold");
    }

    // Append rectangles and labels for legend
    legend.selectAll(".legend-color")
      .data(legendData)
      .enter().append("rect")
      .attr("class", "legend-color")
      .attr("x", 0)
      .attr("y", (d, i) => i * 20)
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", d => d.color);

    legend.selectAll(".legend-label")
      .data(legendData)
      .enter().append("text")
      .attr("class", "legend-label")
      .attr("x", 30)
      .attr("y", (d, i) => i * 20 + 14)
      .text(d => d.label);


  }

  // Call updateLegend initially
  updateLegend('Family');

  // Function to update choropleth based on selected data
  function updateChoropleth(value) {
    let data = bloodData[value];

    // Update map colors based on data
    india.selectAll('path')
      .data(geoJsonData.features)
      .join('path')
      .attr('d', pathGenerator)
      .style("fill", d => {
        let stateData = data.find(entry => entry.state === d.id);
        if (stateData) {
          if (value === "Total") {
            let colorScale = d3.scaleLinear()
              .domain([0, d3.max(data, d => parseInt(d.TotalDonors))])
              .range(['lightyellow', 'red']);
            return colorScale(parseInt(stateData.TotalDonors));
          }
          else {
            let stateTotal = bloodData["Total"].find(entry => entry.state === d.id);
            let colorScale = d3.scaleLinear()
              .domain([0, 1])
              .range(['lightyellow', 'red']);
            return colorScale((parseInt(stateData.MaleDonors) + parseInt(stateData.FemaleDonors)) / parseInt(stateTotal.TotalDonors));
          }
        }
        else {
          return "grey"; // Fallback color for missing data
        }
      })
      .style("stroke", "black")
      .on("mouseover", function (d) {
        // Mouseover event handler for tooltip
        div.style("opacity", .9);
        let stateData = data.find(entry => entry.state === d.id);
        if (value === "Total") {
          div.html(stateData.state + "</br>"
            + "TotalDonors: " + stateData.TotalDonors)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        }
        else {
          div.html(stateData.state + "</br>"
            + "MaleDonors: " + stateData.MaleDonors + "</br>"
            + "FemaleDonors: " + stateData.FemaleDonors + "</br>")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        }
        // Highlight corresponding bar in the bar chart
        highlightBarInChoropleth(stateData.state);
        highlightStateInBarChart(stateData.state);
      })
      .on("mouseout", function () {
        // Mouseout event handler for hiding tooltip
        div.style("opacity", 0);
      });

    // Call updateLegend with the selected value
    updateLegend(value);
  }

// Append text element for displaying additional information
let infoText = svg.append("text")
  .attr("class", "info-text")
  .attr("x", 1200)
  .attr("y", 500)
  .attr("text-anchor", "end")
  .style("font-size", "16px")
  .style("font-weight", "bold")
  .style("fill", "#333");

// Function to update additional information text based on selected data
function updateInfoText(value) {
  if (value === "Total")
  {
    infoText.text("");
  }
  else if(value === "Family")
  {
    infoText.text("Family blood donations may be higher in states like Uttarpradesh due to strong familial bonds and cultural values.");
  }
  else if(value === "Replacement")
  {
    infoText.text("Replacement blood donations vary due to cultural norms, awareness, and healthcare infrastructure in different states.");
  }
  else if(value === "Voluntary")
  {
    infoText.text("Economic constraints, corruption distrust, lack of awareness contribute to low voluntary donations, in states like Bihar.");
  }
}

// Call updateInfoText initially
updateInfoText('Family');

  // Dropdown menu for selecting data type
  let dropdown = d3.select("#postContents")
    .append("select")
    .attr("id", "dropdown")
    .style("position", "absolute")
    .style("top", "425px")
    .style("left", "950px");

  // Add styling to the dropdown
  dropdown.style("background-color", "white")
    .style("border", "1px solid #ccc")
    .style("border-radius", "4px")
    .style("padding", "5px")
    .style("font-size", "14px")
    .style("color", "#333")
    .style("cursor", "pointer");

  // Populate options in the dropdown
  dropdown.selectAll("option")
    .data(Object.keys(bloodData))
    .enter().append("option")
    .attr("value", d => d)
    .text(d => d);

  // Dropdown change event handler
  dropdown.on("change", function () {
    updateChoropleth(this.value);
    updateBarGraph(this.value);
    updateInfoText(this.value);
  });

  // Initial update of choropleth
  updateChoropleth('Family');

  // Initial display of bar graph for 'Family'
  updateBarGraph('Family');

  // Function to update horizontal bar graph
  function updateBarGraph(value) {
    // Remove existing bar graph
    barGraph.selectAll("*").remove();
    let data = bloodData[value];
    // Create data for the horizontal bar chart
    let barData = data.map(d => {
      let newData = {
        state: d.state
      };

      if (value === "Total") {
        newData.TotalDonors = parseInt(d.TotalDonors);
      }
      else {
        newData.MaleDonors = parseInt(d.MaleDonors);
        newData.FemaleDonors = parseInt(d.FemaleDonors);
      }

      return newData;
    });

    // Define scales for the bar graph
    let xScale;
    if (value === "Total") {
      xScale = d3.scaleLinear()
        .domain([0, 2 * d3.max(barData, d => d.TotalDonors)])
        .range([0, chartWidth]);
    } else {
      xScale = d3.scaleLinear()
        .domain([0, 2 * d3.max(barData, d => d.MaleDonors + d.FemaleDonors)])
        .range([0, chartWidth]);
    }
    let yScale = d3.scaleBand()
      .domain(barData.map(d => d.state))
      .range([0, chartHeight])
      .padding(0.1);

    // Append bars to the bar graph
    barGraph.selectAll(".barGroup")
      .data(barData)
      .enter().append("g")
      .attr("class", "barGroup")
      .attr("transform", d => `translate(0, ${yScale(d.state)})`)
      .each(function (d) {
        if (value === "Total") {
          d3.select(this).append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", xScale(d.TotalDonors))
            .attr("height", yScale.bandwidth())
            .style("fill", "steelblue");
        } else {
          d3.select(this).append("rect")
            .attr("class", "maleBar")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", d => xScale(d.MaleDonors))
            .attr("height", yScale.bandwidth() / 2)
            .style("fill", "steelblue");

          d3.select(this).append("rect")
            .attr("class", "femaleBar")
            .attr("x", 0)
            .attr("y", yScale.bandwidth() / 2)
            .attr("width", d => xScale(d.FemaleDonors))
            .attr("height", yScale.bandwidth() / 2)
            .style("fill", "lightblue");
        }
      })
      .on("mouseover", function (d) {
        // Mouseover event handler for tooltip
        div.style("opacity", .9);
        if (value === "Total") {
          div.html("State: " + d.state + "<br/>"
            + "Total Donors: " + d.TotalDonors)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        }
        else {
          div.html("State: " + d.state + "<br/>"
            + "Male Donors: " + d.MaleDonors + "<br/>"
            + "Female Donors: " + d.FemaleDonors)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        }
        // Highlight corresponding state in the choropleth map
        highlightBarInChoropleth(d.state);
      })
      .on("mouseout", function (d) {
        // Mouseout event handler for hiding tooltip
        div.style("opacity", 0);
      });

    // Add y-axis with state names
    barGraph.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .attr("dy", "0.35em")
      .attr("transform", "translate(-10, 0)")
      .style("text-anchor", "end");

    // Add x-axis with values
    barGraph.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale).ticks(15));
  }

  // Function to handle hovering over a state in the choropleth map
  function highlightStateInBarChart(stateId) {
    // Remove any existing highlighting
    barGraph.selectAll(".bar")
      .classed("highlighted", false);

    // Highlight the corresponding bar in the bar chart
    barGraph.selectAll(".bar")
      .filter(d => d.state === stateId)
      .classed("highlighted", true);
  }

  // Function to handle hovering over a bar in the bar chart
  function highlightBarInChoropleth(stateId) {
    // Remove any existing highlighting
    india.selectAll('path')
      .style("stroke-width", "1px");

    // Highlight the corresponding state in the choropleth map
    india.selectAll('path')
      .filter(d => d.id === stateId)
      .style("stroke-width", "3px");
  }

  // Mouseover event handler for states in choropleth map
  india.selectAll('path')
    .on("mouseover", function (d) {
      let stateId = d.id;
      highlightStateInBarChart(stateId);
      highlightBarInChoropleth(stateId);
    })
    .on("mouseout", function () {
      // Remove highlighting on mouseout
      barGraph.selectAll(".bar")
        .classed("highlighted", false);

      india.selectAll('path')
        .style("stroke-width", "1px");
    });

  // Mouseover event handler for bars in the bar chart
  barGraph.selectAll('.bar')
    .on("mouseover", function (d) {
      let stateId = d.state;
      highlightStateInBarChart(stateId);
      highlightBarInChoropleth(stateId);
    })
    .on("mouseout", function () {
      // Remove highlighting on mouseout
      barGraph.selectAll(".bar")
        .classed("highlighted", false);

      india.selectAll('path')
        .style("stroke-width", "1px");
    });
});
