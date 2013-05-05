// INFO 247 - Final Project

$(document).ready(function() {

    $('#patient').hide();

    $.ajax({
        type: "GET",
        url: "patientData/BMIList.csv",
        dataType: "text",
        success: function(data) {
            createWaitingList(parseData(data));
        }
     });

    $('#dash').bind('click', function(e) {
        $('#patient').empty().fadeOut();
        $('#home').fadeIn();
        
    }) 

    function getNewData(){
        var barRef = curBar.getAttribute('id');
        // console.log(barRef);
        $.ajax({
          type: "GET",
          url: "labsData/" + barRef + ".csv",
          dataType: "text",
          success: function(data) {
              createBarDiv(parseData(data));
          }
        });
    }

    $('#abPatients').hide()


    // var curBar = null;
    // $(".bar").live("click", function(){

    //   // console.log(curBar);
    //   if(curBar === this){
    //      $('#abPatients').fadeOut();
    //      curBar = null;
    //      return;
    //   }else if(curBar !== null){
    //       // Set the variable to this
    //       curBar = this;
    //       $('#abPatients').fadeOut({"complete":getNewData});
    //   }else{
    //       // Set the variable to this
    //       curBar = this;
    //       getNewData();
    //   }
    // });

    // var curBar = null;
    // $(".bar").live("click", function(){
    //     // console.log(curBar)
    //     if(curBar === this){
    //        $('#abPatients').fadeOut()
    //        curBar = null;
    //        return;
    //     }else if(curBar !== null){
    //         $('#abPatients').fadeOut()
    //     }
    //     curBar = this;

    //     var barRef = this.getAttribute('id')
    //     $('#abPatients').show()
    //     $.ajax({
    //         type: "GET",
    //         url: "labsData/" + barRef + ".csv",
    //         dataType: "text",
    //         success: function(data) {
    //             createBarDiv(parseData(data))
    //         }
    //      });
    //     });
    // });

    var curBar = null;
    $(".bar").live("click", function(){
        var barRef = this.getAttribute('id')
        $('#abPatients').show()
        $.ajax({
            type: "GET",
            url: "labsData/" + barRef + ".csv",
            dataType: "text",
            success: function(data) {
                createBarDiv(parseData(data))
            }
        });
        $('#element-pop-up').bPopup({
            position:["auto",100]
        });
    });

    $("#element-pop-up a").live("click",function(){
        $("#element-pop-up").bPopup().close();}
    );

});

function parseData(input) {
    
    var allTextLines = input.split(/\r\n|\n|\r/);
    var lines = [];

    for (var i=0; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        var tarr = [];
        for (var j=0; j<data.length; j++) {
            if(data[j].length == 0 || data[j] == "unspecified"){
                tarr.push("")
            }
            else{
                tarr.push(data[j].replace(/"/g,''));
            }
        }
        lines.push(tarr);
    }
    return lines
}

function createWaitingList(lines) {
    $('#patientList').append('<div class="waitingData"><table cellpadding="0" cellspacing="0"></table></div>');
    $('.waitingData').hide().fadeIn(1500);

    createTable("patientList", lines)
    // for (var k=1; k<lines.length; k++){
    //     $('#patientList')
    //     .append('<li>' + k + '. <a id="' + lines[k][1] + '" data-attr="' + k + '">Patient ' + lines[k][1] + '</a></li>')
    // }
    // $('#patientList ul li').hide().each(function(e){
    //     $(this).delay(e*200).slideDown();
    // })

    $('#patientList a').bind('click', function(e){
        $('#home').fadeOut();
        $('#patient').delay(200).fadeIn();
        patientRef = this.getAttribute("data-attr")
        getPatientData(patientRef, lines)
    })
}

function createBarDiv(data){
    
    $('#abPatients ul').empty()
    $('#abPatients').show();
    for(var k=1; k<data.length; k++){
        $('#abPatients ul').append('<li>Patient ID: <a id="' + data[k][0] + '">' + data[k][0].substring(0,8) + ' (' + data[k][1] + ')</a>')
    }

    $('#abPatients ul li').hide().each(function(e){
        $(this).delay(e*100).fadeIn();
    })

    $('#abPatients a').bind('click', function(e){
        $('#home').fadeOut();
        $('#patient').delay(400).fadeIn();
        patientRef = this.getAttribute("id")
        
        $.ajax({
            type: "GET",
            url: "patientData/" + patientRef + "div1.csv",
            dataType: "text",
            success: function(data) { 
                console.log(patientRef);
                info = parseData(data);
                getPatientData(1, info)
            ;}
         });

    })
}


function getPatientData(ref, data) {

    // $('#patient').append('<div id="genData" class="container"></div>')
    // $('#genData')
    // .append('<h1>Patient ID: ' + data[ref][2].substring(0,8) + '</h1>' )
    // .append('<div class="tri-patient left" id="basicInfo"></div><div class="tri-patient left" id="detailInfo"></div>')

    // $('#basicInfo')
    // .append('<strong>Gender:</strong> ' + data[ref][3] + '<br />')
    // .append('<strong>Year of Birth:</strong> ' + data[ref][4] + '<br />')
    // .append('<strong>Age:</strong> ' + data[ref][15] + '<br />')
    // $('#detailInfo')
    // .append('<strong>Height:</strong> ' + data[ref][7] + '"<br />')
    // .append('<strong>Weight:</strong> ' + data[ref][8] + ' lbs<br />')
    // .append('<strong>Last Visit:</strong> ' + data[ref][6].substring(0,4) + '<br />')

    $('#patient').append('<div class="wrap-half left"><div id="genData" class="container full"> <h1>Patient ID: ' + data[ref][2].substring(0,8) + '</h1><div class="wrap-half left" id="basicInfo"></div><div class="wrap-half left" id="detailInfo"></div></div><div id="diagnoses" class="container full left"><h2>Diagnoses</h2><div class="tableHead"><table cellpadding="0" cellspacing="0"><tr class="tabHead"><th>Description</th><th class="smallth">Years</th><th class="tinyth">Acute</th></tr></table></div><div class="tableData"><table cellpadding="0" cellspacing="0" id="diagTable"></table></div></div><div id="allergies" class="container full left"><h2>Allergies</h2><div class="tableHead"><table cellpadding="0" cellspacing="0"><tr class="tabHead"><th>Allergy Name</th><th class="medth">Reaction</th><th class="smallth2">Severity</th></tr></table></div><div class="tableData"><table cellpadding="0" cellspacing="0" id="allergTable"></table></div></div></div>')
    .append('<div class="wrap-half right"><div class="container full right"><h2>Vital Stats</h2><div id="bullet"></div></div><div id="outerPrescription" class="container full right"><h2>Prescriptions</h2><div id="prescriptions" class="full"></div></div></div>')
    
    $('#basicInfo')
    .append('<strong>Gender:</strong> ' + data[ref][3] + '<br />')
    .append('<strong>Year of Birth:</strong> ' + data[ref][4] + '<br />')
    .append('<strong>Age:</strong> ' + data[ref][15] + '<br />')
    $('#detailInfo')
    .append('<strong>Height:</strong> ' + data[ref][7] + '"<br />')
    .append('<strong>Weight:</strong> ' + data[ref][8] + ' lbs<br />')
    .append('<strong>Last Visit:</strong> ' + data[ref][6].substring(0,4) + '<br />')

    $('.tableData').hide().fadeIn(1500);

    $.ajax({
        type: "GET",
        url: "patientData/" + data[ref][2] + "div2.csv",
        dataType: "text",
        success: function(data) {createTable("allergies", parseData(data));}
     });

    //THIS IS FOR THE BULLET CHARTS TO FIRE

    createBulletChart(data[ref][2])

    $.ajax({
        type: "GET",
        url: "patientData/" + data[ref][2] + "div3.csv",
        dataType: "text",
        success: function(data) {createTable("prescriptions", parseData(data));}
     });

    $.ajax({
        type: "GET",
        url: "patientData/" + data[ref][2] + "div4.csv",
        dataType: "text",
        success: function(data) {createTable("diagnoses", parseData(data));}
     });

}

function createTable(location, data) {
    if(location == "allergies"){
        if(data.length < 3){
            $("#allergies").append("No allergies listed.");
        }
        else {
            for (var k=1; k<(data.length-1); k++){
                $('#allergTable').append('<tr><td>' + data[k][7] + '</td><td class="medtd">' + data[k][5] + '</td><td class="smalltd">' + data[k][6] + '</td></tr>')
            }
        }
    }

    if(location =="diagnoses"){
        if(data.length < 3){
            $("#diagnoses")
            .append("No diagnoses listed.");
        }
        else {
            for (var k=1; k<(data.length-1) && k<6; k++){

                if (data.length > 5){
                    if (data[k][6].length > 0){
                        if (data[k][7].length > 0) {
                            // insert year start and year end
                            yearEnd = data[k][7].substring(0,4)
                        }
                        else {
                            yearEnd = ""
                        }

                        $('#diagTable').append('<tr><td>' + data[k][5] + '</td><td class="smalltd">' + data[k][6].substring(0,4) + ' - ' + yearEnd + '</td><td class="tinytd">' + data[k][8] + '</td></tr>')
                    }
                    else {
                        //ignore
                        $('#diagTabletable').append('<tr><td>' + data[k][5] + '</td><td class="smalltd">N/A</td><td class="tinytd">' + data[k][8] + '</td></tr>')
                    }
                }
                
            }
        }
    }

    // if(location == "prescriptions") {
    //     if(data.length < 3){
    //         $("#" + location)
    //         .append("No prescriptions listed.");
    //     }
    //     else {
    //         $("#" + location + " table")
    //         .append("<tr class='tabHead'><th>Name</th><th>Strength</th></tr>")
    //         for (var k=1; k<(data.length-1) && k<6; k++){
    //             $("#" + location + " table").append('<tr><td>' + data[k][3] + '</td><td>' + data[k][4] + '</td></tr>')
    //         }
    //     }
    // }
    if(location == "prescriptions") {
        // console.log(data);
        // console.log(data.length);
        var containerX = 440;
        console.log(data);
        console.log(data.length);
        if(data.length < 3){
            $("#prescriptions")
            .append("No prescriptions listed.");
        }
        else {
            var newData = new Array();
            var max = -9;
            for (var k=1; k<(data.length-1) && k<13; k++){
                newData[k-1]=data[k];
                // console.log(max)
                // console.log(newData[k-1])
                if (parseInt(newData[k-1][10])>max) {
                    max=parseInt(newData[k-1][10])
                }
            }
            var chart = d3.select("#prescriptions").append("svg")
                .attr('class', 'chart')
                .attr("width", containerX)
                .attr("height", 20 * newData.length + 40)
              .append("g")
                .attr("transform", "translate(10,15)");
            
            var x = d3.scale.linear()
                .domain([0, max])
                .range([175, containerX-110]);

            chart.selectAll("rect")
                .data(newData)
                .enter().append("rect")
                .attr("y", function(d, i) { return i * 20 +20; })
                .attr("x", 175)
                .attr("width", 0)
                .attr("height", 20)
                .transition()
                .delay(function(d,i){
                    return 400;})
                .attr('width', function(d, i) { 
                    var wid = x(parseInt(d[10]));
                    wid = wid - 175;
                    return  wid;})
                    .ease('linear')
                    .duration(1000);

            chart.selectAll("text")
                .data(newData)
                .enter().append("text")
                .attr("x", 0)
                .attr("y", function(d, i) { return i * 20 +20; })
                .attr("dx", 0) // padding-right
                .attr("dy", 15) // vertical-align: middle
                .attr("text-anchor", "start") // text-align: right
                .attr("title", function(d){
                    var part = d[4];
                    var part2 = d[5];
                    part = part + " - " + part2;
                    return part;
                })
                .text(function(d,i) {
                    var part = d[4].substring(0,10);
                    part = part + "...";
                    var part2 = d[5].substring(0,6);
                    part2 = part2 +"..."
                    part = part + " - " + part2;
                    return part;
                    })
                .on("mouseover", function(d){ mouseover(d); })
                .on("mousemove", function(d){ mousemove(d); })
                .on("mouseout", mouseout);

            var div = d3.select("#outerPrescription").append("div")
            .attr("class", "tooltip")
            .style("opacity", 1e-6);

            function mouseover(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 1);
            };

            function mousemove(d) {
                div
                    .text(d[4] + "-" + d[5])
                    .style("left", (d3.event.pageX-150) + "px")
                    .style("top", (d3.event.pageY-30) + "px");
            };

            function mouseout() {
                div.transition()
                    .duration(500)
                    .style("opacity", 1e-6);
            };
            /*
            chart.selectAll("line")
                .data(x.ticks(4))
              .enter().append("line")
                .attr("x1", x)
                .attr("x2", x)
                .attr("y1", 0)
                .attr("y2", 20 * newData.length)
                .style("stroke", "rgba(210, 210, 210, 1);");
            */
            chart.selectAll(".rule")
                .data(x.ticks(4))
              .enter().append("text")
                .attr("class", "rule")
                .attr("x", x)
                .attr("y", 20)
                .attr("dy", -3)
                .attr("text-anchor", "middle")
                .style("font-size", 10)
                .text(String);

            chart.selectAll(".name")
                .data([1])
              .enter().append("text")
                .attr("class", "name")
                .attr("x", 80)
                .attr("y", 20)
                .attr("dy", -3)
                .attr("text-anchor", "middle")
                .text("Medication - Strength");

            chart.selectAll(".barname")
                .data([1])
              .enter().append("text")
                .attr("class", "barname")
                .attr("x", 175)
                .attr("y", 0)
                .text("Number of Pills Prescribed");

            chart.selectAll(".refillname")
                .data([1])
              .enter().append("text")
                .attr("class", "refillname")
                .attr("x", containerX-50)
                .attr("y", 20)
                .attr("dy", -3)
                .attr("text-anchor", "middle")
                .text("Refillable");
            
            chart.append("line")
                .attr("y1", 20)
                .attr("y2", 20)
                .attr("x1", 0)
                .attr("x2", containerX-20)
                .style("stroke", "#000");
            
            chart.append("line")
                .attr("y1", 20 * newData.length + 20)
                .attr("y2", 20 * newData.length + 20)
                .attr("x1", 0)
                .attr("x2", containerX-20)
                .style("stroke", "#000");

            chart.append("line")
                .attr("x1", 160)
                .attr("x2", 160)
                .attr("y1", 20)
                .attr("y2", 20 * newData.length + 20)
                .style("stroke", "#000");

            chart.append("line")
                .attr("x1", containerX-80)
                .attr("x2", containerX-80)
                .attr("y1", 20)
                .attr("y2", 20 * newData.length + 20)
                .style("stroke", "#000");

            chart.selectAll(".tot")
                .data(newData)
                .enter().append("text")
                .attr("class", "tot")
                .attr("x", function(d) { return x(parseInt(d[10])); })
                .attr("y", function(d, i) { return i * 20 + 20; })
                .attr("dx", function(d) {
                    if (parseInt(d[10]).toString().length==2) {
                        return 18;
                    }
                    else {
                        return 25;
                    }
                    }) // padding-right
                .attr("dy", 15) // vertical-align: middle
                .attr("text-anchor", "end") // text-align: right
                .text(function(d,i) { 
                    return parseInt(d[10]).toString();                    
                    });

            chart.selectAll(".refill")
                .data(newData)
                .enter().append("image")
                .attr("class", "refill")
                .attr("x",  containerX-60)
                .attr("y", function(d, i) { return i * 20 + 21; })
                //.attr("dy", 1) // vertical-align: middle
                .attr("width", 17)
                .attr("height", 17)
                .attr("xlink:href", function(d,i) { 
                    var x = parseInt(d[11]).toString();    
                    if (x>0) {
                        return "js/image1.png"
                    }  
                    else {
                        return "js/image2.png"
                    }              
                    });
                /*.style("width", function(d,i) { 
                    console.log(d[10])
                    console.log(i)
                    return parseInt(d[10]) * 10 + "px";
                    })
                .text(function(d,i) { 
                    return d[3];
                    });*/
            /*
            $("#prescriptions table")
            .append("<tr class='tabHead'><th>Medication Name</th><th class='smalltd'>Strength</th><th>Number of Pills</th><th class='tinytd'>Refillable</th></tr>")
            for (var k=1; k<(data.length-1) && k<10; k++){
                var refillable = "No"
                if (data[k][10]>0) {
                    refillable="Yes"
                }
                $('#prescriptions table').append('<tr><td>' + data[k][3] + '</td><td>' + data[k][4] + '</td><td>' + data[k][9] + '</td><td>'+refillable+'</td></tr>')
            }
            */
            // $('[text-anchor="start"]').tooltip({
            //     track: true
            // });
        }
    }

    if (location == "patientList"){
        $('#patientList table').append('<tr class="tabHead"><th>Most At Risk</th></tr>')
        for(var k=1; k<data.length && k < 11; k++){
            $('#patientList table').append('<tr><td>' + k + '. ' + '<a id="' + data[k][1] + '" data-attr="' + k + '">Patient ID: ' + data[k][2].substring(0,8) + '</a></td></tr>')
        }
    }
}