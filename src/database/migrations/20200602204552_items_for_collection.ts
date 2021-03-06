import Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    return knex.schema.createTable('items_for_collection', table => {
        table.increments('id').primary()
        table.string('image').notNullable()
        table.string('title').notNullable()
    })
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable('items_for_collection')
}

