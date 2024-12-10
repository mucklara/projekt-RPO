const express = require('express');
const path = require('path');
const morgan = require('morgan'); // Middleware za logiranje zahtev
const authRoutes = require('./routes/authRoutes'); // Import routes

const app = express();

// Middleware za logiranje zahtev
app.use(morgan('dev'));

// Middleware za obdelavo JSON zahtev
app.use(express.json());

// Služenje statičnih datotek iz mape 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Uporaba avtentikacijskih poti
app.use('/api/auth', authRoutes);

// Privzeta pot za domačo stran
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Pot za stran križanke
app.get('/crossword', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'crossword', 'crossword.html'));
});

// Zagon strežnika
const port = 3000;
app.listen(port, () => {
    console.log(`Strežnik deluje na http://localhost:${port}`);
});

// Obravnava 404 napak
app.use((req, res) => {
    res.status(404).send(`Stran ni najdena. Poskusili ste dostopati do: ${req.originalUrl}`);
});
