// Update with your config settings.

export default {

  development: {
    client: 'pg',
    connection : {
      "host": "localhost",
      "user": 'postgres',
      "database": 'messanger_ru',
      "password": '123456',
      "port": 5432,
    }
  },

  production: {
    client: 'pg',
    connection : {
      "host": "localhost",
      "user": 'postgres',
      "database": 'messanger_ru',
      "password": '123456',
      "port": 5432,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  timezone: 'UTC'
};