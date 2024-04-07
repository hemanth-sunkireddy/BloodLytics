
document.addEventListener('DOMContentLoaded', async function () {

  // Get references to slider and black_white_or_color elements
  const black_white_or_color = document.getElementById('bw_or_color');
  let black_or_color = black_white_or_color.value;   // Store initial color preference
  // Set up the SVG dimensions
  const width = 1296;
  const height = 724;

  // Create SVG element
  const svg = d3.select("#india-map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Load Indian states data
  const india_states = await d3.json("Maps_JSON/india-states.json");

  // Map and projection
  var projection = d3.geoMercator()
    .fitSize([width, height], india_states); // Updated fitSize instead of fitHeight
  var path = d3.geoPath()
    .projection(projection);
  
    console.log("HELLO");
  // console.log(bloodDonationPercentage[0].VBDPercentage);
  // Draw map
  async function draw_colors_to_map(black_or_color) {
    const bloodDonationPercentage = await d3.csv("https://raw.githubusercontent.com/hemanth-sunkireddy/BloodLytics/main/Data_Sets/VoluntaryPercentage.csv");
    console.log(bloodDonationPercentage);
    let color1 = "FFFFFF";
    let color2 = "CCCCCC";
    let color3 = "999999";
    let color4 = "666666";
    let color5 = "000000";
    if (black_or_color == 2) {
      color1 = "7FFF00";
      color2 = "FFA500";
      color3 = "9370DB";
      color4 = "FF6347";
      color5 = "000000";
    }
    console.log("HELLO");

    // console.log(black_or_color);
    svg.selectAll("path").remove();
    svg.selectAll("path")
      .data(india_states.features)
      .enter().append("path")
      .attr("d", path)
      .style("stroke", "#000080")
      .style("stroke-width", 1)
      .style("fill", function (india) {
        for (let i = 0; i < bloodDonationPercentage.length; i++) {
          let color_of_state = bloodDonationPercentage[i].VBDPercentage;
          if (india.id == bloodDonationPercentage[i].State) {
            console.log(color_of_state);
            if (color_of_state > 80) {
              // console.log(color1);
              return "#" + color1;
            }
            else if (color_of_state > 70) {
              return "#" + color2;
            }
            else if (color_of_state > 60) {
              return "#" + color3;
            }
            else if (color_of_state > 50) {
              return "#" + color4;
            }
            else {
              return "#" + color5;
            }
          }
        }
      })
      .on("mouseover", function (event, d, i) {
        let point = this.getAttribute('class');
        let state_name = d.id;
        let percentage_of_state = 0;
        for (let i = 0; i < bloodDonationPercentage.length; i++) {
          if (d.id == bloodDonationPercentage[i].State) {
            percentage_of_state = bloodDonationPercentage[i].VBDPercentage;
            console.log(percentage_of_state);
          }

        }
        console.log(state_name);
        const tooltipX = event.offsetX + 300;
        const tooltipY = event.offsetY + 400;

        tooltip.html(`${d.id}<br> Volutary Donation: ${percentage_of_state}%`)
          .style("left", tooltipX + "px")
          .style("top", tooltipY + "px")
          .style("opacity", 1)
          .style('visibility', "visible");

      })
      .on("mouseout", (d) => {
        tooltip.style('visibility', "hidden");
      });
  }
  // Adding Tool Tip to the Graphs
  const tooltip = d3.select("#india-map").append("div")
    .attr("class", "tooltip")
    .style("opacity", 1)
    .style("position", "absolute")
    .style("width", "150px") // Adjust width as needed
    .style("height", "auto") // Adjust height as needed
    .style("background-color", "#ffb6c1") // Change background color
    .style("border", "1px solid #000000") // Add border
    .style("padding", "10px") // Add padding for better appearance
    .style("border-radius", "5px") // Add border radius for rounded corners
    .style("color", "#000000") // Change text color
    .style("font-weight", "bold") // Make text bold
    .style("font-size", "12px") // Change font size
    .style("pointer-events", "none") // Avoid tooltip blocking mouse events
    .style("visibility", "hidden");
  // Function to update slider id
  async function updateSliderId() {
    black_or_color = black_white_or_color.value;
    // Call a function to update the map colors based on slider value and color preference
    draw_colors_to_map(black_or_color);
  }

  draw_colors_to_map(black_or_color);
  // Initial update
  await updateSliderId();

  // Event listener for slider input
  black_white_or_color.addEventListener('input', updateSliderId);

});  
