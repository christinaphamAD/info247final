// INFO 247 - Final Project
// Bar Chart
//if d3 not in repo, put this line in html: <script src="http://d3js.org/d3.v3.min.js"></script>

var margin = {top: 20, right: 20, bottom: 30, left: 40},
   // width = 960 - margin.left - margin.right,
   // height = 500 - margin.top - margin.bottom;
   	width = 100
   	height = 100

var formatPercent = d3.format(".0%");





d3.csv("js/data.csv", function(error, data) {



var x = d3.scale.ordinal()
    .rangeRoundBands([0, width
          ], .1)


    function what(){
          var compwidth = d3.select("svg").style("width")
          var w_str = compwidth.split('p')
          var w = parseInt(w_str)
          console.log(w)
          return w
          }  



var y = d3.scale.linear()
    .range([height, 0]);


var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);



  var svg = d3.select("#ablab").append("svg")
    //.attr("width", width + margin.left + margin.right)
    //.attr("width",width+"%")
    //.attr("height", height + margin.top + margin.bottom)
    //.attr("height",height+"%")
    //.append("g")
      .attr("width", width +"%")
      .attr("height", height+"%")
      .append("g")    
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  data.forEach(function(d) {
    d.population = +d.population;
  });

  x.domain(data.map(function(d) { 
    //console.log(d.age)
    return d.age; }));
  y.domain([0, d3.max(data, function(d) { return d.population; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (parseInt(
        d3.select("svg").style('width')
        .split('p')))
        +')')
       // function(){
        //  console.log("hi i'm here")
         // var compwidth = d3.select("svg").style("width")
         // var w_str = compwidth.split('p')
         // var w = parseInt(w_str)
         // console.log("hi i'm here")
         // return w
      //} + ")")
      //.attr("transform", "translate(0,"+ d3.select("svg").style("height"))
      .call(xAxis);

   //   console.log(d3.select("svg").style("height"))

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.age); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.population); })
      .attr("height", function(d) { return height - y(d.population); });

});

