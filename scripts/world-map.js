
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
    console.log(data);

    function draw_colors_to_map(slider_value) {
        let world_map_or_horizontal_bar_graph = 1;
        if (slider_value == 2) {
            world_map_or_horizontal_bar_graph = 2;
        }
        console.log(world_map_or_horizontal_bar_graph)
        // Load the GeoJSON data
        d3.json("Maps_JSON/world-countries.json").then(function (world) {
            // Draw the countries
            const TotalCountries = world.features;
            console.log(TotalCountries.length);
            let ExtractedData = [];
            for (let i = 0; i < data.length; i++) {
                let individualCountryData = [];
                let population_of_country = data[i].Population;
                console.log(population_of_country);
                let positive_a = data[i].A_POSITIVE;
                console.log(positive_a);
                let positive_b = data[i].B_POSITIVE;
                console.log(positive_b);
                let positive_o = data[i].O_POSITIVE;
                console.log(positive_o);
                let positive_ab = data[i].AB_POSITIVE;
                console.log(positive_ab);
                let negative_a = data[i].A_NEGATIVE;
                console.log(negative_a);
                let negative_b = data[i].B_NEGATIVE;
                console.log(negative_b);
                let negative_o = data[i].O_NEGATIVE;
                console.log(negative_o);
                let negative_ab = data[i].AB_NEGATIVE;
                console.log(negative_ab);
                individualCountryData.push(positive_o, positive_a, positive_b, positive_ab, negative_o, negative_a, negative_b, negative_ab)
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

                    for (let j = 0; j < ExtractedData.length; j++) {
                        console.log(ExtractedData.length);
                        if (ExtractedData[j][0] == d.properties.name) {
                            // console.log(j);
                            // console.log(ExtractedData[j][0]);
                            var individualCountryExportData = ExtractedData[j][world_map_or_horizontal_bar_graph];
                            if (individualCountryExportData > 100) {
                                // console.log(individualCountryExportData)
                                return "#ACD39E";
                            }
                            else if (individualCountryExportData > 25) {
                                // console.log(individualCountryExportData);
                                return "#D9F0D3";
                            }
                            else if (individualCountryExportData > 10) {
                                // console.log(individualCountryExportData);
                                return "#F7F7F7";
                            }
                            else if (individualCountryExportData > 5) {
                                return "#C2A5CF";

                            }
                            else if (individualCountryExportData > 1) {
                                return "#762A83";
                            }
                            else if (individualCountryExportData > 0) {
                                return "#FEE391";
                            }
                            else if (individualCountryExportData == 0) {
                                console.log("found")
                                return "red";
                            }
                            else {
                                return "#1B7837";

                            }

                        }
                    }

                })
                .attr("stroke", "white")
                .attr("stroke-width", 0.5)
                .on("mouseover", function (d) {
                    d3.select(this)
                        .attr("stroke-width", 2)
                })
                .on("mouseout", function (d) {
                    d3.select(this)
                        .attr("stroke-width", 0.5)
                })
        });

    }



    // Function to update slider id
    async function updateSliderId() {
        slidervalue = importexportSlider.value;
        draw_colors_to_map(slidervalue);
        console.log(slidervalue);
    }

    // Initial update
    await updateSliderId();

    // Adding event listener to update slider id when value changes
    importexportSlider.addEventListener('input', updateSliderId);

});