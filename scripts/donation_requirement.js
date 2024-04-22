let margin = { top: 50, right: 100, bottom: 100, left: 200 };
let width = 1250 - margin.left - margin.right;
let height = 800 - margin.top - margin.bottom;

let svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

let dropdown = d3.select("#my_dataviz")
  .append("div")
  .attr("id", "dropdown-container")
  .append("select")
  .attr("id", "state-dropdown")
  .on("change", updateGraph);

dropdown.append("option")
  .attr("value", "all")
  .text("All States");

Promise.all([
  d3.csv("Data_Sets/blood_data.csv")
]).then(function (data) {
  let bloodData = data[0];

  let maxDonations = d3.max(bloodData, d => +d.donations);
  let maxRequirements = d3.max(bloodData, d => +d.requirements);
  let maxTotal = Math.max(maxDonations, maxRequirements);

  let yScale = d3.scaleLinear()
    .domain([0, 50000, 400000, maxTotal])
    .range([height, 3 * height / 4, height / 2, 0]);

  bloodData.forEach(d => {
    svg.append("line")
      .attr("class", "line")
      .attr("id", d.state)
      .attr("x1", 0)
      .attr("y1", yScale(d.donations))
      .attr("x2", width)
      .attr("y2", yScale(d.requirements))
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .style("display", "block")
      .on("mouseover", function () {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(d.state + "<br/>" + "Donations: " + d.donations + "<br/>" + "Requirements: " + d.requirements)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function () {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });

    // Populate dropdown options
    dropdown.append("option")
      .attr("value", d.state)
      .text(d.state);
  });

  // Add left y-axis for donations
  svg.append("g")
    .call(d3.axisLeft(yScale)
      .tickValues(d3.ticks(0, 50000, 10).concat(d3.ticks(50000, 400000, 10)).concat(d3.ticks(400000, 2200000, 10)))) // Define tick values for each range
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -80)
    .attr("x", -height / 2)
    .attr("dy", "0.71em")
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .style("font-size", "16px")
    .text("Donations");

  svg.append("g")
    .attr("transform", "translate(" + width + " ,0)")
    .call(d3.axisRight(yScale)
      .tickValues(d3.ticks(0, 50000, 10).concat(d3.ticks(50000, 400000, 10)).concat(d3.ticks(400000, 2200000, 10)))) // Define tick values for each range
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 80)
    .attr("x", -height / 2)
    .attr("dy", "0.71em")
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .style("font-size", "16px")
    .text("Requirements");

  // Add line connecting left and right axes at 0
  svg.append("line")
    .attr("x1", 0)
    .attr("y1", yScale(0))
    .attr("x2", width)
    .attr("y2", yScale(0))
    .attr("stroke", "#ccc")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "5,5");
});

function updateGraph() {
  let selectedState = this.value;
  svg.selectAll(".line")
    .style("display", function () {
      return (selectedState === "all" || this.id === selectedState) ? "block" : "none";
    });
}