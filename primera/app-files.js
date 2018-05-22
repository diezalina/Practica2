var express = require('express');
var path = require('path');
var http = require('http');

var app = express();

var pubicPath = path.join(__dirname, 'public');
app.use('/img', express.static(pubicPath));

app.use((request, response) => {
    response.writeHead(200,{'Content-Type': 'text/plain'});
    response.end('No se encontro ningun archivo');
});

http.createServer(app).listen(3000);