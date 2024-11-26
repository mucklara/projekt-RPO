const express = require('express');
const router = express.Router();

// Importing functions from the leaderboardController.js
const {
    getLeaderboard,
    addScore,
    updateScore,
    deleteScore
} = require('../controllers/leaderboardController');

// Route for getting the leaderboard
router.get('/', async (req, res) => {
    const leaderboard = await getLeaderboard();
    res.status(200).json(leaderboard);
});

// Route for adding a score
router.post('/add', async (req, res) => {
    const { userId, languageId, score } = req.body;
    await addScore(userId, languageId, score);
    res.status(201).send('Score added successfully');
});

// Route for updating a user's score
router.put('/update', async (req, res) => {
    const { userId, languageId, score } = req.body;
    await updateScore(userId, languageId, score);
    res.status(200).send('Score updated successfully');
});

// Route for deleting a score
router.delete('/delete', async (req, res) => {
    const { userId, languageId } = req.body;
    await deleteScore(userId, languageId);
    res.status(200).send('Score deleted successfully');
});

module.exports = router;
