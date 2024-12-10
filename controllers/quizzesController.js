const knex = require('../setupDatabase');

// Create a new quiz
const createQuiz = async (quizTitle, quizDescription, languageId, questionId) => {
  try {
    // Validate input
    if (!quizTitle || typeof quizTitle !== 'string') {
      throw new Error('Invalid quiz title');
    }
    if (!quizDescription || typeof quizDescription !== 'string') {
      throw new Error('Invalid quiz description');
    }
    if (!languageId || isNaN(languageId)) {
      throw new Error('Invalid language ID');
    }
    if (questionId && isNaN(questionId)) {
      throw new Error('Invalid question ID');
    }

    await knex('quizzes').insert({
      quiz_name: quizTitle,
      quiz_description: quizDescription,
      language_id: languageId,
      question_id: questionId || null // If no question_id is provided, set it to null
    });

    console.log(`Quiz "${quizTitle}" created successfully.`);
    return { success: true, message: 'Quiz created successfully' };
  } catch (error) {
    console.error('Error creating quiz:', error.message);
    throw new Error('Failed to create quiz. Please try again later.');
  }
};


// Get all quizzes
const getQuizzes = async () => {
  try {
    const quizzes = await knex('quizzes').select('*');
    console.log('Quizzes retrieved successfully');
    return { success: true, quizzes };
  } catch (error) {
    console.error('Error retrieving quizzes:', error.message);
    throw new Error('Failed to retrieve quizzes. Please try again later.');
  }
};

// Get quiz by ID
const getQuizById = async (quizId) => {
  try {
    if (!quizId || isNaN(quizId)) {
      throw new Error('Invalid quiz ID');
    }

    const quiz = await knex('quizzes').where('quiz_id', quizId).first();
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    console.log('Quiz retrieved successfully:', quiz);
    return { success: true, quiz };
  } catch (error) {
    console.error('Error retrieving quiz:', error.message);
    throw new Error(error.message || 'Failed to retrieve quiz. Please try again later.');
  }
};

// Update quiz title
const updateQuizTitle = async (quizId, newTitle, newDescription, newLanguageId, newQuestionId) => {
  try {
    // Validate input
    if (!quizId || isNaN(quizId)) {
      throw new Error('Invalid quiz ID');
    }
    if (!newTitle || typeof newTitle !== 'string') {
      throw new Error('Invalid new title');
    }
    if (!newDescription || typeof newDescription !== 'string') {
      throw new Error('Invalid new description');
    }
    if (!newLanguageId || isNaN(newLanguageId)) {
      throw new Error('Invalid new language ID');
    }

    const updatedRows = await knex('quizzes')
      .where('quiz_id', quizId)
      .update({
        quiz_name: newTitle,
        quiz_description: newDescription,
        language_id: newLanguageId,
        question_id: newQuestionId || null // Update the question_id (or set it to null)
      });

    if (updatedRows === 0) {
      throw new Error('Quiz not found or no changes made');
    }

    console.log('Quiz updated successfully');
    return { success: true, message: 'Quiz updated successfully' };
  } catch (error) {
    console.error('Error updating quiz:', error.message);
    throw new Error(error.message || 'Failed to update quiz. Please try again later.');
  }
};


// Delete quiz by ID
const deleteQuiz = async (quizId) => {
  try {
    if (!quizId || isNaN(quizId)) {
      throw new Error('Invalid quiz ID');
    }

    const deletedRows = await knex('quizzes').where('quiz_id', quizId).del();
    if (deletedRows === 0) {
      throw new Error('Quiz not found');
    }

    console.log('Quiz deleted successfully');
    return { success: true, message: 'Quiz deleted successfully' };
  } catch (error) {
    console.error('Error deleting quiz:', error.message);
    throw new Error(error.message || 'Failed to delete quiz. Please try again later.');
  }
};

module.exports = {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuizTitle,
  deleteQuiz
};
