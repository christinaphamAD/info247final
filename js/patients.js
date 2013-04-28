$(document).ready(function() {
    $('#patient').hide();
    $('#patientList').append('<ul></ul>');

    $.ajax({
        type: "GET",
        url: "js/patient.csv",
        dataType: "text",
        success: function(data) {parseData(data);}
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
    for (var k=1; k<lines.length; k++){
        $('#patientList ul').append('<li>' + k + '. <a id="' + lines[k][0] + '" data-attr="' + k + '">Patient ' + lines[k][0] + '</a></li>')
    }
    $('#patientList ul li').hide().each(function(e){
            //console.log(e*500)
            $(this).delay(e*500).slideDown();
    })
//console.log(lines);
    $('#patientList a').bind('click', function(e){
        $('#home').fadeOut();
        $('#patient').empty().fadeIn();
        patientRef = this.getAttribute("data-attr")
        getPatientData(patientRef, lines)
    })
}

function getPatientData(ref, data) {
    console.log(data[ref][0])
    $('#patient').append('<div id="genData" class="container"></div>')
    $('#genData').append('<h1>Patient ' + data[ref][0] + '</h1>' )
    .append('<h3>Gender: ' + data[ref][1] + '</h3>')
    .append('<h3>Year of Birth: ' + data[ref][2].substr(0,1) + '/' + data[ref][2].substr(2,3) + '/' + data[ref][2].substr(4,7))
}