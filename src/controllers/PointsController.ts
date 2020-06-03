import knex from '../database/connection'
import { Request, Response } from 'express'

class PointsController {
    async show(request: Request, response: Response) {
        const { id } = request.params

        try {
            const point = await knex('garbage_collection_points').where({ id }).first()

            if (!point){
                return response.status(400).json({ message: 'Point not found' })
            }

            const items = await knex('items_for_collection')
                .join('items_points', 'items_for_collection.id', '=', 'items_points.item_id')
                .where('items_points.point_id', id)
                .select('items_for_collection.title')
                
            return response.status(200).json({ point, items })
        } catch (err) {
            return response.status(500).json(err)
        }
    }

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