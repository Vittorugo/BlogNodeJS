// configurando as rotas 

const express = require('express')
const router  = express.Router()
const mongoose= require('mongoose')
const { check, validationResult } = require('express-validator')


require("../models/Categoria") // importando  o modelo categoria
const Categoria = mongoose.model('categorias') // associando a const Categoria o schema exportado no arquivo Categorias 




// defininco a rota principal ...

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send('Página de Posts')
})

router.get('/categorias', (req, res) => {
    res.render("admin/categorias")
})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias")
    
})

router.post('/categorias/nova', (req, res) => {
    

    // validação manual do formulário ...


    var erros = []

    if(!req.body.nome_categoria || typeof req.body.nome_categoria == undefined || req.body.nome_categoria == null){
        erros.push({texto: "Nome inválido!"})
    } // se o campo nome for vazio ou se o campo nome for igual a indefinido ou se o campo node for igual a nulo ...

    if(req.body.nome_categoria.length < 2){
        erros.push({texto:"Nome da categoria muito pequeno!"})
    } // se o campo nome for menor que 2 caracteres 


    if(!req.body.slug_categoria || typeof req.body.slug_categoria == undefined || req.body.slug_categoria == null){
        erros.push({texto: "Slug inválido!"})
    } // se o slug for vazio ou se o slug for indefinido ou se o slug for nulo ...

    if(erros.length > 0){
        res.render("admin/addcategorias", {falhas: erros})
    }else{
        
        const novaCategoria = {
            nome: req.body.nome_categoria,
            slug: req.body.slug_categoria
        }
    
        new Categoria(novaCategoria).save().then( () => {
            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect("/admin/categorias") // redirecionar para página categorias caso o cadastro seja feito!
        }).catch( (erro) => {
            req.flash("error_msg"," Houve um erro ao salvar a categoria, tente novamente!")
            res.redirect("/admin")
        })
    }


    

    //res.json({novaCategoria})
})



module.exports = router // exportando a rota 