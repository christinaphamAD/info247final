$(document).ready(function() {
    $('#patient').hide();

    $.ajax({
        type: "GET",
        url: "js/patient.csv",
        dataType: "text",
        success: function(data) {createWaitingList(parseData(data));}
     });

    $('#logo').bind('click', function(e) {
        $('#home').fadeIn();
        $('#patient').fadeOut();
    })   

    $('.bar').each(function(e){
        $(this).attr('data-id', 'abcharts')
    })

    

});

function parseData(input) {
    var allTextLines = input.split(/\r\n|\n/);
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
    $('#patientList').append('<table cellpadding="0" cellspacing="0"></table>')

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
        $('#patient').empty().fadeIn();
        patientRef = this.getAttribute("data-attr")
        getPatientData(patientRef, lines)
    })
}


function getPatientData(ref, data) {
    $('#patient').append('<div id="genData" class="container"></div>')
    $('#genData')
    .append('<h1>Patient ' + data[ref][1] + '</h1>' )
    .append('<div class="tri-patient left" id="basicInfo"></div><div class="tri-patient left" id="detailInfo"></div>')

    $('#basicInfo')
    .append('<strong>Gender:</strong> ' + data[ref][3] + '<br />')
    .append('<strong>Year of Birth:</strong> ' + data[ref][4] + '<br />')
    .append('<strong>Age:</strong> ' + data[ref][15] + '<br />')
    $('#detailInfo')
    .append('<strong>Height:</strong> ' + data[ref][7] + '"<br />')
    .append('<strong>Weight:</strong> ' + data[ref][8] + ' lbs<br />')
    .append('<strong>Last Visit:</strong> ' + data[ref][6].substring(0,4) + '<br />')

    $('#patient').append('<div id="bulletData" class="container half left"><h2>Bullet Charts</h2></div>')
    .append('<div id="allergies" class="container half right"><h2>Allergies</h2><table cellpadding="0" cellspacing="0"></table></div>')
    .append('<div id="prescriptions" class="container half left"><h2>Prescriptions</h2><table cellpadding="0" cellspacing="0"></table></div>')
    .append('<div id="diagnoses" class="container half right"><h2>Diagnoses</h2><table cellpadding="0" cellspacing="0"></table></div>')

    $.ajax({
        type: "GET",
        url: "patientData/" + data[ref][2] + "div2.csv",
        dataType: "text",
        success: function(data) {createTable("allergies", parseData(data));}
     });

    $.ajax({
        type: "GET",
        url: "patientData/" + data[ref][2] + "div3.csv",
        dataType: "text",
        success: function(data) {createTable("prescriptions", parseData(data));}
     });

    // $.ajax({
    //     type: "GET",
    //     url: "patientData/" + data[ref][2] + "div4.csv",
    //     dataType: "text",
    //     success: function(data) {createTable("diagnoses", parseData(data));}
    //  });

}

function createTable(location, data) {
    if(location == "allergies"){
        if(data.length < 3){
            $("#allergies")
            .append("No allergies listed.");
        }
        else {
            $("#allergies table")
            .append("<tr class='tabHead'><th>Allergy Name</th><th>Reaction</th><th class='smalltd'>Severity</th></tr>")
            for (var k=1; k<(data.length-1); k++){
                $('#allergies table')
                .append('<tr><td>' + data[k][7] + '</td><td>' + data[k][5] + '</td><td>' + data[k][6] + '</td></tr>')
            }
        }
    }

    if(location =="diagnoses"){
        if(data.length < 3){
            $("#diagnoses")
            .append("No diagnoses listed.");
        }
        else {
            $("#diagnoses table")
            .append("<tr class='tabHead'><th>Description</th><th class='smalltd'>Years Active</th><th class='tinytd'>Acute</th></tr>")
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
                        $('#diagnoses table').append('<tr><td>' + data[k][5] + '</td><td>' + data[k][6].substring(0,4) + ' - ' + yearEnd + '</td><td>' + data[k][8] + '</td></tr>')
                    }
                    else {
                        //ignore
                        $('#diagnoses table').append('<tr><td>' + data[k][5] + '</td><td>N/A</td><td>' + data[k][8] + '</td></tr>')
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

    if (location == "patientList"){
        $('#patientList table').append('<tr class="tabHead"><th>Upcoming Patients</th></tr>')
        for(var k=1; k<data.length; k++){
            $('#patientList table').append('<tr><td>' + k + '. ' + '<a id="' + data[k][1] + '" data-attr="' + k + '">Patient ' + data[k][1] + '</a></td></tr>')
        }
    }
}