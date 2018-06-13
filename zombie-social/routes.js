var express = require("express");
var Zombie = require("./models/zombie");

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

module.exports = router;