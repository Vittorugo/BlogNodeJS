const express = require('express')
const router_user  = express.Router()
const mongoose  = require('mongoose')
const bcryptjs  = require('bcryptjs') // módulo para fazer um hash na senha ... melhor que criptografar pois hash não podem ser decifrados ...

require('../models/Usuario')
const Usuario = mongoose.model('usuarios')


router_user.get('/registro', (req, res) => {

    res.render("usuarios/registro")
})


router_user.post('/registro', (req,res) =>{

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){

        erros.push({text: " Nome inválido!"})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){

        erros.push({text: "Email inválido!"})
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){

        erros.push({text: "Senha inválida!"})
    }


    if(req.body.senha.length < 4){

        erros.push({text: "Senha muito curta!"})
    }

    if(req.body.senha != req.body.senha2){

        erros.push({text: "As senha são diferentes, tente novamente!"})
    }


    if(erros.length > 0){

        res.render('usuarios/registro', {erros: erros})

    }else {

        Usuario.findOne({email: req.body.email}).then( ( usuario) =>{

            if(usuario){    

                req.flash("error_msg","Email já cadastrado!")
                res.redirect("/admin")

            }else{

                const novousuario = new Usuario({

                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha

                })


                bcryptjs.genSalt(10, (erro, salt) => { // chamando a função hash assíncrona ... parametro10 é o número de bytes aleatórios codificadamente seguro... 

                    bcryptjs.hash(novousuario.senha, salt, (erro, hash) => { // fazendo um hash da senha do usuario para que seja salva no banco codificada ...

                        if( erro){

                            req.flash('error_msg',"Houve um erro ao salvar o usuário!")
                            res.redirect("/admin")
                        }
                        
                        else {

                            novousuario.senha = hash

                            novousuario.save().then( () => {

                                req.flash('success_msg',"Usuário salvo com sucesso!")
                                res.redirect('/admin')
                                
                            }).catch( (err) => {
                                req.flash('error_msg',"Houve um erro ao criar o usuário, tente novamente!")
                                res.redirect('/usuarios/registro')
                            })

                        }

                    })


                })


            }


        }).catch( (err) => {
            req.flash('error_msg', "Houve erro interno!")
            res.redirect('/admin')
        })
    }

})

module.exports = router_user