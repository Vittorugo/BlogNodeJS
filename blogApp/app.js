// importando os módulos ...

const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const routes = require('./routes') // importando meu arquivo com as rotas...

//const mongoose   = require('mongoose')


// configurações ...

    // handlebars ... 

        app.engine('handlebars', handlebars({
            defaultLayout: 'main'
        }))

        app.set('view engine','handlebars')

    // bodyParser ...
        
        app.use(bodyParser.urlencoded({extended: false}))
        app.use(bodyParse.json())

    // mongoose ...

        

// rotas ...

app.use(express.json())
app.use(routes)

// conexão ...

const PORT = 8081
app.listen(PORT, () => {   // callback ...
    console.log("servidor rodando ...") 
})