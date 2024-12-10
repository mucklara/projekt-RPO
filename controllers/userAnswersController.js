const knex = require('../setupDatabase');

// Add a new user answer
const addUserAnswer = async (userId, questionId, answerText, isCorrect) => {
  try {
    if (!userId || !questionId || typeof answerText !== 'string' || typeof isCorrect !== 'boolean') {
      throw new Error('Invalid input data');
    }

    const result = await knex('User_Answers').insert({
      user_id: userId,
      question_id: questionId,
      answer_text: answerText,
      is_correct: isCorrect,
    });

    console.log('User answer added successfully');
    return result;
  } catch (error) {
    console.error('Error adding user answer:', error.message);
    throw new Error('Failed to add user answer. Please try again later.');
  }
};

// Get all user answers
const getUserAnswers = async () => {
  try {
    const results = await knex('User_Answers').select('*');
    console.log('User answers retrieved successfully');
    return results;
  } catch (error) {
    console.error('Error fetching user answers:', error.message);
    throw new Error('Failed to retrieve user answers. Please try again later.');
  }
};

// Get a specific user answer by user ID and question ID
const getUserAnswerById = async (userId, questionId) => {
  try {
    if (!userId || !questionId) {
      throw new Error('Invalid input data');
    }

    const result = await knex('User_Answers')
      .where({ user_id: userId, question_id: questionId })
      .first();

    if (!result) {
      throw new Error('User answer not found for the specified question');
    }

    console.log('User answer retrieved successfully');
    return result;
  } catch (error) {
    console.error('Error fetching user answer:', error.message);
    throw new Error(error.message || 'Failed to retrieve user answer. Please try again later.');
  }
};

// Update a user answer by ID
const updateUserAnswer = async (userAnswerId, answerText, isCorrect) => {
  try {
    if (!userAnswerId || !answerText || typeof isCorrect !== 'boolean') {
      throw new Error('Invalid input data');
    }

    const result = await knex('User_Answers')
      .where('user_answer_id', userAnswerId)
      .update({ answer_text: answerText, is_correct: isCorrect });

    if (result === 0) {
      throw new Error('User answer not found or no changes made');
    }

    console.log('User answer updated successfully');
    return result;
  } catch (error) {
    console.error('Error updating user answer:', error.message);
    throw new Error(error.message || 'Failed to update user answer. Please try again later.');
  }
};

// Delete a user answer by ID
const deleteUserAnswer = async (userAnswerId) => {
  try {
    if (!userAnswerId) {
      throw new Error('Invalid user answer ID');
    }

    const result = await knex('User_Answers').where('user_answer_id', userAnswerId).del();

    if (result === 0) {
      throw new Error('User answer not found');
    }

    console.log('User answer deleted successfully');
    return result;
  } catch (error) {
    console.error('Error deleting user answer:', error.message);
    throw new Error(error.message || 'Failed to delete user answer. Please try again later.');
  }
};

module.exports = {
  addUserAnswer,
  getUserAnswers,
  getUserAnswerById,
  updateUserAnswer,
  deleteUserAnswer,
};
