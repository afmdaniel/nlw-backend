// Update with your config settings.
import path from 'path'
const { dataBaseConfig }  = require('./.env') 

module.exports = {
  client: "postgresql",
  connection: dataBaseConfig,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: "knex_migrations",
    extension: 'ts',
    directory: path.resolve(__dirname, 'src', 'database', 'migrations')
  }
};
