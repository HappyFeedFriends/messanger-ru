import { Knex } from "knex";
import faker from 'faker';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex.raw('TRUNCATE TABLE messages RESTART IDENTITY CASCADE');

    const messages = []

    for (let i = 0; i < 10000; i++) {
        messages.push({
            AuthorID : faker.random.number({min : 1, max : 200}),
            MessageChannelID : faker.random.number({min : 1, max : 1000}),
            content : faker.lorem.text(10),
        })
        
    }

    await knex('messages').insert(messages)

};
