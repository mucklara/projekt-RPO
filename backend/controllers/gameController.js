const db = require('../setupDatabase'); // Import database connection

const userController = {
    updateUserProgress: async (req, res) => {
        try {
            const { userId, languageId, points, level } = req.body;

            // Update user points and level in the database
            await db.query('UPDATE user_progress SET points = ?, level = ? WHERE user_id = ? AND language_id = ?', [points, level, userId, languageId]);

            res.status(200).json({ message: 'User progress updated successfully' });
        } catch (error) {
            console.error('Error updating user progress:', error);
            res.status(500).json({ error: 'Failed to update user progress' });
        }
    },
};

module.exports = userController;


// Helper function for validation
function validateGameRequest(body) {
    const { language_id, level } = body;

    if (!language_id || typeof language_id !== 'number' || language_id <= 0) {
        throw new Error('Invalid or missing language_id');
    }
    if (!level || !['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(level)) {
        throw new Error('Invalid or missing level');
    }
}

const gameController = {
    getGames: (req, res) => {
        const games = ['Crossword', 'Match the word pair', 'Match the image with the word', 'Guess the meaning'];
        res.status(200).json({ message: games });
    },

    getCrossword: async (req, res) => {
        try {
            validateGameRequest(req.body);
            const { language_id, level } = req.body;

            const [rows] = await db.query('CALL GetCrosswordVocabulary(?, ?)', [language_id, level]);
            res.status(200).json({ message: rows[0] });
        } catch (error) {
            console.error('Error fetching crossword data:', error.message);
            res.status(400).json({ error: error.message });
        }
    },

    getMatchImage: async (req, res) => {
        try {
            validateGameRequest(req.body);
            const { language_id, level } = req.body;

            const [rows] = await db.query('CALL GetMatchImageToWordVocabulary(?, ?)', [language_id, level]);
            res.status(200).json({ message: rows[0] });
        } catch (error) {
            console.error('Error fetching match image data:', error.message);
            res.status(400).json({ error: error.message });
        }
    },

    getMatchTwoWords: async (req, res) => {
        try {
            validateGameRequest(req.body);
            const { language_id, level } = req.body;

            const [rows] = await db.query('CALL GetMatchTwoWordsVocabulary(?, ?)', [language_id, level]);
            res.status(200).json({ message: rows[0] });
        } catch (error) {
            console.error('Error fetching match two words data:', error.message);
            res.status(400).json({ error: error.message });
        }
    },

    getGuessTheMeaning: async (req, res) => {
        try {
            validateGameRequest(req.body);
            const { language_id, level } = req.body;

            const [rows] = await db.query('CALL GetGuessTheMeaningVocabulary(?, ?)', [language_id, level]);
            res.status(200).json({ message: rows[0] });
        } catch (error) {
            console.error('Error fetching guess the meaning data:', error.message);
            res.status(400).json({ error: error.message });
        }
    },
};

module.exports = gameController;