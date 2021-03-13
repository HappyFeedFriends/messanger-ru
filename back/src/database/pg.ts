import { Client } from "pg";

const client = new Client({
    "host": "localhost",
    "user": process.env.PGUSER,
    "database": process.env.DATABASE_URL,
    "password": process.env.PGPASSWORD,
    "port": Number(process.env.PGPORT),
});
client.connect();

export default client;