const express = require('express');
const router = express.Router();

// Importing functions from the vocabularyController.js
const {
  addVocabularyWord,
  getVocabularyByLanguage,
  getVocabularyById,
  updateVocabularyWord,
  deleteVocabularyWord
} = require('../controllers/vocabularyController');

// Route for adding a vocabulary word
router.post('/add', async (req, res) => {
  const { languageId, word, translation, hint, level, imageUrl } = req.body;
  try {
    await addVocabularyWord(languageId, word, translation, hint, level, imageUrl);
    res.status(201).send('Vocabulary word added successfully');
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Route for getting all vocabulary words for a language
router.get('/:languageId', async (req, res) => {
  const { languageId } = req.params;
  try {
    const vocabulary = await getVocabularyByLanguage(languageId);
    res.status(200).json(vocabulary);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Route for getting a specific vocabulary word by its ID
router.get('/word/:vocabularyId', async (req, res) => {
  const { vocabularyId } = req.params;
  try {
    const vocabulary = await getVocabularyById(vocabularyId);
    res.status(200).json(vocabulary);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Route for updating a vocabulary word
router.put('/update', async (req, res) => {
  const { vocabularyId, word, translation, hint, level, imageUrl } = req.body;
  try {
    await updateVocabularyWord(vocabularyId, word, translation, hint, level, imageUrl);
    res.status(200).send('Vocabulary word updated successfully');
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Route for deleting a vocabulary word
router.delete('/delete', async (req, res) => {
  const { vocabularyId } = req.body;
  try {
    await deleteVocabularyWord(vocabularyId);
    res.status(200).send('Vocabulary word deleted successfully');
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

module.exports = router;
