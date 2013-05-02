// INFO 247 - Final Project
// Bullet Chart
//if d3 not in repo, put this line in html: <script src="http://d3js.org/d3.v3.min.js"></script>

var filestruc = "../patientData/"
var patient_id = "0B4C02C7-935D-411C-92C0-EAEC4BF0CFFD"

var patientfile = filestruc+patient_id

 

d3.csv(patientfile+"div1.csv", function(error, rawdat){

	var canvas = d3.select("#bullet").append('svg')
  		.attr({
    		"id":"canvas",
    		"height": '40'+'%',
    		"width": '100'+'%'
    	});

	var canvh = (parseInt(d3.select("#canvas").style('height').split('p')))
    var canvw = (parseInt(d3.select("#canvas").style('width').split('p')))

    var data = processData(rawdat)
   
	var mat = canvas.selectAll('.bulchart')
    	.data(data)
    	.enter()
    	.append('rect')
    	.attr('class','bulchart')
    	//.attr('fill','rgb(238, 236, 236)')
    	.attr('fill','white')
    	.attr('x',0)
    	.attr('y',function(d,i){
    		return (0 + (i)*(canvh)/5)
    	})
    	.attr('height',canvh/5)
    	.attr('width',canvw)
		.attr("id",function(d){
			//console.log(d[0]);  change this to actual id 
		});

	var charth = .05*canvh
	var chartw = .9*canvw


	var charts = canvas.selectAll('.chart')
		.data(data)
		.enter()
		.append('rect')
		.attr('class','chart')
		.attr('fill',function(d,i){
			console.log(i)
			return 'url(#_'+i+'_bgradient)'})
		.attr('height',canvh*.05)
		//.attr('width',canvw*.9)
		.attr('width',0)
		.attr('x', .08*canvw)
		.attr('y', function(d,i){
			return .05*canvh + i*(canvh*.10 + (canvh*.1))
		})
		.transition()
		.delay(function(d,i){
      	return 0+400*i;})
		.attr('width', canvw*.9)
      	.ease('linear')
      	.duration(1000)



    var normbars = canvas.selectAll('chart')
    	.data(data)
    	.enter()
    	.append('rect')
    	.attr('class','normbar')
//    	.attr('fill','purple')
//    	.attr('opacity',0.4)
		.attr('fill','url(#ngradient)')
    	.attr('height', charth)
    	.attr('width',0)
    	.attr('x',.08*canvw)
		.attr('y', function(d,i){
			return .05*canvh + i*(canvh*.10 + (canvh*.1))
		})
		.transition()
		.delay(function(d,i){
			return 0+400*i;})
		.attr('width',function(d){
			return (xScale(d,d[5]) - xScale(d,d[4]))
		})
		.attr('x',function(d){
			return xScale(d,d[3])
		})
		.ease('linear')
		.duration(750)

	var normticks = canvas.selectAll('.normtick')
		.data(data)
		.enter()
		.append('rect')
		.attr('class','normtick')
		.attr('fill','black')
		.attr('height',canvh*.075)
		.attr('width',chartw*.01)
		.attr('rx','2')
		.attr('ry','2')
		.attr('x', .07*canvw)
		.attr('y', function(d,i){
			return .04*canvh + i*(canvh*.10 + (canvh*.1))
		})
		.transition()
		.delay(function(d,i){
      		return 0+400*i;})
		.attr('x',function(d,i){
			var norm = (d[3]+d[4])/2
			return xScale(d,norm)
		})
      	.ease('linear')
      	.duration(1000)



    var circles = canvas.selectAll('.circle')
    	.data(data)
    	.enter()
    	.append('circle')
    	.attr('class','patientpt')
    	.attr('stroke','black')
    	.attr('stroke-width',2)
    	//.attr('fill',function(d,i){
    	//	console.log(colorscale(d,d[1]))
    	//	return colorscale(d,d[1])})
		.attr('fill','rgb(196, 193, 193)')
    	.attr('cy',function(d,i){
			return .075*canvh + i*(canvh*.10 + (canvh*.1))
		})
    	.attr('cx',.225*canvh)
    	.attr('r', .75*charth)
    	.transition()
		.delay(function(d,i){
			return 0+400*i;})
		.attr('cx',function(d,i){
    		return xScale(d,d[1])
    	})
    	.duration(1250)


//Per bar gradients. Would love to optimize this

var darkred = 'rgb(255,34,34)'
var lightred = "#ff9494"
var blue = "#1f77b4"
var purple = "#800080"

var ngradient = canvas.append("svg:defs")
    .append("svg:linearGradient")
    .attr("id","ngradient")
    .attr("x1","0%")
    .attr("y1","0%")
    .attr("x2","100%")
    .attr("y2","0%")

ngradient.append("svg:stop")
    .attr("offset","0%")
    .attr("stop-color",purple)
    .attr("stop-opacity",0.1)

    ngradient.append("svg:stop")
       .attr("offset", "50%")
       .attr("stop-color", blue)
       .attr("stop-opacity", 0.8);

    ngradient.append("svg:stop")
      .attr("offset","100%")
      .attr("stop-color",purple)
      .attr("stop-opacity",0.1)


  var _0_bgradient = canvas.append("svg:defs")
      .append("svg:linearGradient")
      .attr("id",'_0_bgradient')
      .attr("x1","0%")
      .attr("y1","0%")
      .attr("x2","100%")
      .attr("y2","0%");

    _0_bgradient.append("svg:stop")
      .attr("offset",(data[0][2]/data[0][5]))
      .attr("stop-color",darkred)
 

    _0_bgradient.append("svg:stop")
      .data(data)
      .attr("offset",function(d,i){
 		var whichdat = data[0]
        return (whichdat[3]/whichdat[5])})
      .attr("stop-color",lightred)
      //.attr("stop-color",'white')

    _0_bgradient.append("svg:stop")
      .data(data)
      .attr("offset",function(d,i){
 		var whichdat = data[0]
        return (whichdat[4]/whichdat[5])})
      .attr("stop-color",lightred)

    _0_bgradient.append("svg:stop")
      .data(data)
      .attr("offset",function(d,i){
        return 1})
      .attr("stop-color",darkred)



  var _1_bgradient = canvas.append("svg:defs")
        .append("svg:linearGradient")
      .attr("id",'_1_bgradient')
      .attr("x1","0%")
      .attr("y1","0%")
      .attr("x2","100%")
      .attr("y2","0%")

    _1_bgradient.append("svg:stop")
      .attr("offset","0%")
      .attr("stop-color",darkred)

    _1_bgradient.append("svg:stop")
      .data(data)
      .attr("offset",function(d,i){
 		var whichdat = data[1]
 		console.log(whichdat)
        return (whichdat[3]/whichdat[5])})
      .attr("stop-color",lightred)
      //.attr("stop-color",'white')

    _1_bgradient.append("svg:stop")
      .data(data)
      .attr("offset",function(d,i){
 		var whichdat = data[1]
 		console.log(whichdat)
        return (whichdat[4]/whichdat[5])})
      .attr("stop-color",lightred)

    _1_bgradient.append("svg:stop")
      .data(data)
      .attr("offset",function(d,i){
        return 1})
      .attr("stop-color",darkred)

  var _2_bgradient = canvas.append("svg:defs")
        .append("svg:linearGradient")
      .attr("id",'_2_bgradient')
      .attr("x1","0%")
      .attr("y1","0%")
      .attr("x2","100%")
      .attr("y2","0%")

    _2_bgradient.append("svg:stop")
      .attr("offset","0%")
      .attr("stop-color",darkred)

    _2_bgradient.append("svg:stop")
      .data(data)
      .attr("offset",function(d,i){
 		var whichdat = data[2]
        return (whichdat[3]/whichdat[5])})
      .attr("stop-color",lightred)
      //.attr("stop-color",'white')

    _2_bgradient.append("svg:stop")
      .data(data)
      .attr("offset",function(d,i){
 		var whichdat = data[2]
        return (whichdat[4]/whichdat[5])})
      .attr("stop-color",lightred)

    _2_bgradient.append("svg:stop")
      .data(data)
      .attr("offset",function(d,i){
        return 1})
      .attr("stop-color",darkred)

  var _3_bgradient = canvas.append("svg:defs")
        .append("svg:linearGradient")
      .attr("id",'_3_bgradient')
      .attr("x1","0%")
      .attr("y1","0%")
      .attr("x2","100%")
      .attr("y2","0%")

    _3_bgradient.append("svg:stop")
      .attr("offset","0%")    
      .attr("stop-color",darkred)

    _3_bgradient.append("svg:stop")
      .data(data)
      .attr("offset",function(d,i){
 		var whichdat = data[3]
        return (whichdat[3]/whichdat[5])})
      .attr("stop-color",lightred)
      //.attr("stop-color",'white')

    _3_bgradient.append("svg:stop")
      .data(data)
      .attr("offset",function(d,i){
 		var whichdat = data[1]
        return (whichdat[4]/whichdat[5])})
      .attr("stop-color",lightred)

    _3_bgradient.append("svg:stop")
      .data(data)
      .attr("offset",function(d,i){
        return 1})
      .attr("stop-color",darkred)

  var _4_bgradient = canvas.append("svg:defs")
        .append("svg:linearGradient")
      .attr("id",'_4_bgradient')
      .attr("x1","0%")
      .attr("y1","0%")
      .attr("x2","100%")
      .attr("y2","0%")

    _4_bgradient.append("svg:stop")
      .attr("offset","0%")
      .attr("stop-color",darkred)

    _4_bgradient.append("svg:stop")
      .data(data)
      .attr("offset",function(d,i){
 		var whichdat = data[4]
        return (whichdat[3]/whichdat[5])})
      .attr("stop-color",lightred)
      //.attr("stop-color",'white')

    _4_bgradient.append("svg:stop")
      .data(data)
      .attr("offset",function(d,i){
 		var whichdat = data[4]
        return (whichdat[4]/whichdat[5])})
      .attr("stop-color",lightred)

    _4_bgradient.append("svg:stop")
      .data(data)
      .attr("offset",function(d,i){
        return 1})
      .attr("stop-color",darkred)




function xScale(d,val){
	var scale = d3.scale.linear()
		.domain([d[2],d[5]])
		.range([.08*canvw,(.08*canvw+chartw)])
	return scale(val)
}

function colorscale(d,val){
	var norm = (d[4]+d[3])/2
	var offset = (d[5]-d[2])*.001
	var test1 = d[3]-offset
	var test2 = d[4]-offset

	console.log(norm,offset)
	var scale = d3.scale.linear()
		.domain([d[2],test1,d[3],norm,test2,d[4],d[5]])
		.range(['rgb(255,34,34)', '#ff9494', '#800080','#1f77b4','#800080','#ff9494','rgb(255,34,34)'])

	console.log(scale(val))
	return scale(val)
}



})
 

/*
var darkred = 'rgb(255,34,34)'
var lightred = "#ff9494"
var blue = "#1f77b4"
var purple = "#800080"
*/



/*
What do I need?
-title of bullet chart
-value of variable
-outer range
-normal bounds range
*/
function processData(rawData){
	var data = rawData[0]
	var ret = new Array()
	ret.push(["BMI",+data.BMI,0,18.5,25,40])
	ret.push(["Systolic Blood Pressure",+data.SystolicBP,50,90,140,230])
	ret.push(["Diastolic Blood Pressure",+data.DiastolicBP,35,60,90,140])
	ret.push(["Respiratory Rate",+data.RespiratoryRate,0,12,24,60])
	ret.push(["Temperature",+data.Temperature,87.5,97.6,99.6,105])
	return ret;
}

















