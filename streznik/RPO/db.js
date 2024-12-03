const mysql = require('mysql2/promise');

// Create a connection pool
const db = mysql.createPool({
    host: 'localhost',        // MySQL server
    user: 'root',             // MySQL username 
    password: '', // MySQL password (dopolnite s svojo)
    database: 'LanguageLearning', // Nazadnje sem delala s to
    port: 3306                // MySQL port
});

module.exports = db;
