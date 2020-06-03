import { Router, request, response } from 'express'
import knex from './database/connection'

const routes = Router()

routes.get('/items', async (request, response) => {
    const items = await knex('items_for_collection').select('*')
    
    const serializedItems = items.map(item => {
        return {
            ...item,
            image_url: `http://localhost:3333/uploads/${item.image}`
        }
    })

    return response.status(200).send(serializedItems)
})

routes.post('/points', async (request, response) => {
    const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf
    } = request.body

    knex('garbage_collection_points').insert({
        image: 'image-fake',
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf
    })


})

export default routes