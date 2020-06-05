// Update with your config settings.
import path from 'path'
const { dataBaseConfig }  = require('./.env') 
import pg from 'pg'

pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value: string) => {
  return parseFloat(value);
});

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
  },
  seeds: {
    extension: 'ts',
    directory: path.resolve(__dirname, 'src', 'database', 'seeds')
  }
};
