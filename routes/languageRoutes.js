const express = require('express');
const router = express.Router();

// Importing functions from the languageController.js
const {
    addLanguage,
    getLanguages,
    getLanguageById,
    updateLanguageName,
    deleteLanguageById
} = require('../controllers/languageController');

// Route for adding a language
router.post('/add', async (req, res) => {
    const { name, description } = req.body;
    await addLanguage(name, description);
    res.status(201).send('Language added successfully');
});

// Route for getting all languages
router.get('/', async (req, res) => {
    const languages = await getLanguages();
    res.status(200).json(languages);
});

// Route for getting a language by ID
router.get('/:id', async (req, res) => {
    const language = await getLanguageById(req.params.id);
    res.status(200).json(language);
});

// Route for updating a language's name
router.put('/:id/name', async (req, res) => {
    const newName = req.body.name;
    await updateLanguageName(req.params.id, newName);
    res.status(200).send('Language name updated successfully');
});

// Route for deleting a language
router.delete('/:id', async (req, res) => {
    await deleteLanguageById(req.params.id);
    res.status(200).send('Language deleted successfully');
});

module.exports = router;
