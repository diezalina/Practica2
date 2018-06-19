var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var SALT_FACTOR = 10;

var zombieSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    displayName: { type: String },
    bio: String
});

var donothing = () => {

}
//antes de guardar se obtiene lo que el usuario ingreso
zombieSchema.pre("save",function(done) {
    var zombie = this;
    if(!zombie.isModified("password")){ //se checa si fue modificada la pass
        return done();
    } //aqui hace el salto
    bcrypt.genSalt(SALT_FACTOR,(err, salt) => {
        if(err){
            return done(err);
        }//aqui te regresa error o si es correcta
        bcrypt.hash(zombie.password, salt, donothing,
        (err, hashedpassword) => {
            if(err){
                return done(err)
            }
            zombie.password = hashedpassword;
            done();
        });
    });
});

zombieSchema.methods.checkPassword = function(guess, done) {
    bcrypt.compare(guess, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
}

zombieSchema.methods.name = function() {
    return this.displayName || this.username;
}

var Zombie = mongoose.model("Zombie", zombieSchema);
module.exports = Zombie;