const express = require('express');
const router = express.Router();

// Importing functions from userVocabularyController.js
const {
    addUserVocabulary,
    getUserVocabulary,
    getUserVocabularyById,
    updateUserVocabulary,
    deleteUserVocabulary
} = require('../controllers/userVocabularyController');

// Route for adding a new user vocabulary record
router.post('/add', async (req, res) => {
    const { userId, vocabularyId, learned } = req.body;
    try {
        const result = await addUserVocabulary(userId, vocabularyId, learned);
        res.status(201).json({ message: 'User vocabulary added successfully', result });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add user vocabulary' });
    }
});

// Route for getting all user vocabulary records
router.get('/', async (req, res) => {
    try {
        const userVocabulary = await getUserVocabulary();
        res.status(200).json(userVocabulary);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user vocabulary records' });
    }
});

// Route for getting a user vocabulary record by its ID
router.get('/:id', async (req, res) => {
    try {
        const userVocabulary = await getUserVocabularyById(req.params.id);
        if (userVocabulary) {
            res.status(200).json(userVocabulary);
        } else {
            res.status(404).json({ message: 'User vocabulary not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user vocabulary record' });
    }
});

// Route for updating a user vocabulary record (e.g., mark as learned)
router.put('/update', async (req, res) => {
    const { userVocabularyId, learned } = req.body;
    try {
        const result = await updateUserVocabulary(userVocabularyId, learned);
        res.status(200).json({ message: 'User vocabulary updated successfully', result });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user vocabulary' });
    }
});

// Route for deleting a user vocabulary record
router.delete('/delete', async (req, res) => {
    const { userVocabularyId } = req.body;
    try {
        const result = await deleteUserVocabulary(userVocabularyId);
        res.status(200).json({ message: 'User vocabulary deleted successfully', result });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user vocabulary' });
    }
});

module.exports = router;
