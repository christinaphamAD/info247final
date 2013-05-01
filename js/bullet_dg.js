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

    console.log(data)
   
	var mat = canvas.selectAll('.bulchart')
    	.data(data)
    	.enter()
    	.append('rect')
    	.attr('class','bulchart')
    	.attr('fill','pink')
    	.attr('x',0)
    	.attr('y',function(d,i){
    		return (0 + (i)*(canvh+10)/5)
    	})
    	.attr('height',canvh/5)
    	.attr('width',canvw)
		.attr("id",function(d){
			//console.log(d[0]);  change this to actual id 
		});

	var x = d3.scale.linear()
		.domain

	var charth = .05*canvh
	var chartw = .9*canvw


	var charts = canvas.selectAll('.chart')
		.data(data)
		.enter()
		.append('rect')
		.attr('class','chart')
		.attr('fill','rgb(255, 148, 148)')
		.attr('height',canvh*.05)
		//.attr('width',canvw*.9)
		.attr('width',0)
		.attr('x', .08*canvw)
		.attr('y', function(d,i){
			return .05*canvh + i*(canvh*.10 + (canvh*.1))
		})
		.transition()
		.delay(function(d,i){
		console.log(i)
      	return 0+400*i;})
		.attr('width', canvw*.9)
      	.ease('linear')
      	.duration(1000)

    var normbars = canvas.selectAll('chart')
    	.data(data)
    	.enter()
    	.append('rect')
    	.attr('class','normbar')
    	.attr('fill','purple')
    	.attr('opacity',0.4)
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
			return (getScale(d,d[3]) - getScale(d,d[2]))
		})
		.attr('x',function(d){
			console.log("hi i'm here")
			return getScale(d,d[3])
		})
		.ease('linear')
		.duration(750)

function getScale(d,val){
	var scale = d3.scale.linear()
		.domain([d[2],d[5]])
		.range([.08*canvw,(.08*canvw+chartw)])
	return scale(val)
}





})
 





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

















