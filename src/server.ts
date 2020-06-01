import express from 'express'

const app = express()

app.get('/users', (request, response) => {
    console.log('Listagem de Usuário')

    response.json([
        'Diego',
        'Cleiton',
        'Robson',
        'Daniel',
    ])
})

app.listen(3333)
