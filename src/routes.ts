import { Router } from 'express'
import knex from './database/connection'

const routes = Router()

routes.get('/items', async (request, response) => {
    const items = await knex('items_for_collection').select('*')
    
    const serializedItems = items.map(item => {
        return {
            title: item.title,
            image_url: `http://localhost:3333/uploads/${item.image}`
        }
    })

    return response.status(200).send(serializedItems)
})

export default routes