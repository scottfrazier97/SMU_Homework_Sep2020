$(document).ready(function() {
    makePlot();

    //event listener
    $(window).resize(function() {
        makePlot();
    });
});

function makePlot() {
    d3.csv("assets/data/data.csv").then(function(census_data) {
        console.log(census_data);

        // STEP 1: SET UP THE CANVAS
        $("#scatter").empty();

        var svgWidth = window.innerWidth;
        var svgHeight = 500;

        var margin = {
            top: 20,
            right: 40,
            bottom: 60,
            left: 50
        };

        var chart_width = svgWidth - margin.left - margin.right;
        var chart_height = svgHeight - margin.top - margin.bottom;

        // STEP 2: CREATE THE SVG (if it doesn't exist already)
        var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .classed("chart", true);

        var chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // STEP 3: PREPARING THE DATA
        census_data.forEach(function(row) {
            row.poverty = +row.poverty;
            row.healthcare = +row.healthcare;
        });

        // STEP 4: CREATING SCALES
        var xScale = d3.scaleLinear()
            .domain(d3.extent(census_data, d => d.poverty))
            .range([0, chart_width]);

        var yScale = d3.scaleLinear()
            .domain(d3.extent(census_data, d => d.healthcare))
            .range([chart_height, 0]);

        // STEP 5: CREATING THE AXES
        var leftAxis = d3.axisLeft(yScale);
        var bottomAxis = d3.axisBottom(xScale);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${chart_height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);

        // STEP 5.5: Create the Text
        var textGroup = chartGroup.append("g")
            .selectAll("text")
            .data(census_data)
            .enter()
            .append("text")
            .text(d => d.abbr)
            .attr("alignment-baseline", "central")
            .attr("font-size", 12)
            .classed("stateText", true);

        // STEP 6: CREATE THE GRAPH
        var circlesGroup = chartGroup.append("g")
            .selectAll("circle")
            .data(census_data)
            .enter()
            .append("circle")
            .style("opacity", 0.25)
            .attr("stroke-width", "1")
            .classed("stateCircle", true);

        // STEP 6.5: Flying Circles
        chartGroup.selectAll("circle")
            .transition()
            .duration(5000)
            .attr("cx", d => xScale(d.poverty))
            .attr("cy", d => yScale(d.healthcare))
            .attr("r", "15")
            .style("opacity", 0.25)
            .delay(function(d, i) { return i * 100 });

        chartGroup.selectAll(".stateText")
            .transition()
            .duration(5000)
            .attr("x", d => xScale(d.poverty))
            .attr("y", d => yScale(d.healthcare))
            .delay(function(d, i) { return i * 100 });

        // STEP 7: Add Axes Labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 0)
            .attr("x", 0 - (chart_height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("% of those lacking healthcare");

        chartGroup.append("text")
            .attr("transform", `translate(${chart_width / 2}, ${chart_height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("Poverty %");

        // STEP 8: TOOLTIP
        // Step 1: Initialize Tooltip
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([180, -60])
            .html(function(d) {
                return (`<strong>${d.state}<strong><hr><strong>Poverty: ${d.poverty}%</strong><hr><strong>Lacks Healthcare: ${d.healthcare}%</strong>`);
            });

        // Step 2: Create the tooltip in chartGroup.
        circlesGroup.call(toolTip);

        // Step 3: Create "mouseover" event listener to display tooltip
        circlesGroup.on("mouseover", function(event, d) {
                toolTip.show(d, this);

                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("r", 100);
            })
            // Step 4: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function(event, d) {
                toolTip.hide(d);

                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("r", 15);
            });

    }).catch(function(error) {
        console.log(error);
    });
}