const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "!c0Me8@c4,p1Co;",
    host: "localhost",
    port: 5432,
    database: "racepredictorgp"
})

module.exports = pool;