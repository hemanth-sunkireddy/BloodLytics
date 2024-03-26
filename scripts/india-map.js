let margin = {top: 10, right: 20, bottom: 10, left: 20};
let width = 1200 - margin.left - margin.right;
let height = 700 - margin.top - margin.bottom;

let svg = d3.select("#postContents").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");
      
svg.append("rect")
  .attr("width",width)
  .attr("height",height)
  .style("fill","green")
  .style("opacity", 0);

let div = d3.select("body").append("div")  
  .attr("class", "tooltip")        
  .style("opacity", 0);

// Load all CSV data
Promise.all([
  d3.json("Maps_JSON/india-states.json"),
  d3.csv("Data_Sets/FamilyBloodDonor.csv"),
  d3.csv("Data_Sets/ReplacementBloodDonor.csv"),
  d3.csv("Data_Sets/VoluntaryBloodDonor.csv"),
  d3.csv("Data_Sets/TotalBloodDonor.csv")
]).then(function(data){
  console.log("Data loaded successfully:", data);
  let geoJsonData = data[0];
  let bloodData = {
    'Family': data[1],
    'Replacement': data[2],
    'Voluntary': data[3],
    'Total': data[4]
  };
  console.log("Blood data:", bloodData);
  let projection = d3.geoMercator();
  projection.fitHeight(height-100,geoJsonData);
  let pathGenerator = d3.geoPath().projection(projection);
  
  let india = svg.append('g');     
  india.selectAll('path')
    .data(geoJsonData.features)
    .enter()
    .append('path')
      .attr('d', pathGenerator)
      .style("stroke", "black")
      .on("mouseover", function(d) {
        div.style("opacity", .9);     
        div.html(d.state + "</br>" 
        + "MaleDonors: " + d.MaleDonors + "</br>" 
        + "FemaleDonors: " + d.FemaleDonors + "</br>")
        
        .style("left", (d3.event.pageX) + "px")      
        .style("top", (d3.event.pageY - 28) + "px");
        
        // Bar chart data for tooltip
        let barData1 = [
          { type: "Male", value: d.MaleDonors },
          { type: "Female", value: d.FemaleDonors }
        ];

        let tooltipSvg = div.append("svg")
          .attr("width", 150)
          .attr("height", 100);
        
        let xScale = d3.scaleBand()
          .domain(["Male", "Female"])
          .range([0, 100])
          .padding(0.1);
        
        let yScale = d3.scaleLinear()
          .domain([0, Math.max(d.MaleDonors, d.FemaleDonors)])
          .nice()
          .range([80, 0]);
        
        let bars1 = tooltipSvg.selectAll(".bar1")
          .data(barData1)
          .enter()
          .append("rect")
            .attr("class", "bar-donations")
            .attr("x", d => xScale(d.type))
            .attr("y", d => yScale(d.value))
            .attr("width", xScale.bandwidth())
            .attr("height", d => 80 - yScale(d.value));
        
      })         
      .on("mouseout", function(d) {     
        div.style("opacity", 0);
        div.selectAll("svg").remove();
      });
  
  // Dropdown menu for selecting data type
  let dropdown = d3.select("#postContents")
    .append("select")
    .attr("id", "dropdown")
    .style("position", "absolute")
    .style("top", "20px")
    .style("left", "20px");

  dropdown.selectAll("option")
    .data(Object.keys(bloodData))
    .enter().append("option")
    .attr("value", d => d)
    .text(d => d);

  dropdown.on("change", function() {
    let selectedData = bloodData[this.value];
    updateChoropleth(selectedData);
  });

  // Initial update
  updateChoropleth(bloodData['Total']);

  function updateChoropleth(data) {
    console.log("Updating choropleth with data:", data);
    let colorScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => parseInt(d.TotalDonors))])
      .range(['lightyellow', 'orange']);

    india.selectAll('path')
      .data(geoJsonData.features)
      .style("fill", d => {
        let stateData = data.find(entry => entry.state === d.id);
        if (stateData) {
          return colorScale(parseInt(stateData.TotalDonors));
        } else {
          return "grey"; // Fallback color for missing data
        }
      });
  }
});
