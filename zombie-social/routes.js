var express = require("express");
var Zombie = require("./models/zombie");
var Arma = require("./models/armas");

var passport = require("passport");
var acl = require("express-acl");

var router = express.Router();

acl.config({
    baseUrl:'/',
    defaultRole:'zombie',
    decodedObjectName:'zombie',
    roleSearchPath: 'zombie.role'
    //path:'./zombie-social' para debuggear
});

router.use((req, res, next) =>{
    res.locals.currentZombie = req.zombie;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    if(req.session.passport){
        if(req.zombie){
            req.session.role = req.zombie.role;
        } else {
            req.session.role = "zombie";
        }
    }
    console.log(req.session);
    next();
});

router.use(acl.authorize);

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

//apartado signup 
router.get("/signup", (req, res) =>{
    res.render("signup");
});

router.post("/signup",(req, res, next)=>{
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;

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
            password: password,
            role: role
        });
        newZombie.save(next);
        return res.redirect("/");
    });
});


//armamento, apartado para agregar armas
router.get("/addGun", (req, res) =>{
    res.render("addGun");
});

router.post("/addGun",(req, res, next)=>{
    var descripcion = req.body.descripcion;
    var categoria = req.body.categoria;
    var municiones = Boolean(req.body.municiones);
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

//rutas login
router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", passport.authenticate("login",{
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

//rutas para edit
router.get("/edit", ensureAuthenticated,(req,res) => {
    res.render("edit");
});

router.post("/edit", ensureAuthenticated, (req, res, next) => {
    req.zombie.displayName = req.body.displayName;
    req.zombie.bio = req.body.bio;
    req.zombie.save((err) => {
        if(err){
            next(err);
            return;
        }
        req.flash("info", "Perfil actualizado!");
        res.redirect("/edit");
    });
});

//para la autenticacion del usuario
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        next();
    } else{
        req.flash("info", "Necesitas iniciar sesión para poder ver esta sección");
        res.redirect("/login");
    }
}

module.exports = router;