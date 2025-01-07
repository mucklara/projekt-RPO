const redis = require('redis');

// Inicializacija Redis odjemalca
const client = redis.createClient({
    url: 'redis://127.0.0.1:6379' // Privzeta povezava za lokalni Redis strežnik
});

// Povezava z Redis strežnikom
client.connect().then(() => {
    console.log('Connected to Redis');
}).catch((err) => {
    console.error('Redis connection error:', err);
});

module.exports = client;
