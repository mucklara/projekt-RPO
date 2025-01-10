const express = require('express');
const router = express.Router();
const db = require('../db'); // Uvoz povezave z bazo podatkov

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
router.post('/games', (req, res) => {
    const games = ['Crossword', 'Match the word pair', 'Match the image with the word', 'Guess the meaning'];
    res.status(200).json({ message: games });
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
