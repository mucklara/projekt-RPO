// Create a new quiz
const createQuiz = async (quizTitle, languageId) => {
    try {
      await knex('quizzes').insert({ quiz_title: quizTitle, language_id: languageId });
      console.log('Quiz created successfully');
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };
  
  // Get all quizzes
  const getQuizzes = async () => {
    try {
      const quizzes = await knex('quizzes').select('*');
      console.log('Quizzes retrieved:', quizzes);
      return quizzes;
    } catch (error) {
      console.error('Error retrieving quizzes:', error);
    }
  };
  
  // Get quiz by ID
  const getQuizById = async (quizId) => {
    try {
      const quiz = await knex('quizzes').where('quiz_id', quizId).first();
      console.log('Quiz retrieved:', quiz);
      return quiz;
    } catch (error) {
      console.error('Error retrieving quiz:', error);
    }
  };
  
  // Update quiz title
  const updateQuizTitle = async (quizId, newTitle) => {
    try {
      await knex('quizzes').where('quiz_id', quizId).update({ quiz_title: newTitle });
      console.log('Quiz title updated successfully');
    } catch (error) {
      console.error('Error updating quiz title:', error);
    }
  };
  
  // Delete quiz by ID
  const deleteQuiz = async (quizId) => {
    try {
      await knex('quizzes').where('quiz_id', quizId).del();
      console.log('Quiz deleted successfully');
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };
  
  module.exports = {
    createQuiz,
    getQuizzes,
    getQuizById,
    updateQuizTitle,
    deleteQuiz
};
