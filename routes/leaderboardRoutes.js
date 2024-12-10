const express = require('express');
const router = express.Router();

// Importing functions from the leaderboardController.js
const {
    getLeaderboard,
    addpoints,
    updateLeaderboard,
    deletepoints
} = require('../controllers/leaderboardController');

// Route for getting the leaderboard
router.get('/', async (req, res) => {
    const { languageId } = req.query;  // Optional query parameter to filter by language
    const leaderboard = await getLeaderboard(languageId ? parseInt(languageId) : null);
    res.status(200).json(leaderboard);
});

// Route for adding points
router.post('/add', async (req, res) => {
    const { userId, languageId, points } = req.body;
    await addpoints(userId, languageId, points);
    res.status(201).send('Points added successfully');
});

// Route for updating a user's points
router.put('/update', async (req, res) => {
    const { userId, languageId, points } = req.body;
    await updateLeaderboard(userId, languageId, points);
    res.status(200).send('Points updated successfully');
});

// Route for deleting points
router.delete('/delete', async (req, res) => {
    const { userId, languageId } = req.body;
    await deletepoints(userId, languageId);
    res.status(200).send('Points deleted successfully');
});

module.exports = router;
