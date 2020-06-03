import knex from '../database/connection'
import { Request, Response } from 'express'

class PointsController {
    async create(request: Request, response: Response) {
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
    
        const points = {
            image: 'image-fake',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        }

        const trx = await knex.transaction()
        
        try {
            const [ point_id ] = await trx('garbage_collection_points').insert(points).returning('id')
        
            const pointItems = items.map((item_id: number) => {
                return {
                    item_id,
                    point_id
                }
            })
        
            await trx('items_points').insert(pointItems)
            trx.commit()
            return response.status(201).json({ point_id, ...points })
        } catch (err) {
            trx.rollback()
            return response.status(500).json(err)
        }
    }
}

export default PointsController