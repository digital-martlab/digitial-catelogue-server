const mysql = require('mysql2/promise');
const constantVariables = require('./constant-variables');

const pool = mysql.createPool({
    host: constantVariables.DB_HOST,
    user: constantVariables.DB_USER,
    password: constantVariables.DB_PASSWORD,
    database: constantVariables.DB_NAME,
    multipleStatements: true,
});

// Function to run a query without a transaction
async function sqlQueryRunner(sql, params) {
    try {
        const [rows] = await pool.execute(sql, params);
        return rows; // Return rows directly
    } catch (error) {
        throw error;
    }
}

// Begin transaction
async function beginTransaction() {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    return connection; // Return the connection to control transaction
}

// Commit transaction
async function commitTransaction(connection) {
    try {
        await connection.commit();
    } catch (error) {
        await connection.rollback(); // If commit fails, rollback
        throw error;
    } finally {
        connection.release(); // Release the connection back to the pool
    }
}

// Rollback transaction
async function rollbackTransaction(connection) {
    try {
        await connection.rollback();
    } finally {
        connection.release(); // Always release the connection
    }
}

module.exports = {
    sqlQueryRunner,
    beginTransaction,
    commitTransaction,
    rollbackTransaction,
};
