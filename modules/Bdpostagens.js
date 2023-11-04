const mongoose = require("mongoose")
const Schema = mongoose.Schema 

const NovoModelo = new Schema({
    Titulo:String,
    Categoria:String,
    Descricao:String,
    Link:String,
    Dono:String,

})

mongoose.model("Postagens",NovoModelo);