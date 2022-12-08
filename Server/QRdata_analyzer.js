const {PythonShell} = require('python-shell');
const { text } = require('body-parser');

//calls python script with url analysis funtionality
var anayzeURL = function(url){
    let pyshell = new PythonShell('urlAnalysis.py');
    pyshell.send(data);

    pyshell.on('message', (message)=>{
        console.log(message);
        return message;
    })

    pyshell.end(function (err,code,signal) {
        if (err) throw err;
        console.log('finished');
    });
}

//checks what type of type of data the qr code contains
//This is based on https://github.com/zxing/zxing/wiki/Barcode-Contents
var typeCheck = function(data){
    
    //checking if it is a url
    function isValidUrl(string) {
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(string);
    }
    if (isValidUrl(data)) {
        return 'url';
    } 
    //check if email
    else if(data.startsWith('mailto:')){
        return 'email';
    }
    //check if phone number
    else if(data.startsWith('tel:')){
        return 'phone number';
    }
    //check if contact info
    else if(data.startsWith('MECARD:') ||
            data.startsWith('BIZCARD:') ||
            data.startsWith('BEGIN:VCARD')){
        return 'contact info';
    }
    //check if text
    else if(data.startsWith('SMSTO:') ||
            data.startsWith('smsto:') ||
            data.startsWith('mmsto:') ||
            data.startsWith('MMSTO:') ||
            data.startsWith('SMS:') ||
            data.startsWith('sms:') ||
            data.startsWith('mms:') ||
            data.startsWith('MMS:')){
        return 'SMS/MMS';
    }
    //check if facetime
    else if (data.startsWith('facetime')) {
        return 'facetime'
    }
    //check if geo location
    else if (data.startsWith('geo')){
        return 'geolocation'
    }
    //check calender event
    else if (data.startsWith('BEGIN:VEVENT')){
        return 'calender event'
    }
    //check if wifi
    else if (data.startsWith('WIFI')){
        return 'wifi'
    }
    else {
        return 'text'
    }
}

//main function
var analyzeQR = function(data){
    var results = {"plaintext":data};
    results['type'] = typeCheck(data);

    if (results.type == 'url'){
        var urlresults = JSON.parse(anayzeURL(data));
        results = Object.assign({},results,urlresults);
    }
    return results;
}

//console.log(analyzeQR("https://www.fatburgercanada.com/menu/"));

//test typecheck
/*
var typetest = ['https://en.wikipedia.org/wiki/Mapo_tofu',
                'hts://en.wikipedia.org/wiki/Mapo_tofu',
                'mailto:someone@yoursite.com',
                'tel:+12125551212',
                'MECARD:N:Owen,Sean;ADR:76 9th Avenue, 4th Floor, New York, NY 10011;TEL:12125551212;EMAIL:srowen@example.com;;',
                'BIZCARD:N:Sean;X:Owen;T:Software Engineer;C:Google;A:76 9th Avenue, New York, NY 10011;B:+12125551212;E:srowen@google.com;;',
                'BEGIN:VCARD END:VCARD',
                'sms:+18005551212',
                'facetime:+18005551212',
                'geo:40.71872,-73.98905,100',
                'BEGIN:VEVENT END:VEVENT',
                'WIFI:T:WPA;S:mynetwork;P:mypass;;'
            ]
for (var test of typetest){
    console.log(test, typeCheck(test));
}
*/
module.exports = analyzeQR;