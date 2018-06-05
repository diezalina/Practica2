var express = require('express');
var app = express();

var api = require('./routes/api');

app.use("/api", api);

app.get("/", (req,res) =>{
    res.send("<h1>Página principal!</h1>");
});

app.listen(3000,() => {
    console.log("La aplicación está corriendo por el puerto 3000");
});