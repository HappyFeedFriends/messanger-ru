import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table('messages',(table : Knex.TableBuilder) => {
        table.integer('imageID').nullable().references('id').inTable('images').onDelete('CASCADE').onUpdate('CASCADE').index('message_image_id_index');
    })
}


export async function down(knex: Knex): Promise<void> {
}

