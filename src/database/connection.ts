const config = require('../../knexfile.ts')
import Knex from 'knex'

const knex = Knex(config)

export default knex;


