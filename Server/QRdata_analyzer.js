const {PythonShell} = require('python-shell');
const { text } = require('body-parser');


var analyzeQR = function(url){
    //Replace test.py with python script to run
    let pyshell = new PythonShell('test.py');
    pyshell.send(url);

    pyshell.on('message', (message)=>{
       return message;
    })

    pyshell.end(function (err,code,signal) {
        if (err) throw err;
        console.log('finished');
      });
}

analyzeQR("test");

module.exports = analyzeQR;