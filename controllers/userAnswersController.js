const db = require('../db'); // Assuming you have a db.js that exports the database connection

// Function to add a new user answer
const addUserAnswer = async (userId, questionId, answerText, isCorrect) => {
    const query = `
        INSERT INTO User_Answers (user_id, question_id, answer_text, is_correct)
        VALUES (?, ?, ?, ?)
    `;
    try {
        const [result] = await db.execute(query, [userId, questionId, answerText, isCorrect]);
        return result;
    } catch (err) {
        console.error('Error adding user answer:', err);
        throw err;
    }
};

// Function to get all user answers
const getUserAnswers = async () => {
    const query = 'SELECT * FROM User_Answers';
    try {
        const [results] = await db.execute(query);
        return results;
    } catch (err) {
        console.error('Error fetching user answers:', err);
        throw err;
    }
};

// Function to get a user answer by its ID
const getUserAnswerById = async (userAnswerId) => {
    const query = 'SELECT * FROM User_Answers WHERE user_answer_id = ?';
    try {
        const [result] = await db.execute(query, [userAnswerId]);
        return result[0];
    } catch (err) {
        console.error('Error fetching user answer:', err);
        throw err;
    }
};

// Function to update a user answer
const updateUserAnswer = async (userAnswerId, newAnswerText, isCorrect) => {
    const query = `
        UPDATE User_Answers 
        SET answer_text = ?, is_correct = ? 
        WHERE user_answer_id = ?
    `;
    try {
        const [result] = await db.execute(query, [newAnswerText, isCorrect, userAnswerId]);
        return result;
    } catch (err) {
        console.error('Error updating user answer:', err);
        throw err;
    }
};

// Function to delete a user answer
const deleteUserAnswer = async (userAnswerId) => {
    const query = 'DELETE FROM User_Answers WHERE user_answer_id = ?';
    try {
        const [result] = await db.execute(query, [userAnswerId]);
        return result;
    } catch (err) {
        console.error('Error deleting user answer:', err);
        throw err;
    }
};

module.exports = {
    addUserAnswer,
    getUserAnswers,
    getUserAnswerById,
    updateUserAnswer,
    deleteUserAnswer
};
