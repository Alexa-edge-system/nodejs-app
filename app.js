var express = require("express"); 
const path = require('path');
const cfenv = require('cfenv');

var app = express(); 
var appEnv = cfenv.getAppEnv();
var url = process.env.url

app.set('port', (process.env.PORT || 9981));
app.use(express.static(__dirname + '/images'));

app.get('/alexaedgesystems', function(request, response) {
    response.write("<h2><center><u>Node JS Application</u></center></h2>");
    response.write("<h2><center>Welcome to Alexa Edge Systems. Please Contact +33 609878741 for more information or send an email to alexaedgesystems@gmail.com</center></h2>");
    response.end();
});

app.get("/html", function(req, res) {
    res.set("Content-Type", "text/html");
    res.write("<h2>Welcome</h2>");
    res.write("<h2>/html call</h2>");
    res.end();
});

app.get("/jsonData", function(req, res) {
    res.type('json');
    res.send({
        'name': 'Alexa Edge',
        'technology': 'DevOps',
        'contact': '+33 609878741',
        'email': 'alexaedgesystems@gmail.com'
    });
});

app.get("/queryparam", function(req, res) {
    res.send(req.query.key + ": " + req.query.name);
});

app.get("/status-code-404", function(req, res) {
    res.status(404).send('Sorry, we cannot find that!');
});

app.get("/status-code-500", function(req, res) {
    res.status(500).send('Internal Server Error – custom message');
});

app.get('/redirect', function(req, res) {
    res.redirect('https://alexaedgesystems.com/');
});

// ✅ Bind to all interfaces so it's accessible publicly
app.listen(app.get('port'), '0.0.0.0', function() {
    console.log("Node JS app is running at http://0.0.0.0:" + app.get('port') + "/alexaedgesystems");
});

