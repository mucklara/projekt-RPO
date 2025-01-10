const express = require('express');
const router = express.Router();

// Importing functions from the languageController.js
const {
    createLanguage,
    getLanguages,
    getLanguageById,
    updateLanguage,
    deleteLanguage
} = require('../controllers/languageController');

// Route for adding a language

router.post('/add', async (req, res) => {
    try {
        const { language_name } = req.body;
        const result = await createLanguage(language_name);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
    await updateLanguage(req.params.id, newName);
    res.status(200).send('Language name updated successfully');
});

// Route for deleting a language
router.delete('/:id', async (req, res) => {
    await deleteLanguage(req.params.id);
    res.status(200).send('Language deleted successfully');
});

module.exports = router;
