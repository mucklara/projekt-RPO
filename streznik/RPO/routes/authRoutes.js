const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Začasno shranjevanje uporabnikov in žetonov
const users = [];
const tokens = [];

// Skrivni ključ za podpisovanje žetonov
const SECRET_KEY = 'moj_skrivni_kljuc'; // Spremeni v varno vrednost!

// Ruta za registracijo uporabnika
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Preverimo, ali je uporabniško ime že zasedeno
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: 'Uporabniško ime že obstaja.' });
    }

    // Dodamo uporabnika v pomnilnik
    users.push({ username, password });
    res.status(201).json({ message: 'Uporabnik uspešno registriran!' });
});

// Ruta za prijavo uporabnika
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Poiščemo uporabnika in preverimo poverilnice
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Neveljavne poverilnice.' });
    }

    // Generiramo žeton (JWT)
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    tokens.push(token); // Shrani žeton

    res.status(200).json({ message: 'Prijava uspešna!', token });
});

// Ruta za odjavo uporabnika
router.post('/logout', (req, res) => {
    const { token } = req.body;

    // Preverimo, če je žeton veljaven in ga odstranimo
    const index = tokens.indexOf(token);
    if (index === -1) {
        return res.status(400).json({ message: 'Neveljaven žeton.' });
    }

    tokens.splice(index, 1); // Odstrani žeton iz pomnilnika
    res.status(200).json({ message: 'Odjava uspešna!' });
});

module.exports = router;
