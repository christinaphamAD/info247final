// INFO 247 - Final Project
// Donut Chart
//if d3 not in repo, put this line in html: <script src="http://d3js.org/d3.v3.min.js"></script>


d3.csv("js/donutdata.csv", function(error, data) {

  var endpos = data;
  var startpos = [0,1]; //todo: make this as long as data categories

  var data = processData(startpos,endpos)

  var width = 100   //160 of 432
      height = 35  //140 of 300 PREVIOUSLY 100
      radius = 200

  var wscaler = 0.37
  var hscaler = 0.4667


  var pie = d3.layout.pie()
      .sort(null);

  var arc = d3.svg.arc()
      .innerRadius(radius - 140)
      .outerRadius(radius - 100);

  var svg = d3.select("#testd3").append("svg")
      .attr("width", width +"%")
      .attr("height", height+"%")
      .append("g")
      .attr("transform", "translate(" + wscaler*
          function(){
            var compwidth = d3.select("svg").style("width")
            var w_str = compwidth.split('p')
            var w = parseInt(w_str)
            return w
          } 
          (d3.select('svg').style("width"))  + "," + hscaler*
          function(){
            var compheight = d3.select("svg").style("height")
            var h_str = compheight.split('p')
            var h = parseInt(h_str)
            return h
          }  
          (d3.select('svg').style('height'))+ ")");

var color = d3.scale.ordinal()
    .range(['rgba(255,34,34,0.75)', "#7bce80"]);

  var path = svg.selectAll("path")
      .data(pie(data.start))
      .enter().append("path")
      .attr("fill", function(d, i) { return color(i); })
      .attr("d", arc)
      .each(function(d) {
        //console.log(this)
        this._current = d;     // store the initial values
        //path = path.data(pie(data[this.end])); // update the data
        //path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
      })
      .data(pie(data['end']))
      .transition().duration(1500).attrTween("d", arcTween);

      //console.log("data",data)

    //very bad code.

    var abcol = 'rgb(255,34,34)'
    var normcol = "#7bce80"

    var beforedraw = 750
    var drawdur = 500

    var ablabel = svg.append('text')
      .attr('x',87.5)
      .attr('y',-100)
      .attr('stroke-width',0.5)
      .attr('class','donutlabel')
      .style("text-anchor", "left")
      .text( "186 Abnormal Labs")//function(d) { console.log(d.data.end)
      .style('opacity',0)
      .transition()
      .delay(beforedraw+drawdur-250)
      .duration(1000)
      .attr('stroke',abcol)
      .attr('fill',abcol)
      .style('opacity',1)

    var abline1 = svg.append('line')
      .attr('x1',45)
      .attr('y1',-87.5)
      .attr('x2',45)
      .attr('y2',-87.5)
      .transition()
      .delay(beforedraw)
      .duration(drawdur)
      .attr('x1',45)
      .attr('y1',-85)
      .attr('x2',62.5)
      .attr('y2',-105)
      .attr('stroke',abcol)
      .attr('fill',normcol) 

    var abline2 = svg.append('line')
      .attr('x1',62.5)
      .attr('y1',-105)
      .attr('x2',62.5)
      .attr('y2',-105)
      .transition()
      .delay(beforedraw+drawdur-250)
      .duration(drawdur)
      .attr('x1',62.5)
      .attr('y1',-105)
      .attr('x2',87.5)
      .attr('y2',-105)
      .attr('stroke',abcol)
      .attr('fill',normcol)

    var normlabel = svg.append('text')
      .attr('x',87.5)
      .attr('y',100)
      .attr('class','donutlabel')
      .style('text-anchor','left')
      .text("1529 Normal Labs")
      .style('opacity',0)
      .transition()
      .delay(beforedraw+drawdur-250)
      .duration(1000)
      .attr('stroke',normcol)
      .attr('fill',normcol)
      .attr('stroke-width',-1)
      .style('opacity',1)
      //.attr('font-size',15)

 


    var normline1 = svg.append('line')
      .attr('x1',52.5)
      .attr('y1',85)
      .attr('x2',52.5)
      .attr('y2',85)
      .transition()
      .delay(beforedraw)
      .duration(drawdur)
      .attr('x1',52.5)
      .attr('y1',85)
      .attr('x2',62.5)
      .attr('y2',95)
      .attr('stroke',normcol)
      .attr('fill',normcol) 

    var normline2 = svg.append('line')
      .attr('x1',62.5)
      .attr('y1',95)
      .attr('x2',62.5)
      .attr('y2',95)
      .transition()
      .delay(beforedraw+drawdur-250)
      .duration(drawdur)
      .attr('x1',62.5)
      .attr('y1',95)
      .attr('x2',87.5)
      .attr('y2',95)
      .attr('stroke',normcol)
      .attr('fill',normcol)
  


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
    d.Count = +d.Count
    returnarr.push(d.Count)
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








