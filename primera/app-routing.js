var express = require('express');
var path = require('path');
var http = require('http');

var app = express();

var IP_MALVADA = "192.168.20.25";

app.use((request, response, next)=>{
    if(request.ip === IP_MALVADA){
        response.status(401).send("Intento de acceso no autorizado");
    }else{
        next();
    }
});

var publicPath = path.join(__dirname, 'public');
app.use('recursos',express.static(publicPath));

app.get('/',(request, response)=>{
    response.end('Bienvenid@ a mi página principal');
});

app.get('/about',(request, response)=>{
    response.end('Bienvenido a mi pagina acerca de pos io k c');
});

app.get('/weather',(request, response)=>{
    response.end('Hoy el clima estará relativamente agradable para remorir');
});

app.get('/bienvenida/:nombre',(request,response)=>{
    response.end('Bienvenid@ ' + request.params.nombre+'.');
});

app.use((request,response)=>{
    response.writeHead(404,{"Content-type": "text/html"});
    response.end("<h2>404 Not Found!</h2>");
    //response.redirect('https://www.google.com.mx/search?q=como+buscar+en+google&oq=como+buscar+en+google&aqs=chrome.0.0l6.2840j0j7&sourceid=chrome&ie=UTF-8');
});

http.createServer(app).listen(3000);