var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false}));

//donde definimos lo de views
app.set("views", path.resolve(__dirname,"views"));
app.set("view engine","ejs");
var entries = [];
app.locals.entries = entries;

//para las imgs
var publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));


//meter los app.get de cada pagina, esto ayuda a acceder a ellas
app.get('/', (request, response) => response.render('index'));
app.get('/new-entry', (request, response) => response.render('new-entry'));
app.get('/armas', (request, response) => response.render('armas'));
app.get('/victimas', (request, response) => response.render('victimas'));
app.get('/clases', (request, response) => response.render('clases'));

//para agregar víctimas
app.post('/new-entry', (request, response) => {
    if(!request.body.name || !request.body.address || !request.body.phone || !request.body.instagram){
        response.status(400).send('Las víctimas deben de tener nombre, dirección, teléfono e instagram');
        return;
    }
    entries.push({
        name: request.body.name,
        address: request.body.address,
        phone: request.body.phone,
        instagram: request.body.instagram
    });
    response.redirect('/');
});


//en caso de error
app.use((request, response) => response.status(400).render('404'));

//creación del servidor
http.createServer(app).listen(3000, () =>
console.log('La aplicación zombie está corriendo en el puerto 3000')
);
