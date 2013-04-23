// INFO 247 - Final Project
// Donut Chart
//if d3 not in repo, put this line in html: <script src="http://d3js.org/d3.v3.min.js"></script>


d3.csv("js/data.csv", function(error, data) {

  var endpos = data;
  var startpos = [0,0,0,0,0,0,1]; //todo: make this as long as data categories

  var data = processData(startpos,endpos)

  var width = 160
      height = 140
      radius = 200

  var color = d3.scale.category20();

  var pie = d3.layout.pie()
      .sort(null);

  var arc = d3.svg.arc()
      .innerRadius(radius - 100)
      .outerRadius(radius - 60);

  var svg = d3.select("#testd3").append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .append("g")
      .attr("transform", "translate(" + width  + "," + height  + ")");

  var path = svg.selectAll("path")
      .data(pie(data.start))
      .enter().append("path")
      .attr("fill", function(d, i) { return color(i); })
      .attr("d", arc)
      .each(function(d) {
        //console.log(this)
        this._current = d;     // store the initial values
        console.log(this._current)
       // path = path.data(pie(data[this.end])); // update the data
        //path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
      })
      .data(pie(data['end']))
      .transition().duration(1500).attrTween("d", arcTween);
      


function processData(startpos , endpos) {
  var endlist = makeList(endpos);
  var map = {};
  map['start'] = startpos;
  map['end'] = endlist;
  return map
}

function makeList(data){
  var returnarr = new Array();
  data.forEach(function(d){
    d.population = +d.population
    returnarr.push(d.population)
  });
  return returnarr
}

// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.
function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

});








