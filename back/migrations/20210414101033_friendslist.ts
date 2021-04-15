import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("friendlist", (table: Knex.TableBuilder) => {
        table.increments('id').primary()
        table.integer('friend_1').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE').index('friend_1_index');
        table.integer('friend_2').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE').index('friend_2_index');
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw('DROP TABLE friendlist CASCADE')
}

