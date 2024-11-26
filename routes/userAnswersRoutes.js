const express = require('express');
const router = express.Router();

// Importing functions from userAnswersController.js
const {
    addUserAnswer,
    getUserAnswers,
    getUserAnswerById,
    updateUserAnswer,
    deleteUserAnswer
} = require('../controllers/userAnswersController');

// Route for adding a new user answer
router.post('/add', async (req, res) => {
    const { userId, questionId, answerText, isCorrect } = req.body;
    try {
        const result = await addUserAnswer(userId, questionId, answerText, isCorrect);
        res.status(201).json({ message: 'User answer added successfully', result });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add user answer' });
    }
});

// Route for getting all user answers
router.get('/', async (req, res) => {
    try {
        const userAnswers = await getUserAnswers();
        res.status(200).json(userAnswers);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user answers' });
    }
});

// Route for getting a user answer by its ID
router.get('/:id', async (req, res) => {
    try {
        const userAnswer = await getUserAnswerById(req.params.id);
        if (userAnswer) {
            res.status(200).json(userAnswer);
        } else {
            res.status(404).json({ message: 'User answer not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user answer' });
    }
});

// Route for updating a user answer
router.put('/update', async (req, res) => {
    const { userAnswerId, newAnswerText, isCorrect } = req.body;
    try {
        const result = await updateUserAnswer(userAnswerId, newAnswerText, isCorrect);
        res.status(200).json({ message: 'User answer updated successfully', result });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user answer' });
    }
});

// Route for deleting a user answer
router.delete('/delete', async (req, res) => {
    const { userAnswerId } = req.body;
    try {
        const result = await deleteUserAnswer(userAnswerId);
        res.status(200).json({ message: 'User answer deleted successfully', result });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user answer' });
    }
});

module.exports = router;
