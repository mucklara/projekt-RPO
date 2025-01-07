const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes'); // Uvoz avtentikacijskih poti
const progressRoutes = require('./routes/progressRoutes'); // Uvoz poti za napredek
const gamesRoutes = require('./routes/gamesRoutes'); // Uvoz poti za igre

const app = express();

// Middleware za procesiranje JSON zahtev
app.use(express.json());

// Statične datoteke iz mape 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Avtentikacijske poti
app.use('/api/auth', authRoutes);

// Poti za napredek uporabnikov
app.use('/api/progress', progressRoutes);

// Poti za igre
app.use('/api/games', gamesRoutes);

// Privzeta pot za domačo stran
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Pot za crossword stran
app.get('/crossword', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'crossword.html'));
});

// 404 Napake
app.use((req, res) => {
    res.status(404).send('Stran ni najdena.');
});

// Zagon strežnika
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Strežnik deluje na http://localhost:${PORT}`);
});
