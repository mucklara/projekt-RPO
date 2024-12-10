const express = require('express');
const router = express.Router();

const {
  addUserAnswer,
  getUserAnswers,
  getUserAnswerById,
  updateUserAnswer,
  deleteUserAnswer,
} = require('../controllers/userAnswersController');

// Add a new user answer
router.post('/add', async (req, res) => {
  const { userId, questionId, answerText, isCorrect } = req.body;

  try {
    const result = await addUserAnswer(userId, questionId, answerText, isCorrect);
    res.status(201).json({ message: 'User answer added successfully', id: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all user answers
router.get('/', async (req, res) => {
  try {
    const userAnswers = await getUserAnswers();
    res.status(200).json(userAnswers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific user answer by user ID and question ID
router.get('/:userId/:questionId', async (req, res) => {
  const { userId, questionId } = req.params;

  try {
    const userAnswer = await getUserAnswerById(userId, questionId);
    res.status(200).json(userAnswer);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Update a user answer
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { answerText, isCorrect } = req.body;
  
    try {
      const result = await updateUserAnswer(id, answerText, isCorrect);
      res.status(200).json({ message: 'User answer updated successfully', result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// Delete a user answer
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteUserAnswer(id);
    res.status(200).json({ message: 'User answer deleted successfully', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
