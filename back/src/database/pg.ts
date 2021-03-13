import { knex } from "knex";
  
export const knexQuery = knex({
    client: 'postgres',
    connection : {
        "host": "localhost",
        "user": process.env.PGUSER,
        "database": process.env.DATABASE_URL,
        "password": process.env.PGPASSWORD,
        "port": Number(process.env.PGPORT),
    }
});;