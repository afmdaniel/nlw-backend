import { Router } from 'express'

const routes = Router()

routes.get('/', (request, response) => {
    return response.status(200).send({ message: 'Hello, World!'} )
})

export default routes