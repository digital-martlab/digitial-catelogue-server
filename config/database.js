const mysql = require('mysql2/promise');
const constantVariables = require('./constant-variables');

const pool = mysql.createPool({
    host: constantVariables.DB_HOST,
    user: constantVariables.DB_USER,
    password: constantVariables.DB_PASSWORD,
    database: constantVariables.DB_NAME,
    multipleStatements: true,
});

async function query(sql, params) {
    try {
        const rows = await pool.query(sql, params);
        return rows[0];
    } catch (error) {
        console.error(error);
        throw 'Database query error';
    }
}

module.exports = query;