/* Simple endpoint for server, this prototype will run on
 * localhost for the moment
 *
 */

const path = require('path');
const getScreencap = require("./web_content_extractor.js");
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
require('dotenv').config();

const host = 'localhost';
const port = 5000;
const clientApp = path.join(__dirname,'..','Client');

function logRequest(req, res, next){
	console.log(`${new Date()}  ${req.ip} : ${req.method} ${req.path}`);
	next();
}

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.text({ type: "text/plain" }));
app.use(logRequest);	

app.use(cors({
  credentials: true, 
  origin: process.env.DOMAIN_NAME,
  methods: ["POST", "PUT", "GET", "OPTIONS", "DELETE", "HEAD"]
}));

app.use('/', express.static(clientApp, { extensions: ['html'] }));
app.listen(port, () => {
	console.log(`${new Date()}  App Started. Listening on ${host}:${port}, serving ${clientApp}`);
});

app.put("/screencap",async (req, res)=> {
    var url = req.body.url;
    res.send(await getScreencap(url));
})