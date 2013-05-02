d3.csv("js/lab_bar_data.csv", function(error, data) {

var height = 95
var width = 100

var chart = d3.select("body").append("div")
    .attr("class", "chart");
