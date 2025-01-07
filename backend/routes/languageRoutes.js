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
// routes/languages.js
router.get('/', async (req, res) => {
    try {
      const languages = await db.query('SELECT * FROM languages');
      res.json(languages);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching languages' });
    }
  });
  

// Route for getting a language by ID
router.get('/:id', async (req, res) => {
    const language = await getLanguageById(req.params.id);
    res.status(200).json(language);
});

// Route for updating a language's name
router.put('/:id/name', async (req, res) => {
    const newName = req.body.name;
    const languageId = req.params.id;

    try {
        const result = await updateLanguage(languageId, newName);
        res.status(200).json(result);  // Send success response
    } catch (error) {
        console.error('Error updating language:', error.message);
        res.status(500).json({
            success: false,
            message: error.message,  // Send error message from updateLanguage function
        });
    }
});

// Route for deleting a language
router.delete('/:id', async (req, res) => {
    await deleteLanguage(req.params.id);
    res.status(200).send('Language deleted successfully');
});

module.exports = router;
