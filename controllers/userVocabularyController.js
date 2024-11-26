const db = require('../db'); // Assuming you have a db.js that exports the database connection

// Function to add a new user vocabulary record
const addUserVocabulary = async (userId, vocabularyId, learned = false) => {
    const query = `
        INSERT INTO User_Vocabulary (user_id, vocabulary_id, learned)
        VALUES (?, ?, ?)
    `;
    try {
        const [result] = await db.execute(query, [userId, vocabularyId, learned]);
        return result;
    } catch (err) {
        console.error('Error adding user vocabulary:', err);
        throw err;
    }
};

// Function to get all user vocabulary records
const getUserVocabulary = async () => {
    const query = 'SELECT * FROM User_Vocabulary';
    try {
        const [results] = await db.execute(query);
        return results;
    } catch (err) {
        console.error('Error fetching user vocabulary:', err);
        throw err;
    }
};

// Function to get a user vocabulary record by its ID
const getUserVocabularyById = async (userVocabularyId) => {
    const query = 'SELECT * FROM User_Vocabulary WHERE user_vocabulary_id = ?';
    try {
        const [result] = await db.execute(query, [userVocabularyId]);
        return result[0];
    } catch (err) {
        console.error('Error fetching user vocabulary:', err);
        throw err;
    }
};

// Function to update a user vocabulary record
const updateUserVocabulary = async (userVocabularyId, learned) => {
    const query = `
        UPDATE User_Vocabulary 
        SET learned = ? 
        WHERE user_vocabulary_id = ?
    `;
    try {
        const [result] = await db.execute(query, [learned, userVocabularyId]);
        return result;
    } catch (err) {
        console.error('Error updating user vocabulary:', err);
        throw err;
    }
};

// Function to delete a user vocabulary record
const deleteUserVocabulary = async (userVocabularyId) => {
    const query = 'DELETE FROM User_Vocabulary WHERE user_vocabulary_id = ?';
    try {
        const [result] = await db.execute(query, [userVocabularyId]);
        return result;
    } catch (err) {
        console.error('Error deleting user vocabulary:', err);
        throw err;
    }
};

module.exports = {
    addUserVocabulary,
    getUserVocabulary,
    getUserVocabularyById,
    updateUserVocabulary,
    deleteUserVocabulary
};
