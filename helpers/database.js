const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 5
});

pool.getConnection((err, connection) => {
    if (err) {
        console.log("ERROR HAPPENED");
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection lost');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused');
        }
        if (err.code === 'ER_GET_CONNECTION_TIMEOUT') {
            console.error("Can't connect to database.");
        }
        return;
    }
    if (connection) connection.release();
});

module.exports = pool;