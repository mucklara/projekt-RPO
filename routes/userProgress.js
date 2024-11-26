const express = require('express');
const router = express.Router();

// Importing functions from the progressController.js
const {
    addProgress,
    getUserProgress,
    updateProgress,
    deleteProgress
} = require('../controllers/progressController');

// Route for adding progress
router.post('/add', async (req, res) => {
    const { userId, languageId, level, progress } = req.body;
    await addProgress(userId, languageId, level, progress);
    res.status(201).send('Progress added successfully');
});

// Route for getting a user's progress in a language
router.get('/:userId/:languageId', async (req, res) => {
    const { userId, languageId } = req.params;
    const progress = await getUserProgress(userId, languageId);
    res.status(200).json(progress);
});

// Route for updating a user's progress
router.put('/update', async (req, res) => {
    const { userId, languageId, level, progress } = req.body;
    await updateProgress(userId, languageId, level, progress);
    res.status(200).send('Progress updated successfully');
});

// Route for deleting progress
router.delete('/delete', async (req, res) => {
    const { userId, languageId } = req.body;
    await deleteProgress(userId, languageId);
    res.status(200).send('Progress deleted successfully');
});

module.exports = router;
