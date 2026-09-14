const mysql = require("mysql2/promise"); //Načítanie SQL drivera ktorý podporuje await
require("dotenv").config(); //Načíta hodnoty z .env

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

module.exports = pool;