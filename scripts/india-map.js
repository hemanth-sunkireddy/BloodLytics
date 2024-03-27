// Define margins for the visualization
let margin = { top: 10, right: 20, bottom: 10, left: 20 };
let width = 1200 - margin.left - margin.right;
let height = 700 - margin.top - margin.bottom;

// Append an SVG element to the DOM for the map
let svg = d3.select("#postContents").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

// Append a group for the map
let map = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append a group for the bar graph
let barGraph = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + (height - 50) + ")");

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
  console.log("Data loaded successfully:", data);

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
    .fitHeight(height, geoJsonData);
  let pathGenerator = d3.geoPath().projection(projection);

  // Append a group for India map
  let india = map.append('g');

  // Function to update choropleth based on selected data
  function updateChoropleth(value) {
    let data = bloodData[value]
    console.log("Updating choropleth with data:", data);


    // Update map colors based on data
    india.selectAll('path')
      .data(geoJsonData.features)
      .join('path')
      .attr('d', pathGenerator)
      .style("fill", d => {
        let stateData = data.find(entry => entry.state === d.id);
        console.log("state:", stateData);
        if (stateData) {
          if (value === "Total") {
            // Define color scale based on total donors
            let colorScale = d3.scaleLinear()
              .domain([0, d3.max(data, d => parseInt(d.TotalDonors))])
              .range(['lightyellow', 'red']);
            return colorScale(parseInt(stateData.TotalDonors));
          }
          else {
            let stateTotal = bloodData["Total"].find(entry => entry.state === d.id);
            console.log("TOTAL: ",stateTotal);
            // Define color scale based on total donors
            let colorScale = d3.scaleLinear()
              .domain([0, 1])
              .range(['lightyellow', 'red']);
            return colorScale(parseInt((stateData.MaleDonors + stateData.FemaleDonors)/stateTotal.TotalDonors));
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
        div.html(stateData.state + "</br>"
          + "MaleDonors: " + stateData.MaleDonors + "</br>"
          + "FemaleDonors: " + stateData.FemaleDonors + "</br>")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function (d) {
        // Mouseout event handler for hiding tooltip
        div.style("opacity", 0);
      });
  }

  // Dropdown menu for selecting data type
  let dropdown = d3.select("#postContents")
    .append("select")
    .attr("id", "dropdown")
    .style("position", "absolute")
    .style("top", "20px")
    .style("left", "20px");

  // Populate options in the dropdown
  dropdown.selectAll("option")
    .data(Object.keys(bloodData))
    .enter().append("option")
    .attr("value", d => d)
    .text(d => d);

  // Dropdown change event handler
  dropdown.on("change", function () {
    let selectedData = bloodData[this.value];
    console.log("type: ", this.value);
    updateChoropleth(this.value);
    updateBarGraph(selectedData);
  });

  // Initial update of choropleth
  updateChoropleth('Family');

  // Function to update bar graph
  function updateBarGraph(data) {
    // Remove existing bar graph
    barGraph.selectAll("*").remove();

    // Aggregate data for bar graph
    let maleDonors = d3.sum(data, d => parseInt(d.MaleDonors));
    let femaleDonors = d3.sum(data, d => parseInt(d.FemaleDonors));

    // Create data for the bar graph
    let barData = [
      { type: "Male", value: maleDonors },
      { type: "Female", value: femaleDonors }
    ];

    // Define scales for the bar graph
    let xScale = d3.scaleBand()
      .domain(barData.map(d => d.type))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    let yScale = d3.scaleLinear()
      .domain([0, d3.max(barData, d => d.value)])
      .nice()
      .range([50, 0]);

    // Append bars to the bar graph
    barGraph.selectAll(".bar")
      .data(barData)
      .join("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.type))
      .attr("y", d => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", d => 50 - yScale(d.value));

    // Add labels
    barGraph.selectAll(".bar-label")
      .data(barData)
      .join("text")
      .attr("class", "bar-label")
      .attr("x", d => xScale(d.type) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.value) - 5)
      .attr("text-anchor", "middle")
      .text(d => d.value);
  }
});
