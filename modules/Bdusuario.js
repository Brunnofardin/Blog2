const mongoose = require("mongoose")
const Schema = mongoose.Schema

const novoEsquema = new Schema({
    Email:String,
    Senha:String,
    Admin:Number,
})

mongoose.model("Registro",novoEsquema)