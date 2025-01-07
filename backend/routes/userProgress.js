const express = require('express');
const router = express.Router();

// Importing functions from the progressController.js
const {
  addProgress,
  getUserProgress,
  updateUserProgress,
  deleteProgress,
  userProgressController
} = require('../controllers/userProgressController');

router.get('/:userId', userProgressController.getUserProgress);

// Route for adding progress
router.post('/add', async (req, res) => {
  const { userId, languageId, level, points } = req.body;
  
  try {
    await addProgress(userId, languageId, level, points);
    res.status(201).send('Progress added successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route for getting a user's progress in a language
router.get('/:userId/:languageId', async (req, res) => {
  const { userId, languageId } = req.params;

  try {
    const progress = await getUserProgress(userId, languageId);
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route for updating a user's progress
router.put('/update', async (req, res) => {
  const { userId, languageId } = req.body;

  if (!userId || !languageId) {
    return res.status(400).send('Missing required fields: userId and languageId');
  }

  try {
    const result = await updateUserProgress(userId, languageId);
    res.status(200).json({
      message: 'User progress updated successfully',
      points: result.points,
      level: result.level
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route for deleting progress
router.delete('/delete', async (req, res) => {
  const { userId, languageId } = req.body;

  try {
    await deleteProgress(userId, languageId);
    res.status(200).send('Progress deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
