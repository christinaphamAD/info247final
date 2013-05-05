// INFO 247 - Final Project
// Bar Chart
//if d3 not in repo, put this line in html: <script src="http://d3js.org/d3.v3.min.js"></script>


d3.csv("js/lab_bar_data.csv", function(error, data) {

var height = 45 // PREVIOUSLY 95
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
    .domain(axisvalues)
  	.rangeBands([0,parseInt(d3.select('#canvas').style('width').split('p'))*.87]);

  var init = d3.scale.ordinal()
    .domain(axisvalues)
  	.rangeBands([0,0])

  var xaxis = canvas.append('g')
    .attr('class','axis')
    .attr('transform','translate('+((d3.select('#canvas').style('width').split('p')[0])*.125)+','+
    							   (d3.select('#canvas').style('height').split('p')[0]*.85)+')')
    .attr('stroke',color)
    .attr('fill',color)
    .call(d3.svg.axis()
      .scale(init)
      .orient('bottom')
      .tickSize(0)
      .tickPadding(10))
    .transition()
    .duration(1000)
    .call(d3.svg.axis()
    	.scale(xscale)
    	.orient('bottom')
      .tickSize(0)
      .tickPadding(19))
    .selectAll("text")
      .style("text-anchor","end")
      .attr("font-size",10)
      .attr("dx",13.5)
      .attr("transform",function(d){
        return "rotate(-22.5)"
      });
  
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
  		//.range([0,0])

  var fin = d3.scale.linear()
  		.range([0,-1*parseInt(d3.select('#canvas').style('height').split('p'))*.87]);

  var yindent = parseInt(d3.select("#canvas").style('height').split('p')[0])
  var xindent = parseInt(d3.select("#canvas").style('width').split('p')[0])

  var xinit = (d3.select("#canvas").style('width').split('p')[0]*.125)
  var yinit = (d3.select("#canvas").style('height').split('p')[0]*.85)


	var yaxis = canvas.append('g')
    	.attr('class','axis')
    	.attr('transform','translate('+xinit+','+yinit+')')
    	.attr('stroke',stroke)
    	.attr('fill',stroke)
    	.call(d3.svg.axis()
      		.scale(init)
      		.orient('left')
          .tickSize(0))
    	.transition()
    	.duration(1000)
    	.call(d3.svg.axis()
    		.scale(fin)
    		.orient('left')
        .tickFormat("")
        .tickSize(0));
  var yaxislabel = canvas.append('text')
      .attr('font-size',13)
	    .attr('class', 'y label')
	    .attr('text-anchor','end')
     //  .attr('dy','.75em')
      .attr('transform',"rotate(-90)")
      .attr('font-family','Helvetica')
      .attr('stroke',stroke)
      .attr('fill',stroke)
      .attr('stroke-width',-1)
      .text("#Abnormal Lab Results")
      .attr('y',yindent*.065)
      .attr('x',xindent*.05-yinit)
      .style('opacity',0)
      .attr('dy',7.5)
      .transition()
      .duration(1000)
      .style('opacity',1)
	    .attr('y',1*yindent*.065)
	    .attr('x',-1*(xindent*.05))
      .attr('dy',7.5);


	return yscale
	} 

function drawBars(chart){
	var x = drawXAxis('rgb(124, 123, 123)')
	var y = drawYAxis('rgb(124, 123, 123)')

  	x.domain(data.map(function(d) {return d.lab; }));
  	y.domain([0, d3.max(getyAxisValues(data))]);

var xshift = (parseInt(d3.select("#canvas").style('width').split('p'))*0.125)
var yshift = (parseInt(d3.select("#canvas").style('height').split('p'))*0.85)

  	canvas.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("id",function(d){      //Christina, this is where you should add the id you want
        return (d.lab)
      })
      .attr('fill','#1f77b4')
      .attr("x", function(d) { return xshift+ x(d.lab); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { console.log(d.numablabs); return y(d.numablabs) })
      .attr("height", function(d,i) { return yshift-y(d.numablabs); })
      .style('opacity',0)
      .transition()
      .delay(function(d,i){
      	return 200+250*i
      })
      .style('opacity',1)
	  .duration(600);
	  //.ease('linear');

  canvas.selectAll('.barlabel')
    .data(data)
  .enter().append('text')
  .attr('class','barlabel')
  .attr('x',function(d,i){
    return xshift +x(d.lab) + x.rangeBand()/2
  })
  .attr('y',function(d){return y(d.numablabs)})
  .attr('dy',15)
  //.attr('dx',)
  .attr('text-anchor','middle')
  .attr('fill','white')
  .text(function(d){return d.numablabs});

  canvas.selectAll('.drop')
    .data(data)
    .enter().append('svg:line')
    .attr('class','drop')
    .attr('stroke','rgb(124, 123, 123)')
    .style('opacity',0)
    .attr("x1", function(d) { return xshift+ x(d.lab) + x.rangeBand(); })
    .attr("y1", function(d) { return yshift  })
    .attr("x2", function(d) { return xshift + x(d.lab) + x.rangeBand(); })
    .attr("y2", function(d) { return yshift })
    .transition()
    .delay(500)
    .duration(500)
    .style('opacity',1)
    .attr('stroke-width','2')
    .style("stroke-dasharray", (".75"))
    .attr("x1", function(d) { return xshift+ x(d.lab) + x.rangeBand(); })
    .attr("y1", function(d) { return yshift  })
    .attr("x2", function(d) { return xshift + x(d.lab) + x.rangeBand(); })
    .attr("y2", function(d) { return yshift+12; })





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
      data_arr.push(data[i]['lab'])
    }
    return data_arr
  }

function getyAxisValues(data){
    var data_arr = new Array()
    for (var i=0;i<data.length;i++){
      //var twoel = Array(data[i]['Date']).concat(Array(data[i]['Hours']))
      var toadd = +(data[i]['numablabs'])
      // console.log(typeof toadd)
      data_arr.push(toadd)
    }
    return data_arr	
}






})




