let result;

document.addEventListener('DOMContentLoaded', async function () {

    // Get references to slider and black_white_or_color elements
    const importexportSlider = document.getElementById('slider');
    const black_white_or_color = document.getElementById('bw_or_color');
    let slidervalue = importexportSlider.value;   // Store initial slider value
    let black_or_color = black_white_or_color.value;   // Store initial color preference
    // Set up the SVG dimensions
    const width = 1296;
    const height = 724;


    // Create SVG element
    const svg = d3.select("#world-map")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Map and projection
    var path = d3.geoPath();
    var projection = d3.geoNaturalEarth()
        .scale(width / 2 / Math.PI)
        .translate([width / 2, height / 2])
    var path = d3.geoPath()
        .projection(projection);


    // Loading CSV File here.
    const data = await d3.csv("Data_Sets/country_wise_blood_distribution.csv");
    // console.log(data);

    let color_to_draw1;
    let color_to_draw2;
    let color_to_draw3;
    let color_to_draw4;
    let color_to_draw5;

    let percentage1;
    let percentage2;
    let percentage3;
    let percentage4;
    let percentage5;

     // Function to draw colors on the map based on slider value and color preference
    function draw_colors_to_map(slider_value, black_or_color) {
        // Define percentages for color scaling
        percentage1 = 50
        percentage2 = 40
        percentage3 = 30
        percentage4 = 20

        // // Set colors based on color preference
        if (black_or_color == 1) {
            color_to_draw1 = "FFFFFF";
            color_to_draw2 = "CCCCCC";
            color_to_draw3 = "999999";
            color_to_draw4 = "666666";
            color_to_draw5 = "000000";
        }
        else if (black_or_color == 2) {
            color_to_draw1 = "662506";
            color_to_draw2 = "cc4c02";
            color_to_draw4 = "fee391";
            color_to_draw3 = "fe9929";
            color_to_draw5 = "000000";
        }


        let world_map_or_horizontal_bar_graph = 1;
        // Adjust percentages and visualization type based on slider value
        if (slider_value == 2) {
            world_map_or_horizontal_bar_graph = 2;
            percentage1 = 35;
            percentage2 = 27;
            percentage3 = 20;
            percentage4 = 10;
        }
        else if (slider_value == 3) {
            percentage1 = 16.5;
            percentage2 = 10;
            percentage3 = 5;
            percentage4 = 1;
            world_map_or_horizontal_bar_graph = 3;
        }
        else if (slider_value == 4) {
            percentage1 = 6.9;
            percentage2 = 5.5;
            percentage3 = 3.9;
            percentage4 = 0.4;
            world_map_or_horizontal_bar_graph = 4;
        }
        else if (slider_value == 5) {
            percentage1 = 6.5;
            percentage2 = 4.5;
            percentage3 = 1;
            percentage4 = 0.01;
            world_map_or_horizontal_bar_graph = 5;
        }
        else if (slider_value == 6) {
            percentage1 = 5.9;
            percentage2 = 2.5;
            percentage3 = 0.9;
            percentage4 = 0.01;
            world_map_or_horizontal_bar_graph = 6;
        }
        else if (slider_value == 7) {
            percentage1 = 1.5;
            percentage2 = 1;
            percentage3 = 0.5;
            percentage4 = 0.01;
            world_map_or_horizontal_bar_graph = 7;
        }
        else if (slider_value == 8) {
            percentage1 = 0.8;
            percentage2 = 0.3;
            percentage3 = 0.1;
            percentage4 = 0;
            world_map_or_horizontal_bar_graph = 8;
        }
        let temporary_check_int = 0;

        // Load the GeoJSON data
        d3.json("Maps_JSON/world-countries.json").then(function (world) {
            // Draw the countries
            const TotalCountries = world.features;
            // console.log(TotalCountries.length);

            // Extract data from CSV
            let ExtractedData = [];
            for (let i = 0; i < data.length; i++) {

                let individualCountryData = [];
                let countryName = data[i].Country;
                // console.log(countryName);
                let population_of_country = data[i].Population;
                // console.log(population_of_country);
                let positive_a = data[i].A_POSITIVE;
                // console.log(positive_a);
                let positive_b = data[i].B_POSITIVE;
                // console.log(positive_b);
                let positive_o = data[i].O_POSITIVE;
                // console.log(positive_o);
                let positive_ab = data[i].AB_POSITIVE;
                // console.log(positive_ab);
                let negative_a = data[i].A_NEGATIVE;
                // console.log(negative_a);
                let negative_b = data[i].B_NEGATIVE;
                // console.log(negative_b);
                let negative_o = data[i].O_NEGATIVE;
                // console.log(negative_o);
                let negative_ab = data[i].AB_NEGATIVE;
                // console.log(negative_ab);
                individualCountryData.push(countryName, positive_o, positive_a, positive_b, positive_ab, negative_o, negative_a, negative_b, negative_ab)
                ExtractedData.push(individualCountryData);
            }
            // console.log(ExtractedData);



            svg.selectAll("path").remove();    // Remove existing paths

            svg.selectAll("path")
                .data(world.features)
                .enter().append("path")
                .attr("d", path)
                .attr("fill", function (d) {
                    // console.log(d.id);
                    let small_temporary_check = 0;
                    for (let j = 0; j < ExtractedData.length; j++) {
                        
                        if (ExtractedData[j][0] == d.properties.name) {
                            temporary_check_int = temporary_check_int + 1;
                            var individualCountryExportData = ExtractedData[j][world_map_or_horizontal_bar_graph];
                            result = individualCountryExportData.replace('%', '');
                            // console.log(result);
                            // console.log(slider_value)
                            // console.log(world_map_or_horizontal_bar_graph);
                            // console.log(d.properties.name);

                            // Determine fill color based on data
                            if (result > percentage1) {
                                console.log("TEST AGAIN");
                                // console.log(individualCountryExportData);
                                return "#" + color_to_draw1;
                            }
                            else if (result > percentage2) {

                                // console.log("HELLO");
                                return "#" + color_to_draw2;
                            }
                            else if (result > percentage3) {

                                // console.log(individualCountryExportData);
                                // console.log("HELLO");
                                return "#" + color_to_draw3;
                            }
                            else if (result > percentage4) {
                                // console.log("EHE");
                                // console.log("HELLO");
                                return "#" + color_to_draw4;

                            }
                            else {
                                return "#" + color_to_draw5;
                            }

                        }

                    }

                })
                .attr("stroke", "#000080")
                .attr("stroke-width", 2)
                .on("mouseover", function (event, d, i) {
                    let point = this.getAttribute('class');
                    // console.log(point);

                    // console.log(this);
                    d3.select(this)
                                   .attr("stroke-width", 4);
                    // Calculate the position of the tooltip relative to the SVG container
                    let result;
                    for (let j = 0; j < ExtractedData.length; j++) {
                        if (ExtractedData[j][0] === d.properties.name) {
                            var individualCountryExportData = ExtractedData[j][world_map_or_horizontal_bar_graph];
                            result = individualCountryExportData.replace('%', '');
                            break;
                        }
                    }
                    const tooltipX = event.offsetX + 300;
                    const tooltipY = event.offsetY + 400;

                    tooltip.html(` ${d.properties.name}, ${result}%`)
                        .style("left", tooltipX + "px")
                        .style("top", tooltipY + "px")
                        .style("opacity", 1)
                        .style('visibility', "visible");

                })
                .on("mouseout", (d) => {
                    tooltip.style('visibility', "hidden");
                    svg.selectAll("path")
                                   .attr("stroke-width", 2);
                });
            // console.log(temporary_check_int);
        });

    }

    // Adding Tool Tip to the Graphs
    const tooltip = d3.select("#world-map").append("div")
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
        slidervalue = importexportSlider.value;
        black_or_color = black_white_or_color.value;
        // console.log(black_or_color);
        draw_colors_to_map(slidervalue, black_or_color);
        // console.log(slidervalue);
    }

    // Initial update
    await updateSliderId();

    // Adding event listener to update slider id when value changes
    importexportSlider.addEventListener('input', updateSliderId);
    black_white_or_color.addEventListener('input', updateSliderId);

});