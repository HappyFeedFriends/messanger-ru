import { Knex } from "knex";

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
            created_at : new Date(),
        }) 
    }



    const min = 1
    const max = 1000

    await knex("images").insert({
        Url : 'https://sun9-31.userapi.com/impf/oq21VXB3oLdfGeC1GqwCGudVPlPPohqwFeKRuA/dSlFCSsz9UA.jpg?size=1144x1156&quality=96&sign=911e4bf785524d1e7eb1eb421a39aaa8&type=album',
    }) 
    await knex("messagechannels").insert(channels)
    for (let i = 0; i < 1; i++) {

        const channelLists = [];

        for (let _i = 1; _i < 10000; _i++) {
            channelLists.push({
                UserID : _i + i * 500,
                MessageChannelID : Math.round(min - 0.5 + Math.random() * (max - min + 1)),
            })
            
        }

        const users = []
        for (let _i = 0; _i < 10000; _i++) {
            users.push({
                username : 'happy' + _i + i * 500,
                password : 'qwerty',
                email : 'test@mail.ru',
            })
        }
        await knex('users').insert(users);
        await knex('channellist').insert(channelLists)
    }


};
