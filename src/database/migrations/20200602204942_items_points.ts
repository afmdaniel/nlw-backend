import Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    return knex.schema.createTable('items_points', table => {
        table.increments('id').primary()
        table.integer('point_id')
            .references('id')
            .inTable('garbage_collection_points')
        table.integer('item_id')
            .references('id')
            .inTable('items_for_collection')
    })
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable('items_points')
}

