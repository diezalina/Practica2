var express = require("express");
var Zombie = require("./models/zombie");
var Arma = require("./models/armas");

var passport = require("passport");

var router = express.Router();

router.use((req, res, next) =>{
    res.locals.currentZombie = req.zombie;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

router.get("/", (req, res, next) =>{
    Zombie.find()
        .sort({ createdAt: "descending"})
        .exec((err, zombies) => {
            if(err){
                return next(err);
            }
            res.render("index", {zombies: zombies});
        });
});

router.get("/zombies/:username",(req,res,next) =>{
    Zombie.findOne({ username: req.params.username } , (err,zombie) => {
        if(err){
            return next(err);
        }
        if(!zombie){
            return next(404);
        }
        res.render("profile",{ zombie:zombie });
    });
});

router.get("/signup", (req, res) =>{
    res.render("signup");
});

router.post("/signup",(req, res, next)=>{
    var username = req.body.username;
    var password = req.body.password;

    Zombie.findOne({ username: username}, (err, zombie) =>{
        if(err){
            return next(err);
        }
        if(zombie){
            req.flash("error", "El nombre de usuario ya lo ha tomado otro zombie");
            return res.redirect("/signup");
        }
        var newZombie = new Zombie({
            username: username,
            password: password
        });
        newZombie.save(next);
        return res.redirect("/");
    });
});

router.get("/addGun", (req, res) =>{
    res.render("addGun");
});

router.post("/addGuns",(req, res, next)=>{
    var descripcion = req.body.descripcion;
    var categoria = req.body.categoria;
    var municiones = req.body.municones;
    var fuerza = req.body.fuerza;

    Arma.findOne({ descripcion: descripcion }, (err, arma) =>{
        if(err){
            return next(err);
        }
        var newArma = new Arma({
            descripcion: descripcion,
            categoria: categoria,
            municiones: municiones,
            fuerza: fuerza
        });
        newArma.save(next);
        return res.redirect("/guns");
    });
});

router.get("/guns", (req, res, next) =>{
    Arma.find()
        .exec((err, armas) => {
            if(err){
                return next(err);
            }
            res.render("guns", {armas: armas});
        });
});

module.exports = router;