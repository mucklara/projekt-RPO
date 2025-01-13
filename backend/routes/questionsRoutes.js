const express = require('express');
const router = express.Router();

// Importing functions from the questionsController.js
const {
    createQuestion,
    getQuestionsByQuiz,
    updateQuestion,
    deleteQuestion
} = require('../controllers/questionsController');

// Route for adding a new question
router.post('/add', async (req, res) => {
    const { quizId, questionText, options, correctAnswer } = req.body;
    try {
        const result = await createQuestion(quizId, questionText, options, correctAnswer);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding question:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
});

// Route for getting all questions
router.get('/', async (req, res) => {
    try {
        const questions = await knex('questions').select('*');
        res.status(200).json({ success: true, data: questions });
    } catch (error) {
        console.error('Error fetching questions:', error.message);
        res.status(500).json({ success: false, message: 'Failed to retrieve questions.' });
    }
});

// Route for getting questions by quiz ID
router.get('/:id', async (req, res) => {
    try {
        const result = await getQuestionsByQuiz(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching question:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
});

// Route for updating an existing question
router.put('/update', async (req, res) => {
    const { questionId, questionText, options, correctAnswer } = req.body;
    try {
        const result = await updateQuestion(questionId, questionText, options, correctAnswer);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error updating question:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
});

// Route for deleting a question
router.delete('/delete', async (req, res) => {
    const { questionId } = req.body;
    try {
        const result = await deleteQuestion(questionId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting question:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;
