const express = require("express")
const router = express.Router()
var userLogado=""

// Banco de Dados

const mongoose = require("mongoose")
require("../modules/Bdpostagens")
require("../modules/Bdusuario")
const modelPostagens = mongoose.model("Postagens")
const modelRegistro = mongoose.model("Registro")

// Body parser
const bodyParser = require("body-parser")

router.get("/fazerpostagem",(req,res)=>{
    if(userLogado.length > 0){
        console.log("encamiha")
        res.render("usuario/fazerPost")
    }else{
        console.log("Entre primeiro")
        res.render("usuario/login")
    }
})
router.post("/fazerpostagem/nova",(req,res)=>{
    new modelPostagens({
        Titulo:req.body.titulo,
        Categoria:req.body.categoria,
        Descricao:req.body.descricao,
        Imagem:req.body.imagem,
        Link:req.body.link,
        Dono:userLogado,
    }).save().then(()=>{
        console.log("Nova postagem registrada")
        res.redirect("/usuario/postagens")
    }).catch((err)=>{
        console.log("Erro ao tentar registrar postagem,erro: "+err)
        res.redirect("/usuario/fazerpostagem")
    })
})
router.get("/registro",(req,res)=>{
    if(userLogado.length > 0){
        res.render("usuario/home",{erro3:true})
        console.log("Você já está logado!")
    }else{
        res.render("usuario/registro")

    }
})
router.post("/registro/registrando",(req,res)=>{
    modelRegistro.findOne({Email:req.body.email}).lean().then((aqv)=>{
        if(aqv){
            res.render("usuario/registro",{erro1:true})
        }else{
            new modelRegistro({
                Email:req.body.email,
                Senha:req.body.senha,
                Admin:0,
            }).save().then(()=>{
                console.log("Novo usuário registrado")
                res.render("usuario/home",{success:true})
            }).catch((err)=>{
                console.log("Erro ao tentar registrar usuário,erro"+err)
                res.redirect("/usuario/registro")
            })

        }

    })
})
router.get("/login",(req,res)=>{
    if(userLogado.length > 0){
        res.render("usuario/home",{erro3:true})
        console.log("Você já está logado")
    }else{
        res.render("usuario/login")
    }
})
router.post("/login/logado",(req,res)=>{

    // Processo de validação
    if(userLogado.length > 0){
        res.render("usuario/home",{erro2:true})
        console.log("Você já está logado")

    }else{
        modelRegistro.findOne({Email:req.body.email}).lean().then((aqv)=>{
            if(aqv){
                // Possui registro
                if(req.body.senha == aqv.Senha){
                    // Logado 
                    console.log("Logado com sucesso!")
                    res.render("usuario/home",{msg:true})
                    userLogado = req.body.email
                }else{
                    // Senha incorreta
                    console.log("Senha incorreta")
                    res.render("usuario/login",{erro1:true})
                }
            }else{
                // Não possui registro
                console.log("Não possui registro")
                res.render("usuario/registro",{erro2:true})
            }
    
        })

    }

})
router.get("/postagens",(req,res)=>{
    modelPostagens.find().lean().then((aqv)=>{
        res.render("usuario/postagens",{aqv:aqv})
    })
})
router.get("/disconnect",(req,res)=>{
    userLogado = ""
    res.redirect("/")
})
router.get("/userposts",(req,res)=>{
        if(userLogado.length == 0){
            res.redirect("/usuario/login")
        }else{
            modelPostagens.find({Dono:userLogado}).lean().then((aqv)=>{
                console.log(userLogado)
                if(aqv){
                    res.render("usuario/meusposts",{aqv:aqv})

                }else{
                    res.render("usuario/meusposts")
                    console.log("Nehum encontrado")
                }
            })

        }


})
router.get("/editarpost/:id",(req,res)=>{

    modelPostagens.findOne({_id:req.params.id}).lean().then((aqv)=>{

        res.render("usuario/editarpost",{aqv:aqv})

    })
})
router.post("/editarpost/salvando",(req,res)=>{
    modelPostagens.findOne({_id:req.body.id}).then((arquivo)=>{
        arquivo.Titulo = req.body.titulo,
        arquivo.Categoria = req.body.categoria,
        arquivo.Descricao = req.body.descricao,
        arquivo.link = req.body.link,
        arquivo.save().then(()=>{
            console.log("Postagem editada com sucesso!")
            res.redirect("usuario/meusposts",{msg0:true})
        }).catch(()=>{
            console.log("Erro ao tentar editar postagem")
            res.redirect("/usuario/userposts")

        })
    }).catch(()=>{
        console.log("Postagem não encontrada")
        res.render("/usuario/postagens",{msg0:true})
    })
})
router.get("/deletarpost/:id",(req,res)=>{
    modelPostagens.deleteOne({_id:req.params.id}).then(()=>{

        console.log("Postagem deletada com sucesso!")

        res.redirect("/usuario/userposts")
    })
})


module.exports={router,userLogado}