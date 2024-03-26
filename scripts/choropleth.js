
document.addEventListener('DOMContentLoaded', async function () {
    const importexportSlider = document.getElementById('slider');
    let slidervalue = importexportSlider.value;

    // Set up the SVG dimensions
    const width = 1296;
    const height = 724;

    // Create SVG element
    const svg = d3.select("#world_map")
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
    const data = await d3.csv("../data_sets/data.csv");
    console.log(data);

    function draw_colors_to_map(slider_value) {
        let export_or_import = 1;
        if (slider_value == 2) {
            export_or_import = 2;
        }
        console.log(export_or_import)
        // Load the GeoJSON data
        d3.json("../data_sets/world-110m.geojson").then(function (world) {
            // Draw the countries
            const TotalCountries = world.features;
            // console.log(TotalCountries.length);
            let ExtractedData = [];
            for (let i = 0; i < data.length; i++) {
                let individualCountryData = [];
                if (data[i].FinancialYearStart == 2019) {

                    let ExportValueOfCountry = data[i].Export;
                    individualCountryData.push(data[i].Country);
                    individualCountryData.push(ExportValueOfCountry);
                    individualCountryData.push(data[i].Import);
                    ExtractedData.push(individualCountryData);
                }
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
                        if (ExtractedData[j][0] == d.properties.name.toUpperCase()) {
                            // console.log(j);
                            // console.log(ExtractedData[j][0]);
                            var individualCountryExportData = ExtractedData[j][export_or_import];
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
                            else if (individualCountryExportData == 0){
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
                .on("mouseout", function(d){
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