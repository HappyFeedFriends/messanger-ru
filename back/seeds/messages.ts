import { Knex } from "knex";
import faker from 'faker';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex.raw('TRUNCATE TABLE messages RESTART IDENTITY CASCADE');

    for (let index = 0; index < 100; index++) {
        const messages = []
        for (let i = 0; i < 10000; i++) {
            faker.random.arrayElement(["ru","en","de","fr","en_AU"])
            messages.push({
                AuthorID : faker.random.number({min : 1, max : 100}),
                MessageChannelID : faker.random.number({min : 1, max : 1000}),
                content : faker.lorem.text(10),
                created_at : faker.date.between('2021-03-17', new Date()),
            })
            
        }
        await knex('messages').insert(messages)
        
    }
 

};
