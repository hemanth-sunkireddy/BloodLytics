// Define an array of datasets, each containing name, file path, and color
var datasets = [
    { name: "Reasons for Not Donating the Blood", file: "Data_Sets/reasons_for_not_donating_blood.csv", color: '#FF5733' }, // Dark orange
    { name: "Misconceptions on blood donation", file: "Data_Sets/misconceptions.csv", color: '#6C3483' }, // Dark purple
    { name: "Motivation for blood donation", file: "Data_Sets/motivation.csv", color: '#1E8449' }, // Dark green
    { name: "Knowledge and Attitude Regarding Blood Donation", file: "Data_Sets/knowledge-and-attitude-regarding-blood-donation.csv", color: '#2874A6' } // Dark blue
];


// Define margin and dimensions for the SVG
var margin = { top: 10, right: 10, bottom: 40, left: 10 },
    width = 1800 - margin.left - margin.right,
    height = 4000 - margin.top - margin.bottom;

// Append an SVG element to the specified div with given dimensions and margins
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Function to load a specific dataset and display it as a treemap
function loadDataset(dataset, index) {
    // Insert an h1 heading for the dataset
    svg.append("text")
        .attr("x", margin.left)
        .attr("y", index * 1000 + 10)
        .attr("font-size", "24px")
        .text(dataset.name)
        .style("font-family", "Arial")
        .attr("x", margin.left + (width / 2)) // Center the text horizontally
        .attr("y", index * 1000 + 10) // Adjust vertical position as needed
        .attr("font-size", "24px")
        .attr("text-anchor", "middle")
        .style("font-weight", "bold");

    d3.csv(dataset.file, function (data) {
        // Convert CSV data to hierarchy
        var root = d3.stratify()
            .id(function (d) { return d.name; })
            .parentId(function (d) { return d.parent; })
            (data);
        root.sum(function (d) { return +d.value })

        // Define treemap layout with size adjusted for positioning
        var treemap = d3.treemap()
            .size([width, 900]) // Adjusted height for each treemap
            .padding(4);

        // Apply treemap layout to the hierarchy
        treemap(root);

        // Create groups for each box in the treemap
        var boxes = svg
            .selectAll("g.box-group-" + index) // Added index to make each group unique
            .data(root.leaves())
            .enter()
            .append("g")
            .attr("class", "box-group-" + index) // Added index to make each group unique
            .style("fill", dataset.color)
            .attr("transform", function (d) { return "translate(" + d.x0 + "," + (d.y0 + index * 1000 + 25) + ")"; }) // Adjusted y-position based on index
            .on("mouseover", function (d) {
                // Highlight on mouseover
                d3.select(this).select("rect")
                    .style("opacity", 0.7);
                d3.select(this).select(".value-text").style("display", "block");
                d3.select(this).select(".name-text").style("display", "none");
            })
            .on("mouseout", function (d) {
                // Restore original color on mouseout
                d3.select(this).select("rect")
                    .style("opacity", 1);
                d3.select(this).select(".value-text").style("display", "none");
                d3.select(this).select(".name-text").style("display", "block");
            });

        // Append rectangles representing the boxes
        boxes.append("rect")
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style("stroke", "white") // White stroke color
            .style("fill", dataset.color)
            .style("rx", 8) // Rounded corners
            .style("ry", 8); // Rounded corners

        // Append foreignObject for text content within each box
        boxes.append("foreignObject")
            .attr("class", "name-text")
            .attr("x", 8)
            .attr("y", 4)
            .attr("width", function (d) { return d.x1 - d.x0 - 16; })
            .attr("height", function (d) { return d.y1 - d.y0 - 8; })
            .append("xhtml:div")
            .style("width", function (d) { return (d.x1 - d.x0 - 16) + "px"; })
            .style("height", function (d) { return (d.y1 - d.y0 - 8) + "px"; })
            .style("overflow", "auto")
            .style("display", "flex")
            .style("justify-content", "center")
            .style("align-items", "center")
            .style("font-size", "18px")
            .style("color", "white") // White text color
            .html(function (d) { return d.data.name; });

        // Append text for value within each box
        boxes.append("text")
            .attr("class", "value-text")
            .attr("font-size", "20px")
            .attr("fill", "white") // White text color
            .style("display", "none")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .text(function (d) {
                if (dataset.name === "Knowledge and Attitude Regarding Blood Donation") {
                    return d.data.value + "%   yes";
                } else {
                    return d.data.value + "%";
                }
            })
            .each(function (d) {
                var box = this.parentNode.getBBox();
                var x = box.x + box.width / 2;
                var y = box.y + box.height / 2;
                d3.select(this).attr("x", x).attr("y", y);
            });
    });
}

// Load datasets one below the other
datasets.forEach(function (dataset, index) {
    loadDataset(dataset, index);
});
