$(document).ready(function() {
    $('#patientList').append('<ul></ul>')

    $.ajax({
        type: "GET",
        url: "js/patient.csv",
        dataType: "text",
        success: function(data) {parseData(data);}
     });

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
        $('#patientList ul').append('<li>' + k + '. <a data-id="' + lines[k][0] + '">Patient ' + lines[k][0] + '</a></li>')
    }
    console.log(lines);
    $('#patientList a').bind('click', function(e){
        console.log('CLICK')
        $('#main').fadeOut();
    })
}