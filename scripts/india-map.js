
document.addEventListener('DOMContentLoaded', async function () {

  // Get the dropdown items
  var dropdownItems = document.querySelectorAll('.dropdown-item');

  // Add click event listener to each dropdown item
  dropdownItems.forEach(function (item) {
    item.addEventListener('click', function () {
      // Get the value of the selected item
      var selectedValue = this.getAttribute('value');
      change_pie_for_state(selectedValue);

    });
  });


  // Get references to slider and black_white_or_color elements
  const black_white_or_color = document.getElementById('bw_or_color');
  let black_or_color = black_white_or_color.value;   // Store initial color preference

  const black_white_or_color_for_pie = document.getElementById('bw_or_color_for_pie');
  let black_or_color_for_pie = black_white_or_color_for_pie.value;   // Store initial color preference

  // Set up the SVG dimensions
  const width = 1296;
  const height = 724;
  // Create SVG element
  const svg = d3.select("#india-map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const pie = d3.pie();

  const data_of_india = await d3.csv("https://raw.githubusercontent.com/hemanth-sunkireddy/BloodLytics/main/Data_Sets/2021_Blood_Donation_Types.csv")
  let percentages = [];
  for (let i = 0; i < data_of_india.length; i++) {
    let individual_country_total_donations = Number(data_of_india[i].FamilyMaleDonors) + Number(data_of_india[i].FamilyFemaleDonors) + Number(data_of_india[i].ReplacementMaleDonors) + Number(data_of_india[i].ReplacementFemaleDonors) + Number(data_of_india[i].VoluntaryMaleDonors) + Number(data_of_india[i].VoluntaryFemaleDonors);
    let percentage_of_voluntary = Number(data_of_india[i].VoluntaryFemaleDonors) + Number(data_of_india[i].VoluntaryMaleDonors);
    percentage_of_voluntary = percentage_of_voluntary / individual_country_total_donations;
    percentage_of_voluntary = percentage_of_voluntary * 100;
    let percentage_of_replacement = Number(data_of_india[i].ReplacementFemaleDonors) + Number(data_of_india[i].ReplacementMaleDonors);
    percentage_of_replacement = percentage_of_replacement / individual_country_total_donations;
    percentage_of_replacement = percentage_of_replacement * 100;
    let percentage_of_family = Number(data_of_india[i].FamilyFemaleDonors) + Number(data_of_india[i].FamilyMaleDonors);
    percentage_of_family = percentage_of_family / individual_country_total_donations;
    percentage_of_family = percentage_of_family * 100;
    let total_percentage = percentage_of_family + percentage_of_replacement + percentage_of_voluntary;
    let individual_state_list = [];
    individual_state_list.push(data_of_india[i].state);

    individual_state_list.push(percentage_of_voluntary, percentage_of_family, percentage_of_replacement);
    let percentage_of_voluntary_male = data_of_india[i].VoluntaryMaleDonors;
    percentage_of_voluntary_male = percentage_of_voluntary_male / individual_country_total_donations;
    percentage_of_voluntary_male = percentage_of_voluntary_male * 100;
    let percentage_of_voluntary_female = Number(data_of_india[i].VoluntaryFemaleDonors);
    percentage_of_voluntary_female = percentage_of_voluntary_female / individual_country_total_donations;
    percentage_of_voluntary_female = percentage_of_voluntary_female * 100;
    let percentage_of_family_male = Number(data_of_india[i].FamilyMaleDonors);
    percentage_of_family_male = percentage_of_family_male / individual_country_total_donations;
    percentage_of_family_male = percentage_of_family_male * 100;
    let percentage_of_family_female = Number(data_of_india[i].FamilyFemaleDonors);
    percentage_of_family_female = percentage_of_family_female / individual_country_total_donations;
    percentage_of_family_female = percentage_of_family_female * 100;
    let percentage_of_replacement_male = Number(data_of_india[i].ReplacementMaleDonors);
    percentage_of_replacement_male = percentage_of_replacement_male / individual_country_total_donations;
    percentage_of_replacement_male = percentage_of_replacement_male * 100;
    let percentage_of_replacement_female = Number(data_of_india[i].ReplacementFemaleDonors);
    percentage_of_replacement_female = percentage_of_replacement_female / individual_country_total_donations;
    percentage_of_replacement_female = percentage_of_replacement_female * 100;
    individual_state_list.push(percentage_of_voluntary_male, percentage_of_voluntary_female)
    individual_state_list.push(percentage_of_family_male, percentage_of_family_female);
    individual_state_list.push(percentage_of_replacement_male, percentage_of_replacement_female);
    percentages.push(individual_state_list);
  }

  const data_for_pi = [percentages[0][1], percentages[0][2], percentages[0][3]];

  // Text labels corresponding to each data value
  const labels = ["Voluntary", "Family", "Replacement"];

  // Compute pie angles based on combinedData
  const arcs = pie(data_for_pi);

  const pie_svg = d3.select("#pie-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const pie_chart = pie_svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


  const arc = d3.arc()
    .innerRadius(100)
    .outerRadius(Math.min(width, height) / 3 - 1);

  // Add 'label: "voluntary"' to each object in arcs array
  arcs.forEach((arc, i) => {
    arc.label = labels[i];
  });


  pie_chart.selectAll("path")
    .data(arcs)
    .enter().append("path")
    .attr("fill", function (d, i) {
      if (i == 0) {
        return "#21B0FE";
      }
      else if (i == 1) {
        return "#FED700";
      }
      else if (i == 2) {
        return "#FE218B";
      }
    })
    .attr("d", arc)
    .attr("opacity", "100%")
    .attr("stroke", "black")
    .attr("stroke-width", "3px")
    .on("mouseover", function (event, d, i) {
      // Change style of the hovered arc
      d3.select(this)
        .attr("opacity", "100%")  // Change fill color to orange
        .attr("stroke-width", "7px");  // Increase stroke width

      console.log(arcs);

      const tooltipX = event.offsetX;
      const tooltipY = event.offsetY + 1800;
      tooltip_pie.html(` ${d.label} : ${d.data} %`)
        .style("left", tooltipX + "px")
        .style("top", tooltipY + "px")
        .style("opacity", 1)
        .style('visibility', "visible");
    })
    .on("mouseout", (d) => {
      tooltip_pie.style('visibility', "hidden");

      pie_chart.selectAll("path")
        .attr("fill", function (d, i) {
          if (i == 0) {
            return "#21B0FE";
          }
          else if (i == 1) {
            return "#FED700";
          }
          else if (i == 2) {
            return "#FE218B";
          }
        })  // Restore original fill color
        .attr("stroke-width", "2px");  // Restore original stroke width
    });


  // Append text elements for state names
  pie_chart.selectAll("text")
    .data(percentages)
    .enter().append("text")
    .attr("transform", function (d) {
      // Calculate centroid of each arc
      const centroid = arc.centroid(d);
      // Move the text to the centroid
      return "translate(" + centroid[0] + "," + centroid[1] + ")";
    })
    .attr("text-anchor", "middle") // Center the text
    .style("font-size", "20px")
    .text(percentages[0][0]); // Display the state name


  // Load Indian states data
  const india_states = await d3.json("Maps_JSON/india-states.json");
  console.log(percentages);

  // Map and projection
  var projection = d3.geoMercator()
    .fitSize([width, height], india_states); // Updated fitSize instead of fitHeight
  var path = d3.geoPath()
    .projection(projection);

  // console.log(bloodDonationPercentage[0].VBDPercentage);
  // Draw map
  async function draw_colors_to_map(black_or_color, black_or_color_for_pie) {
    console.log(black_or_color_for_pie)
    const bloodDonationPercentage = await d3.csv("https://raw.githubusercontent.com/hemanth-sunkireddy/BloodLytics/main/Data_Sets/VoluntaryPercentage.csv");
    let color1 = "FFFFFF";
    let color2 = "CCCCCC";
    let color3 = "999999";
    let color4 = "666666";
    let color5 = "000000";
    if (black_or_color == 2) {
      color1 = "993300";
      color2 = "cc4c02";
      color3 = "fe9929";
      color4 = "fff7bc";
      color5 = "FFFFFF";
    }

    let color1_for_pie = "FFFFFF";
    let color2_for_pie = "999999";
    let color3_for_pie = "000000";

    if (black_or_color_for_pie == 0) {
      return "#21B0FE";
    }
    else if (black_or_color_for_pie == 1) {
      return "#FED700";
    }
    else if (black_or_color_for_pie == 2) {
      return "#FE218B";
    }

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
        let state_name = d.id;
        let percentage_of_state = 0;
        for (let i = 0; i < bloodDonationPercentage.length; i++) {
          if (state_name == bloodDonationPercentage[i].State) {
            percentage_of_state = bloodDonationPercentage[i].VBDPercentage;
          }

        }
        const tooltipX = event.offsetX + 300;
        const tooltipY = event.offsetY + 400;
        tooltip.html(`${d.id}<br> Volutary Donation: ${percentage_of_state}%`)
          .style("left", tooltipX + "px")
          .style("top", tooltipY + "px")
          .style("opacity", 1)
          .style('visibility', "visible");

        d3.select(this)
          .style("stroke-width", 5)



      })
      .on("mouseout", (d) => {
        tooltip.style('visibility', "hidden");

        svg.selectAll("path")
          .style("stroke-width", 1)
      });



  }


  async function change_pie_for_state(selected_state) {

    let data_for_pi = [percentages[selected_state - 1][1], percentages[selected_state - 1][2], percentages[selected_state - 1][3]];
    // Text labels corresponding to each data value

    const labels = ["Voluntary", "Family", "Replacement"];

    // Compute pie angles based on combinedData
    const arcs = pie(data_for_pi);

    d3.select("#pie-chart").select("svg").remove();
    const pie_svg = d3.select("#pie-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const pie_chart = pie_svg.append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    pie_chart.selectAll("path").remove();

    const arc = d3.arc()
      .innerRadius(100)
      .outerRadius(Math.min(width, height) / 3 - 1);

    // Add 'label: "voluntary"' to each object in arcs array
    arcs.forEach((arc, i) => {
      arc.label = labels[i];
    });


    pie_chart.selectAll("path")
      .data(arcs)
      .enter().append("path")
      .attr("fill", function (d, i) {
        if (i == 0) {
          return "#21B0FE";
        }
        else if (i == 1) {
          return "#FED700";
        }
        else if (i == 2) {
          return "#FE218B";
        }
      })
      .attr("d", arc)
      .attr("opacity", "100%")
      .attr("stroke", "black")
      .attr("stroke-width", "3px")
      .on("mouseover", function (event, d, i) {
        // Change style of the hovered arc
        d3.select(this)
          .attr("opacity", "100%")  // Change fill color to orange
          .attr("stroke-width", "7px");  // Increase stroke width

        console.log(arcs);

        const tooltipX = event.offsetX;
        const tooltipY = event.offsetY + 1800;
        tooltip_pie.html(` ${d.label} : ${d.data} %`)
          .style("left", tooltipX + "px")
          .style("top", tooltipY + "px")
          .style("opacity", 1)
          .style('visibility', "visible");
      })
      .on("mouseout", (d) => {
        tooltip_pie.style('visibility', "hidden");

        pie_chart.selectAll("path")
          .attr("fill", function (d, i) {
            if (i == 0) {
              return "#21B0FE";
            }
            else if (i == 1) {
              return "#FED700";
            }
            else if (i == 2) {
              return "#FE218B";
            }
          })  // Restore original fill color
          .attr("stroke-width", "2px");  // Restore original stroke width
      });

    pie_chart.selectAll("text").remove();

    // Append text elements for state names
    pie_chart.selectAll("text")
      .data(percentages)
      .enter().append("text")
      .attr("transform", function (d) {
        // Calculate centroid of each arc
        const centroid = arc.centroid(d);
        // Move the text to the centroid
        return "translate(" + centroid[0] + "," + centroid[1] + ")";
      })
      .style("font-size", "20px")
      .attr("text-anchor", "middle") // Center the text
      .text(percentages[selected_state - 1][0]); // Display the state name




    console.log(data_for_pi);

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

  // Adding Tool Tip to the Pie Charts 
  const tooltip_pie = d3.select("#pie-chart").append("div")
    .attr("class", "tooltip_pie")
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
    black_or_color_for_pie = black_white_or_color_for_pie.value;
    // Call a function to update the map colors based on slider value and color preference
    draw_colors_to_map(black_or_color, black_or_color_for_pie);
  }

  draw_colors_to_map(black_or_color);
  // Initial update
  await updateSliderId();

  // Event listener for slider input
  black_white_or_color.addEventListener('input', updateSliderId);

  black_white_or_color_for_pie.addEventListener("input", updateSliderId);
});  
