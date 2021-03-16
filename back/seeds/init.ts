import { Knex } from "knex";
import faker from 'faker';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    
    await knex.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
    await knex.raw('TRUNCATE TABLE images RESTART IDENTITY CASCADE');

    await knex.raw('TRUNCATE TABLE messagechannels RESTART IDENTITY CASCADE');
    await knex.raw('TRUNCATE TABLE channellist RESTART IDENTITY CASCADE');

    // Inserts seed entries
    const channels = []
    for (let i = 0; i < 1000; i++) {
        channels.push({
            created_at : faker.date.past(),
        }) 
    }



    const min = 1
    const max = 1000

    const avatars = []

    for (let i = 0; i < 150; i++) {
        avatars.push({
            Url : faker.image.image(),
        })
        
    }

    await knex('images').insert(avatars)
    await knex("messagechannels").insert(channels)
    for (let i = 0; i < 1; i++) {

        const channelLists = [];

        for (let _i = 1; _i < 10000; _i++) {
            channelLists.push({
                UserID : faker.random.number({max : _i + i * 500,min : i * 500 + 1}),
                MessageChannelID : faker.random.number({max : 1000,min : 1}) ,
            })
            
        }

        const users = []
        for (let _i = 0; _i < 10000; _i++) {
            users.push({
                username : faker.name.findName(),
                password : faker.internet.password(16),
                email : faker.internet.email(),
                imageID : faker.random.number({min : 1, max : 150}),
            })
        }
        await knex('users').insert(users);
        await knex('channellist').insert(channelLists)
    }


};
