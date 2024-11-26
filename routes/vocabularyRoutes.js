// vocabularyRoutes.js
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

// Route for adding a vocabulary word to a language
router.post('/add', async (req, res) => {
    const { word, languageId } = req.body;
    await addVocabularyWord(word, languageId);
    res.status(201).send('Vocabulary word added successfully');
});

// Route for getting all vocabulary words for a language
router.get('/:languageId', async (req, res) => {
    const vocabulary = await getVocabularyByLanguage(req.params.languageId);
    res.status(200).json(vocabulary);
});

// Route for getting a specific vocabulary word by its ID
router.get('/word/:vocabularyId', async (req, res) => {
    const vocabulary = await getVocabularyById(req.params.vocabularyId);
    res.status(200).json(vocabulary);
});

// Route for updating a vocabulary word
router.put('/update', async (req, res) => {
    const { vocabularyId, newWord } = req.body;
    await updateVocabularyWord(vocabularyId, newWord);
    res.status(200).send('Vocabulary word updated successfully');
});

// Route for deleting a vocabulary word
router.delete('/delete', async (req, res) => {
    const { vocabularyId } = req.body;
    await deleteVocabularyWord(vocabularyId);
    res.status(200).send('Vocabulary word deleted successfully');
});

module.exports = router;
