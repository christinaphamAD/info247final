// INFO 247 - Final Project
// Bar Chart
//if d3 not in repo, put this line in html: <script src="http://d3js.org/d3.v3.min.js"></script>


d3.csv("js/data.csv", function(error, data) {

var height = 95
var width = 100



var canvas = d3.select("#ablab").append("svg")
  .attr({
    "id":"canvas",
    "height": height+'%',
    "width": width+'%'
    });

drawMat();



function drawMat(){
  var mat = d3.select('#canvas')
    .append('rect')
    .attr({
      'id':'mat',
      'height': 100+'%',
      'width': 100+'%',
      'fill': 'rgb(255, 255, 255)'       
    });
    //.style('opacity',0);
   drawChart();
}

function drawXAxis(color){
	var axisvalues = getxAxisValues(data)
	
	var xscale = d3.scale.ordinal()
  	.rangeBands([0,parseInt(d3.select('#canvas').style('width').split('p'))*.87]);

  var init = d3.scale.ordinal()
  	.rangeBands([0,0])

  var xaxis = canvas.append('g')
    .attr('class','axis')
    .attr('transform','translate('+((d3.select('#canvas').style('width').split('p')[0])*.10)+','+
    							   (d3.select('#canvas').style('height').split('p')[0]*.92)+')')
    .attr('stroke',color)
    .attr('fill',color)
    .call(d3.svg.axis()
      .scale(init)
      .orient('bottom'))
    .transition()
    .duration(1000)
    .call(d3.svg.axis()
    	.scale(xscale)
    	.orient('bottom'));
  
/*
  var xaxislabel = canvas.append('text')
    .attr('class','x label')
    .attr('text-anchor', 'end')
    .attr('x','50%')
    .attr('y', '50%')
    .attr('font-family','Helvetica')
    .attr('stroke',color)
    .attr('fill',color)
    .attr('stroke-width',-1)
    .text('Days Recorded');
*/
	return xscale
}

function drawYAxis(stroke){
  	var axisvalues = getyAxisValues(data)
	var yscale = d3.scale.linear()
  	//.domain([axisvalues])
  	.range([parseInt(d3.select('#canvas').style('height').split('p'))*.87,0]);

	var init = d3.scale.linear()
  		//.domain([axisvalues])
  		.range([0,0])

  	var fin = d3.scale.linear()
  		.range([-1*parseInt(d3.select('#canvas').style('height').split('p'))*.87,0]);

	var yaxis = canvas.append('g')
    	.attr('class','axis')
    	.attr('transform','translate('+((d3.select('#canvas').style('width').split('p')[0])*.10)+','+
    							   (d3.select('#canvas').style('height').split('p')[0]*.92)+')')
    	.attr('stroke',stroke)
    	.attr('fill',stroke)
    	.call(d3.svg.axis()
      		.scale(init)
      		.orient('left'))
    	.transition()
    	.duration(1000)
    	.call(d3.svg.axis()
    		.scale(fin)
    		.orient('left'));
  	/*var yaxislabel = canvas.append('text')
	    .attr('class', 'y label')
	    .attr('text-anchor','end')
	    .attr('y',charty+shift-fontshift+5)
	    .attr('x',-(chartx+3))
	    .attr('dy','.75em')
	    .attr('transform',"rotate("+rot+")")
	    .attr('font-family','Helvetica')
	    .attr('stroke',stroke)
	    .attr('fill',stroke)
	    .attr('stroke-width',-1)
	    .text(label)
	    */
	    return yscale
	} 

function drawBars(chart){
	var x = drawXAxis('black')
	var y = drawYAxis('black')

  	x.domain(data.map(function(d) { return d.age; }));
  	y.domain([0, d3.max(getyAxisValues(data))]);

  	console.log(chart)
  	canvas.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return parseInt(d3.select('#canvas').style('width').split('p'))*0.1 + x(d.age); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.population) })
      .attr("height", function(d,i) { return (parseInt(d3.select('#canvas').style('height').split('p'))*0.92)-y(d.population); })
      .style('opacity',0)
      .transition()
      .delay(function(d,i){
      	return 100 
      })
      .style('opacity',1)
	  .duration();
	  //.ease('linear');
}


function drawChart(){
    var chart = d3.select('#canvas')
      .append('rect')
      .attr({
          'id': 'bg',
          "x": 10+'%',
          "y": 5+'%',
          "fill": "rgb(255, 255, 255)",
          "height": 87+'%',
          "width" : 87+'%'
      });

      drawBars(chart)
     /* .transition()
      .attr({
        'width': width
      })
      .ease('linear')
      .duration(500)
      .delay(100)
      .each('end',function(){
        drawlines();
        drawXAxis('white')
        drawYAxis(runscale,'left',0,0,'rgb(255,255,255)','Avg Run Speed (mph)',-90);
        drawYAxis(sleepscale,'right',width,23,'#c03737','Hours Slept',-90);
      });
*/
}

function getxAxisValues(data){
	//console.log(data)
    var data_arr = new Array()
    for (var i=0;i<data.length;i++){
      //var twoel = Array(data[i]['Date']).concat(Array(data[i]['Hours']))
      data_arr.push(data[i]['age'])
    }
    return data_arr
  }

function getyAxisValues(data){
    var data_arr = new Array()
    for (var i=0;i<data.length;i++){
      //var twoel = Array(data[i]['Date']).concat(Array(data[i]['Hours']))
      var toadd = +(data[i]['population'])
      console.log(typeof toadd)
      data_arr.push(toadd)
    }
    return data_arr	
}






})







/*
function drawlines(){
  for (var i=0;i<verticks;i++){
    var line = canvas.append("line")
      .attr({
        'class':'line',
        "x1": chartx,
        "y1": charty+ i*(height/verticks),
        "x2": chartx,
        "y2": charty+ i*(height/verticks)
      })
      .style({
        stroke:'rgb(255, 255, 255)',
        'stroke-width':1   
      })
      .transition()
      .attr({
        "x2": chartx + width,
      })
      .ease('linear')
      .delay(300)
      .duration(250);
   }
   getSleepData();
   getRunData();
   makeVis('#mat')
   appendText('Love, Sleep, and Athletic Performance',30,'chart_text',chartx+5,charty-15);
   appendNote('Night of first kiss',20,465,320,-25);
   appendNote('Valentines Day',20,600,665,8);
   appendNote('Pretty much stopped running here...',19,895,640,0)
   appendNote('After She Left :(',20,955,705,25);
}




function getSleepData(){
  var data = d3.tsv('data.csv',function(data){
    var data_arr = Array()
    for (var i=0;i<data.length;i++){
      var twoel = Array(data[i]['Date']).concat(Array(data[i]['Hours']))
      data_arr.push(twoel)
    }
    appendLine(data_arr,'rgb(192, 55, 55)',sleepscale,'sleepline') 
  })
}

function appendLine(data,color,yscale,id){
  var line = d3.svg.line()
    .defined(function(d) {
     return !(d[1] ==''|| isNaN(d[1]));})
    .x(function(d,i){return xscale(i); })
    .y(function(d){
      return yscale(d[1]); })
    .interpolate('basis');
  var series = d3.select('svg')
    .append('svg:path')
    .attr('d',line(data))
    .attr("stroke",color)
    .attr("fill","none")
    .attr("stroke-width", 3)
    .attr("id",id);
  var totalLength = series.node().getTotalLength();
  series
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(3500)
    .ease("linear")
    .attr("stroke-dashoffset", 0);
}

*/  