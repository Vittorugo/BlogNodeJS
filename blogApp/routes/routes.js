// configurando as rotas 

const express = require('express')
const router  = express.Router()

// defininco a rota principal ...

router.get('/', (req, res) => {
    res.send('Página principal do painel ADM ')
})

router.get('/posts', (req, res) => {
    res.send('Página de Posts')
})

router.get('/categorias', (req, res) => {
    res.send("Página de categorias")
})

module.exports = router // exportando a rota 