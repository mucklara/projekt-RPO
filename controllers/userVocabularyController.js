const knex = require('../setupDatabase');

// Function to add a new user vocabulary record
const addUserVocabulary = async (userId, vocabularyId, learned = false) => {
    const query = `
        INSERT INTO User_Vocabulary (user_id, vocabulary_id, learned)
        VALUES (?, ?, ?)
    `;
    try {
        const [result] = await knex.raw(query, [userId, vocabularyId, learned]);
        return result;
    } catch (err) {
        console.error('Error adding user vocabulary:', err.message);
        throw new Error('Failed to add user vocabulary');
    }
};

// Function to get all user vocabulary records
const getUserVocabulary = async () => {
    const query = 'SELECT * FROM User_Vocabulary';
    try {
        const [results] = await knex.raw(query);
        return results;
    } catch (err) {
        console.error('Error fetching user vocabulary records:', err.message);
        throw new Error('Failed to fetch user vocabulary records');
    }
};

// Function to get a user vocabulary record by its ID
const getUserVocabularyById = async (userVocabularyId) => {
    const query = 'SELECT * FROM User_Vocabulary WHERE user_vocabulary_id = ?';
    try {
        const [result] = await knex.raw(query, [userVocabularyId]);
        if (result.length === 0) {
            throw new Error('User vocabulary not found');
        }
        return result[0];
    } catch (err) {
        console.error('Error fetching user vocabulary by ID:', err.message);
        throw new Error('Failed to fetch user vocabulary by ID');
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
        const [result] = await knex.raw(query, [learned, userVocabularyId]);
        if (result.affectedRows === 0) {
            throw new Error('No vocabulary record found to update');
        }
        return result;
    } catch (err) {
        console.error('Error updating user vocabulary:', err.message);
        throw new Error('Failed to update user vocabulary');
    }
};

// Function to delete a user vocabulary record
const deleteUserVocabulary = async (userVocabularyId) => {
    const query = 'DELETE FROM User_Vocabulary WHERE user_vocabulary_id = ?';
    try {
        const [result] = await knex.raw(query, [userVocabularyId]);
        if (result.affectedRows === 0) {
            throw new Error('No vocabulary record found to delete');
        }
        return result;
    } catch (err) {
        console.error('Error deleting user vocabulary:', err.message);
        throw new Error('Failed to delete user vocabulary');
    }
};

module.exports = {
    addUserVocabulary,
    getUserVocabulary,
    getUserVocabularyById,
    updateUserVocabulary,
    deleteUserVocabulary
};
