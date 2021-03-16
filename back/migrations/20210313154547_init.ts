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
        table.integer('imageID').notNullable().defaultTo(1).references('id').inTable('images').onDelete('CASCADE').onUpdate('CASCADE');
        table.text('email').notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });


    await knex.schema.createTable("messagechannels", async (table: Knex.TableBuilder) => {
        table.increments('id').primary()
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });

    await knex.schema.createTable("channellist", async (table: Knex.TableBuilder) => {
        table.increments('id').primary()
        table.integer('UserID').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE').index('user_id_index');
        table.integer('MessageChannelID').notNullable().references('id').inTable('messagechannels').onDelete('CASCADE').onUpdate('CASCADE').index('message_channel_id');
    });

    await knex.schema.createTable("messages", (table: Knex.TableBuilder) => {
        table.increments('id').primary();
        table.integer('AuthorID').references("id").inTable("users").onDelete('CASCADE').onUpdate('CASCADE');
        table.integer('MessageChannelID').references('id').inTable('messagechannels').onDelete('CASCADE').onUpdate('CASCADE');
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
    await knex.raw('DROP TABLE channellist CASCADE')

}

