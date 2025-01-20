const express = require('express');
const router = express.Router();
const db = require('../db'); // Uvoz povezave z bazo podatkov

// Ruta vrne igre
router.post('/games', (req, res) => {
    const games = ['Crossword', 'Match the word pair', 'Match the image with the word', 'Guess the meaning'];
    res.status(200).json({ message: games });
});

// Ruta za pridobitev podatkov za Crossword
router.post('/crossword', async (req, res) => {
    const { language_id, level } = req.body;

    if (!language_id || !level) {
        // return res.status(400).json({ error: 'Missing language_id or level' });
    }

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
    const { language_id, level } = req.body;

    if (!language_id || !level) {
        return res.status(400).json({ error: 'Missing language_id or level' });
    }

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
    const { language_id, level } = req.body;

    if (!language_id || !level) {
        return res.status(400).json({ error: 'Missing language_id or level' });
    }

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
    const { language_id, level } = req.body;

    if (!language_id || !level) {
        return res.status(400).json({ error: 'Missing language_id or level' });
    }

    try {
        const [rows] = await db.query('CALL GetGuessTheMeaningVocabulary(?, ?)', [language_id, level]);
        res.status(200).json({ message: rows[0] });
    } catch (error) {
        console.error('Error fetching guess the meaning data:', error.message);
        res.status(500).json({ error: 'Failed to fetch guess the meaning data' });
    }
});

module.exports = router;
