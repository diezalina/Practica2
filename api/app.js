var express = require('express');
var app = express();

var api = require('./routes/api');
var api2 = require('./routes/api2');

app.use("/api", api);
app.use("/apiV2", api2);

app.get("/", (req,res) =>{
    res.send("<h1>Página principal!</h1>");
});

app.listen(3000,() => {
    console.log("La aplicación está corriendo por el puerto 3000");
});