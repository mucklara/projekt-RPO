const mysql = require('mysql2/promise');

// Create a connection pool
const db = mysql.createPool({
    host: 'localhost',        // MySQL server
    user: 'root',             // MySQL username 
    password: '', 
    database: 'LanguageLearning', 
    port: 3306                // MySQL port
});

module.exports = db;
