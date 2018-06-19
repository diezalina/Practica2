var mongoose = require('mongoose');

var armaSchema = mongoose.Schema({
    descripcion: { type: String, required: true},
    fuerza: { type: Number },
    categoria: { type: String },
    municiones: { type: Boolean }
});

armaSchema.pre("save", function(done){
    var arma = this;
});

armaSchema.methods.name = function() {
    return this.descripcion || this.categoria;
}

var Arma = mongoose.model("Armas", armaSchema);
module.exports = Arma;