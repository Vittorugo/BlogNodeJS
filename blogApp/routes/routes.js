// configurando as rotas 

const express = require('express')
const router  = express.Router()
const mongoose= require('mongoose')

require("../models/Categoria") // importando  o modelo categoria
const Categoria = mongoose.model('categorias') // associando a const Categoria o schema exportado no arquivo Categorias 




// defininco a rota principal ...

router.get('/', (req, res) => {
    res.render('admin/index')
})



router.get('/categorias', (req, res) => {
    
    Categoria.find().sort({date: 'desc'}).then((categorias) =>{  // procurando as categorias adicionadas no banco e exibindo-as em nossa página lista de categorias.
        res.render("admin/categorias", {categorias: categorias})
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect('/admin')
    })
    
    
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

    else if(req.body.nome_categoria.length < 2){
        erros.push({texto:"Nome da categoria muito pequeno!"})
    } // se o campo nome for menor que 2 caracteres 


    else if(!req.body.slug_categoria || typeof req.body.slug_categoria == undefined || req.body.slug_categoria == null){
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

})

router.get('/categorias/edit/:id' , (req, res) => {

    Categoria.findOne({_id: req.params.id}).then( ( categorias ) => { // devo encontrar através do id passado na requisição a categoria cadastrada e passar um objeto dessa categoria para o arquivo de edição de categoria. Lá o nome desta categoria será utilizado no inputs do form
        
        res.render("admin/editarcategorias",{categoria: categorias})
    }).catch( (err) => { 
        req.flash("error_msg","Erro! ID não encontrado!")
        res.redirect("/admin/categorias")
    })

    
})


router.post("/categorias/edit", (req, res) => {    // rota  para salvar as categorias editadas 


    Categoria.findOne({_id: req.body.id}).then((categoria) => {


        categoria.nome = req.body.nome_categoria
        categoria.slug = req.body.slug_categoria


        categoria.save().then(()=> {
            req.flash("success_msg","Categoria editada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch( (err) => {
            req.flash("error_msg", "Erro ao editar categoria!")
            res.redirect("/admin/categorias")
        } )

    }).catch( (err) => {
        req.flash("error_msg","Houve um erro ao editar categoria")
        res.redirect("/admin/categorias")
    })

})


router.post("/categorias/deletar", (req,res) => {

    Categoria.remove({_id: req.body.id}).then(() => {
        req.flash('success_msg',"Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash('error_msg',"Não foi possível deletar categoria!")
        res.redirect('/admin/categorias')
    })
})


//----------- rotas de postagens ------------// 

router.get('/postagens', (req, res) => {
    res.render('admin/postagens')
})

router.get('/postagens/add', (req, res) => {
    
    Categoria.find().then( (categorias) => {   // vamos passar as categorias registradas no banco para serem selecionadas na postagem.
        res.render('admin/addpostagens',{ categorias: categorias})
    }).catch( (err) => {
        req.flash("error_msg", "Houve ao procurar as categorias!")
        res.redirect("/admin")
    })
    
})


module.exports = router // exportando a rota 