$(document).ready(function() {
    $('#patient').hide();
    $('#patientList').append('<ul></ul>');

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

});

function parseData(input) {
    var allTextLines = input.split(/\r\n|\n/);
    var lines = [];

    for (var i=0; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        var tarr = [];
        for (var j=0; j<data.length; j++) {
          tarr.push(data[j]);
        }
        lines.push(tarr);
    }
    return lines
}

function createWaitingList(lines) {
    for (var k=1; k<lines.length; k++){
        $('#patientList ul').append('<li>' + k + '. <a id="' + lines[k][1] + '" data-attr="' + k + '">Patient ' + lines[k][1] + '</a></li>')
    }
    $('#patientList ul li').hide().each(function(e){
        $(this).delay(e*200).slideDown();
    })

    $('#patientList a').bind('click', function(e){
        $('#home').fadeOut();
        $('#patient').empty().fadeIn();
        patientRef = this.getAttribute("data-attr")
        getPatientData(patientRef, lines)
    })
}


function getPatientData(ref, data) {
    $('#patient').append('<div id="genData" class="container"></div>')
    $('#genData').append('<h1>Patient ' + data[ref][1] + '</h1>' )
    .append('<h3>Gender: ' + data[ref][3] + '</h3>')
    .append('<h3>Year of Birth: ' + data[ref][4])
    .append('<h3>Age: ' + data[ref][15] + '</h3>')
    .append('<h3>Smoker: ' + data[ref][16] + '</h3>')

    $('#patient').append('<div id="bulletData" class="container half left"><h2>Bullet Charts</h2></div>')
    .append('<div id="allergies" class="container half right"><h2>Allergies</h2><table></table></div>')
    .append('<div id="prescriptions" class="container half left"><h2>Prescriptions</h2></div>')
    .append('<div id="diagnoses" class="container half right"><h2>Diagnoses</h2><table></table></div>')

    $.ajax({
        type: "GET",
        url: "patientData/" + data[ref][2] + "div2.csv",
        dataType: "text",
        success: function(data) {createTable("allergies", parseData(data));}
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
            $("#allergies")
            .append("No allergies listed.");
        }
        else {
            $("#allergies table")
            .append("<tr><td><strong>Allergy Name</strong></td><td><strong>Severity</strong></td><td><strong>Reaction</strong></td></tr>")
            for (var k=1; k<(data.length-1); k++){
                $('#allergies table')
                .append('<tr><td>' + data[k][7] + '</td><td>' + data[k][6] + '</td><td>' + data[k][5] + '</td></tr>')
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
            .append("<tr><td><strong>Description</strong></td></tr>")
            for (var k=1; k<(data.length-1); k++){
                $('#diagnoses table')
                .append('<tr><td>' + data[k][5] + '</td></tr>')
            }
        }
    }
}