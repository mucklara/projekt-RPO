const express = require('express');
const router = express.Router();

// Importing functions from the quizController.js
const {
    addQuiz,
    getQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz
} = require('../controllers/quizzesController');

// Route for adding a quiz
router.post('/add', async (req, res) => {
    const { title, description, languageId, difficultyLevel } = req.body;
    await addQuiz(title, description, languageId, difficultyLevel);
    res.status(201).send('Quiz added successfully');
});

// Route for getting all quizzes
router.get('/', async (req, res) => {
    const quizzes = await getQuizzes();
    res.status(200).json(quizzes);
});

// Route for getting a specific quiz by its ID
router.get('/:id', async (req, res) => {
    const quiz = await getQuizById(req.params.id);
    res.status(200).json(quiz);
});

// Route for updating a quiz
router.put('/update', async (req, res) => {
    const { quizId, title, description, languageId, difficultyLevel } = req.body;
    await updateQuiz(quizId, title, description, languageId, difficultyLevel);
    res.status(200).send('Quiz updated successfully');
});

// Route for deleting a quiz
router.delete('/delete', async (req, res) => {
    const { quizId } = req.body;
    await deleteQuiz(quizId);
    res.status(200).send('Quiz deleted successfully');
});

module.exports = router;
