const express = require('express');
const router = express.Router();
const db = require('../db'); // Uvoz povezave z bazo podatkov
const redisClient = require('../redisClient'); // Uvozi Redis odjemalca

// Helper funkcija za validacijo
function validateGameRequest(body, res) {
    const { language_id, level } = body;

    if (!language_id) {
        res.status(400).json({ error: 'Missing language_id' });
        return false;
    }
    if (typeof language_id !== 'number' || language_id <= 0) {
        res.status(400).json({ error: 'Invalid language_id. Must be a positive number.' });
        return false;
    }

    if (!level) {
        res.status(400).json({ error: 'Missing level' });
        return false;
    }
    if (!['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(level)) {
        res.status(400).json({ error: 'Invalid level. Must be one of: A1, A2, B1, B2, C1, C2.' });
        return false;
    }

    return true;
}

// Ruta vrne igre
// GET /api/games - pridobi seznam iger (z Redis predpomnjenjem)
router.get('/', async (req, res) => {
    try {
        // Preveri predpomnjenje
        const cachedData = await redisClient.get('games');
        if (cachedData) {
            console.log('Serving from cache');
            return res.status(200).json(JSON.parse(cachedData)); // Vrni predpomnjene podatke
        }

        console.log('Serving from database');
        // Če ni v predpomnilniku, pridobi iz baze in shrani v Redis
        await redisClient.set('games', JSON.stringify(games), {
            EX: 60 // Poteče po 60 sekundah
        });

        res.status(200).json(games);
    } catch (err) {
        console.error('Error fetching games:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

router.post('/', async (req, res) => {
    const { name, description } = req.body;
    const newGame = { id: games.length + 1, name, description };

    // Dodaj novo igro v bazo (ali lokalni seznam)
    games.push(newGame);

    // Izbriši predpomnilnik za seznam iger
    await redisClient.del('games');

    // Vrni potrditev
    res.status(201).send({ message: 'Game added successfully', game: newGame });
});

router.put('/:gameId', async (req, res) => {
    const gameId = parseInt(req.params.gameId);
    const { name, description } = req.body;

    // Najdi igro v bazi in jo posodobi
    const game = games.find(g => g.id === gameId);
    if (game) {
        game.name = name;
        game.description = description;

        // Posodobi predpomnilnik s posodobljenim seznamom iger
        await redisClient.set('games', JSON.stringify(games), {
            EX: 60 // Poteče po 60 sekundah
        });

        res.status(200).send({ message: 'Game updated successfully', game });
    } else {
        res.status(404).send({ message: 'Game not found' });
    }
});

// Ruta za pridobitev podatkov za Crossword
router.post('/crossword', async (req, res) => {
    if (!validateGameRequest(req.body, res)) return;

    const { language_id, level } = req.body;

    try {
        const [rows] = await db.query('CALL GetCrosswordVocabulary(?, ?)', [language_id, level]);
        res.status(200).json({ message: rows[0] });
    } catch (error) {
        console.error('Error fetching crossword data:', error.message);
        res.status(500).json({ error: 'Failed to fetch crossword data' });
    }
});

// Ruta za pridobitev podatkov za Match Image to Word
router.post('/matchtheimage', async (req, res) => {
    if (!validateGameRequest(req.body, res)) return;

    const { language_id, level } = req.body;

    try {
        const [rows] = await db.query('CALL GetMatchImageToWordVocabulary(?, ?)', [language_id, level]);
        res.status(200).json({ message: rows[0] });
    } catch (error) {
        console.error('Error fetching match image to word data:', error.message);
        res.status(500).json({ error: 'Failed to fetch match image to word data' });
    }
});

// Ruta za pridobitev podatkov za Match Two Words
router.post('/matchtwowords', async (req, res) => {
    if (!validateGameRequest(req.body, res)) return;

    const { language_id, level } = req.body;

    try {
        const [rows] = await db.query('CALL GetMatchTwoWordsVocabulary(?, ?)', [language_id, level]);
        res.status(200).json({ message: rows[0] });
    } catch (error) {
        console.error('Error fetching match two words data:', error.message);
        res.status(500).json({ error: 'Failed to fetch match two words data' });
    }
});

// Ruta za pridobitev podatkov za Guess the Meaning
router.post('/guessthemeaning', async (req, res) => {
    if (!validateGameRequest(req.body, res)) return;

    const { language_id, level } = req.body;

    try {
        const [rows] = await db.query('CALL GetGuessTheMeaningVocabulary(?, ?)', [language_id, level]);
        res.status(200).json({ message: rows[0] });
    } catch (error) {
        console.error('Error fetching guess the meaning data:', error.message);
        res.status(500).json({ error: 'Failed to fetch guess the meaning data' });
    }
});

module.exports = router;
