/*
Copyright me
2017
*/


var form = document.getElementById('dataSelector');
form.addEventListener('change', changeDataset);

var draw = function (datasetName) {
    //Map dimensions (in pixels)
    var width = 519,
        height = 600;

    //Map projection
    var projection = d3.geoMercator()
        .scale(46567.862117552664)
        .center([-122.72168747117493, 38.09163738233181]) //projection center
        .translate([width / 2, height / 2]) //translate to center the map in view

    //Generate paths based on projection
    var path = d3.geoPath()
        .projection(projection);

    //Create an SVG
    var svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);

    //Group for the map features
    var features = svg.append("g")
        .attr("class", "features");

    var aa = [-122.564028, 38.001146];
    var bb = [-122.645678, 37.969131];
    svg.selectAll("circle")
  		.data([aa,bb]).enter()
  		.append("circle")
  		.attr("cx", function (d) { console.log(projection(d)); return projection(d)[0]; })
  		.attr("cy", function (d) { return projection(d)[1]; })
  		.attr("r", "3px")
  		.attr("fill", "red")

    /* Initialize tooltip */
    tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function (d) {
            let minutes = d.rate / 60;
            let seconds = minutes - 1;
            seconds = seconds * 60;
            minutes = Math.round(minutes);
            return (`<h1 class="tooltip"> Time: ${minutes}:${seconds}</h1>`)
        });

    /* Invoke the tip in the context of your visualization */
    svg.call(tip);

    //Create zoom/pan listener
    //Change [1,Infinity] to adjust the min/max zoom scale
    var zoom = d3.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);

    svg.call(zoom);

    var datasets = {}; // Not a literal map
    datasets['responseTime'] = {};
    datasets['dispachTime'] = {};
    datasets['hospitalized'] = {};
    d3.queue()
        .defer(d3.json, "zipcodes.geojson")
        .defer(d3.tsv, "response_time.tsv", function (d) {
            datasets['responseTime'][d.zip_code] = d.value;
        })
        .defer(d3.tsv, "dispach_time.tsv", function (d) {
            datasets['dispachTime'][d.zip_code] = d.value;
        })
        .defer(d3.tsv, "percent_hospitalized.tsv", function (d) {
            datasets['hospitalized'][d.zip_code] = d.value;
        })
        .await(ready);



    function ready(error, geodata) {
        if (error) console.log(error); //unknown error, check the console

        // Generate colors
        var formattedValues = [];

        Object.values(datasets[datasetName]).forEach(function (v){
            if(v != 0){
                formattedValues.push(v);
            }
        })

        console.log(Object.values(datasets[datasetName]).map(Number).sort());

        var color = d3.scaleLinear()
            .domain([0, d3.max(Object.values(datasets[datasetName]))/9])
            .range(d3.schemeBlues[9]);

        //Create a path for each map feature in the data
        features.selectAll("path")
            .data(geodata.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", function (d) {
                return color(d.rate = datasets[datasetName][d.properties.zip_code_geo]);
            })
            .on("click", clicked)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)

    }
    //Update map on zoom/pan
    function zoomed() {
        // console.log(d3.event.transform);
        svg.attr("transform", d3.event.transform);
    }

}

function changeDataset(e) {
    datasetName = e.target.id;
    draw(datasetName);
}

// Add optional onClick events for features here
// d.properties contains the attributes (e.g. d.properties.name, d.properties.population)
function clicked(d, i) {
    console.log(d);
    console.log(i);
}

draw("dispachTime");
