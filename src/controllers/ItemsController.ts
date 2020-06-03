import { Request, Response} from 'express'
import knex from '../database/connection'

class ItemsController {
    async index (request: Request, response: Response) {
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
    }
}

export default ItemsController