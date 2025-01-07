const express = require('express');
const router = express.Router();

// Importing functions from the quizController.js
const {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuizTitle,
  deleteQuiz
} = require('../controllers/quizzesController');

// Route for adding a quiz
router.post('/add', async (req, res) => {
    const { title, description, languageId, questionId } = req.body;
  
    try {
      const result = await createQuiz(title, description, languageId, questionId);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  // Route for updating a quiz
  router.put('/update', async (req, res) => {
    const { quizId, title, description, languageId, questionId } = req.body;
  
    try {
      const result = await updateQuizTitle(quizId, title, description, languageId, questionId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  

// Route for getting all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await getQuizzes();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route for getting a specific quiz by its ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await getQuizById(req.params.id);
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route for deleting a quiz
router.delete('/delete', async (req, res) => {
  const { quizId } = req.body;

  try {
    const result = await deleteQuiz(quizId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
