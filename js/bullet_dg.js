// INFO 247 - Final Project
// Bullet Chart
//if d3 not in repo, put this line in html: <script src="http://d3js.org/d3.v3.min.js"></script>

function createBulletChart(dataInput){
  var filestruc = "patientData/"
  var patient_id = dataInput
  // "0B4C02C7-935D-411C-92C0-EAEC4BF0CFFD"
  var patientfile = filestruc+patient_id
   

  d3.csv(patientfile+"div1.csv", function(error, rawdat){

    var canvas = d3.select("#bullet").append('svg')
      .attr({
        "id":"bulletcanv",
        "height": '100'+'%',
        "width": '100'+'%'
      });

    var totwidth = 432
    var totheight = (250/432)*totwidth

    var data = processData(rawdat)

    var math = .2*totheight
    var matw = totwidth
     
  	var mat = canvas.selectAll('.bulchart')
      	.data(data)
      	.enter()
      	.append('rect')
      	.attr('class','bulchart')
      	//.attr('fill','rgb(238, 236, 236)')
      	.attr('fill','white')
      	.attr('x',0)
      	.attr('y',function(d,i){
      		return (0 + (i)*(math))
      	})
      	.attr('height',math)
      	.attr('width',matw)
  		  .attr("id",function(d){
  			//console.log(d[0]);  change this to actual id 
  		  });

  	var charth = .33*math
  	var chartw = .8*matw

    var chartx = .175*matw
    var tickwidth = 0.0

    var chartborder = canvas.selectAll('.chartborder')
      .data(data)
        .enter()
        .append('rect')
        .attr('class','chartborder')
        .attr('stroke','rgb(124, 123, 123)')
        .attr('height',charth)
        .attr('width',chartw)
        .attr('x',chartx)
        .attr('y',function(d,i){
          return (.33*math+i*math)
        })
        .attr('fill','none')
        .style('opacity',0)
        .transition()
        .delay(1000)
        .duration(1000)
        .attr('stroke-width',1)
        .style('opacity',1)
        .each('end',function(d,i){
          drawlabels(d,i)
          var numticks = [1,1,1,1,1]
          for (var j=0; j<numticks.length+1; j++){
            canvas.selectAll('.bullettick')
              .data(numticks)
              .enter()
              .append('line')
              .attr('x1',chartx+j*(chartw/numticks.length)+tickwidth)
              .attr('x2',chartx+j*(chartw/numticks.length)+tickwidth)
              .attr('y1',.33*math+i*math+charth)
              .attr('y2',.33*math+i*math +charth+4)
              .attr('stroke','rgb(124, 123, 123)')
              .style('opacity',0)
              .transition()
              .duration(500)
              .style('opacity',1)
              .attr('stroke-width',.25)
          }
        })

  function drawlabels(d,i){
      var range = d[5] - d[2]
      var numticks = 6
      var step = range/(numticks-1)
      for (var j=0; j<numticks; j++){
        canvas.append('text')
          .attr('class','bulletlabel')
          .text(d[2]+step*j)
          .attr('x',chartx+j*(chartw/(numticks-1)))
          .attr('y',.33*math+i*math+charth)
          .attr('dy',13)
          .style('opacity',0)
          .transition()
          .duration(400)
          .style('opacity',1)
          .attr('stroke','rgb(124,123,123)')
          .attr('fill','rgb(124,123,123)')
          .attr('text-anchor','middle')
          .attr('stroke-width',-1)
          .attr('font-size',.0225*matw)
      }


  }



  	var charts = canvas.selectAll('.chart')
  		.data(data)
  		.enter()
  		.append('rect')
  		.attr('class','chart')
  		.attr('fill',function(d,i){
  			return 'url(#_'+i+'_bgradient)'})
  		.attr('height',charth)
  		//.attr('width',matw*.9)
  		.attr('width',0)
  		.attr('x', chartx)
  		.attr('y', function(d,i){
  			return .33*math+i*math})
  		.transition()
  		.delay(function(d,i){
        	return 400+200*i;})
  		.attr('width', chartw)
        	.ease('linear')
        	.duration(500)

    var bartitles = canvas.selectAll('.bartitle')
      .data(data)
      .enter()
      .append('text')
      .text(function(d){
        return d[0];
      })
      .attr('class','bartitle')
      .attr('text-anchor','end')
      .attr('font-size',.025*matw)
      .attr('font-weight','bold')
      //.attr('textLength', .15*matw)
      .attr('x',chartx-4)
      .attr('y', function(d,i){
        return .33*math+i*math+.025*matw})

    var barcaptions = canvas.selectAll('.barcaption')
      .data(data)
      .enter()
      .append('text')
      .text(function(d){
        return d[6];
      })
      .attr('class','barcaption')
      .attr('text-anchor','end')
      .attr('font-size',.02*matw)
      .attr('stroke','rgb(124, 123, 123)')
      .attr('fill','rgb(124,123,123)')
      .attr('stroke-width',-1)
      //.attr('font-weight','bold')
      //.attr('textLength', .15*matw)
      .attr('x',chartx-4)
      .attr('y', function(d,i){
        return .33*math+i*math+.025*matw})
      .attr('dy',9)
      .attr('dx',-2);


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
      	.attr('x',chartx)
  		.attr('y', function(d,i){
  			return (.33*math+i*math)
  		})
  		.transition()
  		.delay(function(d,i){
  			return 0+400*i;})
  		.attr('width',function(d){
  			return (xScale(d,d[4]) - xScale(d,d[3]))
  		})
  		.attr('x',function(d){
  			return  xScale(d,d[3])
  		})
  		.ease('linear')
  		.duration(750)

  	var normticks = canvas.selectAll('.normtick')
  		.data(data)
  		.enter()
  		.append('rect')
  		.attr('class','normtick')
  		.attr('fill','black')
  		.attr('height',charth+8)
  		.attr('width',1)
      .attr('stroke','rgb(124, 123, 123)')
      .attr('fill','rgb(124,123,123)')
  		.attr('x', chartx)
  		.attr('y', function(d,i){
  			return .33*math+i*math-4
  		})
  		.transition()
  		.delay(function(d,i){
        		return 0+400*i;})
  		.attr('x',function(d,i){
        var norm = (d[3]+d[4])/2
        console.log('norm',norm)        

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
      	.attr('stroke-width',2.5)
      	.attr('fill',function(d,i){
      		console.log(colorscale(d,d[1]))
      		return colorscale(d,d[1])})
  		//.attr('fill','rgb(196, 193, 193)')
      	.attr('cy',function(d,i){
           return (.33*math+charth/2)+i*math
  		})
      	.attr('cx',chartx)
      	.attr('r', .75*charth)
      	.transition()
  		.delay(function(d,i){
  			return 200+400*i;})
  		.attr('cx',function(d,i){
      		return xScale(d,d[1])
      	})
      	.duration(900)


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
  		.range([chartx,(chartx+chartw)])
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
  	ret.push(["BMI",+data.BMI,0,18.5,25,50,"kg/m^2"])
  	ret.push(["Systolic BP",+data.SystolicBP,50,90,140,230,"mm Hg"])
  	ret.push(["Diastolic BP",+data.DiastolicBP,35,60,90,140,"mm Hg"])
  	ret.push(["Resp. Rate",+data.RespiratoryRate,0,12,24,60,"Breaths per min"])
  	ret.push(["Temperature",+data.Temperature,87.5,97.6,99.6,105,"Deg F"])
  	return ret;
  }

}
















