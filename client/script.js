var form = document.getElementById('dataSelector');
form.addEventListener('change', changeDataset);

//Map dimensions (in pixels)
var width = 519,
    height = 600;

//Map projection
var projection = d3.geoMercator()
    .scale(46567.862117552664)
    .center([-122.72168747117493,38.09163738233181]) //projection center
    .translate([width/2,height/2]) //translate to center the map in view

//Generate paths based on projection
var path = d3.geoPath()
    .projection(projection);

//Create an SVG
var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

//Group for the map features
var features = svg.append("g")
    .attr("class","features");

// Generate colors
var color = d3.scaleLinear()
    .domain([1, 30, 50, 60, 70, 120, 200, 300])
    .range(d3.schemeBlues[9]);

//Create zoom/pan listener
//Change [1,Infinity] to adjust the min/max zoom scale
var zoom = d3.zoom()
    .scaleExtent([1, 10])
    .on("zoom",zoomed);

svg.call(zoom);

var datasets = {}; // Not a literal map
datasets['responseTime'] = {};
datasets['dispachTime'] = {};
datasets['hospitalized'] = {};
d3.queue()
    .defer(d3.json, "zipcodes.geojson")
    .defer(d3.tsv, "response_time.tsv", function(d) { datasets['responseTime'][d.zip_code] = d.value; })
    .defer(d3.tsv, "dispach_time.tsv", function(d) { datasets['dispachTime'][d.zip_code] = d.value; })
    .defer(d3.tsv, "hospitalized.tsv", function(d) { datasets['hospitalized'][d.zip_code] = d.value; })
    .await(ready);



function ready(error,geodata) {
  if (error) console.log(error); //unknown error, check the console

  //Create a path for each map feature in the data
  features.selectAll("path")
    .data(geodata.features)
    .enter()
    .append("path")
      .attr("d",path)
      .attr("fill", function(d) { return color(d.rate = datasets['responseTime'][d.properties.zip_code_geo]); })
    .on("click",clicked);

}

function changeDataset(e) {
  datasetName = e.target.id;
  features.selectAll("path")
    .attr("fill", function(d) {
      if (datasets[datasetName]) {
        return color(datasets[datasetName][d.properties.zip_code_geo]);
      }
      else {
        return '#000000';
      }
    })
}

// Add optional onClick events for features here
// d.properties contains the attributes (e.g. d.properties.name, d.properties.population)
function clicked(d,i) {
  console.log(d);
  console.log(i);
}


//Update map on zoom/pan
function zoomed() {
  // console.log(d3.event.transform);
 svg.attr("transform", d3.event.transform);
}
