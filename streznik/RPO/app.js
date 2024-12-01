const express = require('express');
const authRoutes = require('./routes/authRoutes'); // Uvozimo rute

const app = express();

// Vmesna programska oprema za obdelavo JSON podatkov
app.use(express.json());

// Uporabimo rute za avtentikacijo
app.use('/api/auth', authRoutes);

// Osnovna ruta
app.get('/', (req, res) => {
    res.send('Strežnik deluje!');
});

// Zaženemo strežnik
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Strežnik deluje na http://localhost:${PORT}`);
});
