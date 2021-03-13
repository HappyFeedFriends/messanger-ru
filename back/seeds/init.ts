import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del()
    await knex('images').del();
    await knex('images').insert([
        {
            Url : 'test_url',
        }
    ])

    const users = []
    for (let i = 0; i < 150; i++) {
        users.push({
            username : 'happy' + Math.random() * 100,
            password : 'qwerty',
            email : 'test@mail.ru',
            imageID : 1,
        })
        
    }

    await knex('users').insert(users);

};
