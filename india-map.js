
    let margin = {top: 10, right: 20, bottom: 10, left: 450};
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
    
    Promise.all([
      d3.json("india-states.json"),
      d3.csv("blood_data.csv")
    ]).then(function(data){
      let geoJsonData = data[0];
      let bloodData = data[1];
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
            + "Donations: " + d.donations + "</br>" 
            + "Requirements: " + d.requirements + "</br>")
            
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");
            
            let barData1 = [
              { type: "Donations", value: d.donations },
            ];

            let barData2 = [
              { type: "Requirements", value: d.requirements }
            ];
            
            let tooltipSvg = div.append("svg")
              .attr("width", 150)
              .attr("height", 100);
            
            let xScale = d3.scaleBand()
              .domain(["Donations", "Requirements"])
              .range([0, 100])
              .padding(0.1);
            
            let yScale = d3.scaleLinear()
              .domain([0, Math.max(d.donations, d.requirements)])
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

            let bars2 = tooltipSvg.selectAll(".bar2")
              .data(barData2)
              .enter()
              .append("rect")
                .attr("class", "bar-requirements")
                .attr("x", d => xScale(d.type))
                .attr("y", d => yScale(d.value))
                .attr("width", xScale.bandwidth())
                .attr("height", d => 80 - yScale(d.value));
            
          })					
          .on("mouseout", function(d) {		
            div.style("opacity", 0);
            div.selectAll("svg").remove();
          });
      
      let colorScale = d3.scaleLinear()
        .domain([0.5, 1, 2])
        .range(['red', 'lightblue', 'blue']);
        
      india.selectAll('path')
        .data(bloodData)
        .style("fill", function(d) {
          let ratio = d.donations / d.requirements;
          return colorScale(ratio);
        });
              
    })
