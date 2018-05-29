var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//donde definimos lo de views
app.use(express.static(path.resolve(__dirname,"public")));
app.set("views", path.resolve(__dirname,"views"));
app.set("view engine","ejs");

//meter los app.get de cada pagina
app.get('/', (request, response) => response.render('index'));
app.get('/new-entry', (request, response) => response.render('new-entry'));
app.get('/armas', (request, response) => response.render('armas'));
app.get('/victimas', (request, response) => response.render('victimas'));
app.get('/clases', (request, response) => response.render('clases'));

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use((request, response) => response.status(400).render('404'));

http.createServer(app).listen(3000, () =>
console.log('La aplicación zombie está corriendo en el puerto 3000')
);
