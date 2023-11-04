// Importação dos módulos
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const exphb = require("express-handlebars")

// Configs
    // Handlebars 
        app.engine("handlebars",exphb.engine({defaultLayout:"main"}))
        app.set("view engine","handlebars")
    // BodyParser
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({extended:false}))
    // Mongoose
        const conexaoBd = require("./modules/Bdconexao.js")
        require("./modules/Bdpostagens.js")
        const modelPostagens = mongoose.model("Postagens")

        mongoose.connect(conexaoBd.linkBd).then(()=>{
            console.log("Conexão com Mongo Db efetuada com sucesso!")
        }).catch((err)=>{
            console.log("Erro ao tnetar conectar-se ao Mongo Db,erro: "+err)
        })
    // Novas rotas (router)
        const rotasUsuario = require("./routes/usuario.js")
        app.use("/usuario",rotasUsuario.router)
    // Usuario logado

       
      
// Rotas

app.get("/",(req,res)=>{
 
    res.render("usuario/home")
 
})


app.listen(9090 || process.env.PORT,()=>{console.log("Servidor Iniciado com Sucesso")})
