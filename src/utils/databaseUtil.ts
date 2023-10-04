import {createPool} from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
const pool = createPool({
    host: 'localhost',
    port: Number(process.env.APP_MYSQL_PORT) ?? 3400,
    user: 'root',
    password: process.env.APP_MYSQL_ROOT_PASS,
    database: 'pms',
    connectionLimit: 10,
    enableKeepAlive: true,
});

export {
    pool
};
