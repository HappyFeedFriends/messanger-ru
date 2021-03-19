import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    await knex.schema.table('users',(table : Knex.TableBuilder) => {
        table.boolean('onlinestatus').notNullable().defaultTo(false)
    })

}


export async function down(knex: Knex): Promise<void> {
}

