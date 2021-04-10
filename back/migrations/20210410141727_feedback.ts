import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("feedback", (table: Knex.TableBuilder) => {
        table.increments('id').primary()
        table.text('theme').notNullable();
        table.text('text').notNullable();
        table.text('type').notNullable();
        table.integer('AuthorID').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw('DROP TABLE feedback CASCADE')
}

