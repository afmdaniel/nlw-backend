import { Router, request, response } from 'express'
import knex from './database/connection'

const routes = Router()

routes.get('/items', async (request, response) => {
    try{
        const items = await knex('items_for_collection').select('*')
        
        const serializedItems = items.map(item => {
            return {
                ...item,
                image_url: `http://localhost:3333/uploads/${item.image}`
            }
        })
    
        return response.status(200).json(serializedItems)
    } catch (err) {
        return response.status(500).send(err)
    }
})

routes.post('/points', async (request, response) => {
    const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        items
    } = request.body

    const trx = await knex.transaction()
    
    try {
        const [ point_id ] = await trx('garbage_collection_points').insert({
            image: 'image-fake',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        }).returning('id')
    
        const pointItems = items.map((item_id: number) => {
            return {
                item_id,
                point_id
            }
        })
    
        await trx('items_points').insert(pointItems)
        trx.commit()
    } catch (err) {
        trx.rollback()
        return response.status(500).json(err)
    }

    return response.status(201).json({ success: true })
})

export default routes