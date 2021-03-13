import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    await knex.schema.createTable("images", (table: Knex.TableBuilder) => {
        table.increments('id').primary();
        table.text('Url').notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });

    await knex.schema.createTable("users", (table: Knex.TableBuilder) => {
        table.increments('id').primary();
        table.text('username').notNullable();
        table.text('password').notNullable();
        table.integer('imageID').references('id').inTable('images');
        table.text('email').notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });


    await knex.schema.createTable("messagechannels", (table: Knex.TableBuilder) => {
        table.increments('id').primary();
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });

    await knex.schema.createTable("messages", (table: Knex.TableBuilder) => {
        table.increments('id').primary();
        table.integer('AuthorID').references("id").inTable("users");
        table.integer('MessageChannelID').references('id').inTable('messagechannels');
        table.text('content').notNullable();
        table.timestamp("update_at").defaultTo(knex.fn.now());
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw('DROP TABLE messagechannels CASCADE')
    await knex.raw('DROP TABLE messages CASCADE')
    await knex.raw('DROP TABLE users CASCADE')
    await knex.raw('DROP TABLE images CASCADE')
}

