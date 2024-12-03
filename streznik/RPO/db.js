const mysql = require('mysql2/promise');

// Create a connection pool
const db = mysql.createPool({
    host: 'localhost',        // MySQL server
    user: 'root',             // MySQL username (replace if different)
    password: 'Lip6.Ves9l00ps', // MySQL password (replace with yours)
    database: 'LanguageLearning', // Replace with your database name
    port: 3306                // MySQL default port
});

module.exports = db;
