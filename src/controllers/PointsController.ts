import knex from '../database/connection'
import { Request, Response } from 'express'

class PointsController {
    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()))

        try{
            const points = await knex('garbage_collection_points')
                .join('items_points', 'garbage_collection_points.id', '=', 'items_points.point_id')
                .whereIn('items_points.item_id', parsedItems)
                .where('city', String(city))
                .where('uf', String(uf))
                .distinct()
                .select('garbage_collection_points.*')

            return response.json(points)
        } catch (err) {
            return response.status(500).json(err)
        }
    }
    
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
        const points = {
            image: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name: request.body.name,
            email: request.body.email,
            whatsapp: request.body.whatsapp,
            latitude: request.body.latitude,
            longitude: request.body.longitude,
            city: request.body.city,
            uf: request.body.uf,
        }
    
        const items = request.body.items

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
            await trx.commit()
            return response.status(201).json({ point_id, ...points })
        } catch (err) {
            await trx.rollback()
            return response.status(500).json(err)
        }
    }

}

export default PointsController