const express = require('express');
const router = express.Router();

// Importing functions from the questionsController.js
const {
    addQuestion,
    getQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion
} = require('../controllers/questionsController');

// Route for adding a new question
router.post('/add', async (req, res) => {
    const { questionText, options, correctAnswer } = req.body;
    await addQuestion(questionText, options, correctAnswer);
    res.status(201).send('Question added successfully');
});

// Route for getting all questions
router.get('/', async (req, res) => {
    const questions = await getQuestions();
    res.status(200).json(questions);
});

// Route for getting a specific question by ID
router.get('/:id', async (req, res) => {
    const question = await getQuestionById(req.params.id);
    res.status(200).json(question);
});

// Route for updating an existing question
router.put('/update', async (req, res) => {
    const { questionId, questionText, options, correctAnswer } = req.body;
    await updateQuestion(questionId, questionText, options, correctAnswer);
    res.status(200).send('Question updated successfully');
});

// Route for deleting a question
router.delete('/delete', async (req, res) => {
    const { questionId } = req.body;
    await deleteQuestion(questionId);
    res.status(200).send('Question deleted successfully');
});

module.exports = router;
