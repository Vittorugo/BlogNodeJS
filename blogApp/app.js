// importando os módulos ...

const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const routes = require('./routes/routes') // importando meu arquivo com as rotas...
const path = require('path') // módulo para manipular pastas e diretórios ...
const mongoose   = require('mongoose')
const session  = require('express-session') // módulo para armazenar os dados do servidor na sessão 
const flash  = require('connect-flash') // tipo de sessão que aparece apenas uma vez : carrega mensagens de tratamento por um tempo curto ( caso recarregue a página o alert vai sumir )
const usuarios = require('./routes/usuario')

// configurações ...

    // session ...

        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        })) // app.use serve para criação e configuração de middlewares

        app.use(flash()) // sempre tem que ficar abaixo da sessão ... 
        

    
    // validator ...

       

    // Middleware
    
        app.use((req, res, next) => {
            
            res.locals.success_msg = req.flash("success_msg") // .locals cria variável global que neste caso vai armazenar a mensagem de sucesso caso o cadastro seja realizado com sucesso...
            res.locals.erro_msg    = req.flash("error_msg") // cria uma variável global para armazenar uma msg de erro...
            
            next()
        })

    // handlebars ... 

        app.engine('handlebars', handlebars({
            defaultLayout: 'main' // define o layout padrão para todas as páginas da aplicação ... 
           
        }))

        app.set('view engine','handlebars')

    // bodyParser ...
        
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())

    // mongoose ...
        
        mongoose.Promise = global.Promise // evitar muitos erros ...

        mongoose.connect("mongodb://localhost/blogapp", {useNewUrlParser: true}).then( () => { // criando um banco chamado blogapp e testando a conexão ...
            console.log('conectado ao banco!')
        }).catch( (erro) => {
            console.log("Erro ao conectar com o banco:" + erro) 
        })
    // public ...
        
        app.use(express.static(path.join(__dirname,"public"))) // estamos falando para o express que a pasta que está guardando todos os nossos arquivos estáticos é a pasta 'public' ... usamos 'path.join' e '__dirname' para o express pegar o caminho absoluto para a pasta public.
        
      
    // rotas ...

    //app.use(express.json())
    //app.use(routes) ... vamos utilizar um prefixo antes das rotas ...
    app.use('/admin',routes)
    app.use('/usuarios', usuarios)




// conexão ...

const PORT = 8081
app.listen(PORT, () => {   // callback ...
    console.log("servidor rodando ...") 
})

