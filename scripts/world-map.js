
document.addEventListener('DOMContentLoaded', async function () {
    const importexportSlider = document.getElementById('slider');
    let slidervalue = importexportSlider.value;


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

    function draw_colors_to_map(slider_value) {
        let world_map_or_horizontal_bar_graph = 1;
        if (slider_value == 2) {
            world_map_or_horizontal_bar_graph = 2;
        }
        else if (slider_value == 3){
            world_map_or_horizontal_bar_graph = 3; 
        }
        else if ( slider_value == 4){
            world_map_or_horizontal_bar_graph = 4; 
        }
        else if ( slider_value == 5 ){
            world_map_or_horizontal_bar_graph = 5; 
        }
        else if ( slider_value == 6 ){
            world_map_or_horizontal_bar_graph = 6; 
        }
        else if ( slider_value == 7 ){
            world_map_or_horizontal_bar_graph = 7; 
        }
        else if(slider_value == 8){
            world_map_or_horizontal_bar_graph = 8;
        }
        let temporary_check_int = 0; 
        // console.log(world_map_or_horizontal_bar_graph)
        // Load the GeoJSON data
        d3.json("Maps_JSON/world-countries.json").then(function (world) {
            // Draw the countries
            const TotalCountries = world.features;
            // console.log(TotalCountries.length);
            
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
            // console.log(ExtractedData)

            svg.selectAll("path").remove();

            svg.selectAll("path")
                .data(world.features)
                .enter().append("path")
                .attr("d", path)
                .attr("fill", function (d) {
                    // console.log(d.id);
                    let small_temporary_check = 0;
                    for (let j = 0; j < ExtractedData.length; j++) {
                        // console.log(ExtractedData.length);
                        // console.log(ExtractedData);
                        // console.log(ExtractedData[j][0]);
                        // console.log(d.properties.name);
                        if (ExtractedData[j][0] == d.properties.name) {
                            temporary_check_int = temporary_check_int  + 1; 
                            // console.log(ExtractedData);
                            var individualCountryExportData = ExtractedData[j][world_map_or_horizontal_bar_graph];
                            result = individualCountryExportData.replace('%', '');
                            console.log(result);
                            // console.log(slider_value)
                            // console.log(world_map_or_horizontal_bar_graph);
                            // console.log(d.properties.name);

                            if (result > 50) {
                                // console.log(individualCountryExportData);
                                return "#FFFFFF";
                            }
                            else if (result > 40) {
                                // console.log(individualCountryExportData);
                                return "#D3D3D3";
                            }
                            else if (result > 30) {
                                return "#A9A9A9";
                            }
                            
                            else {
                                return "#000000";
                            }

                        }
                        
                    }

                })
                .attr("stroke", "white")
                .attr("stroke-width", 0.5)
                .on("mouseover", function (event, d, i) {
                    let point = this.getAttribute('class');
                    // console.log(point);
    
                    // console.log(this);
                    // d3.select(this).style("fill", "orange");
                    // Calculate the position of the tooltip relative to the SVG container
                    const tooltipX = event.offsetX  +500;
                    const tooltipY = event.offsetY + 300;
    
                    tooltip.html(` ${d.properties.name}`)
                        .style("left", tooltipX + "px")
                        .style("top", tooltipY + "px")
                        .style("opacity", 1)
                        .style('visibility', "visible");
    
                })
                .on("mouseout", (d) => {
                    tooltip.style('visibility', "hidden");
                });
                // console.log(temporary_check_int);
        });
       
    }

    // Adding Tool Tip to the Graphs
    const tooltip = d3.select("#world-map").append("div")
    .attr("class", "tooltip")
    .style("opacity", 1)
    .style("position", "absolute")
    .style("width", function(d) {
        // Adjust width dynamically based on content
        // For example:
        return 100 + "px"; // Adjust multiplier as needed
    })
    .style("height", function(d) {
        // Adjust width dynamically based on content
        // For example:
        return 50 + "px"; // Adjust multiplier as needed
    });
    // Function to update slider id
    async function updateSliderId() {
        slidervalue = importexportSlider.value;
        draw_colors_to_map(slidervalue);
        // console.log(slidervalue);
    }

    // Initial update
    await updateSliderId();

    // Adding event listener to update slider id when value changes
    importexportSlider.addEventListener('input', updateSliderId);

});