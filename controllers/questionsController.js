// Create a new question
const createQuestion = async (quizId, questionText, answerOptions, correctAnswer) => {
    try {
      await knex('questions').insert({ quiz_id: quizId, question_text: questionText, answer_options: answerOptions, correct_answer: correctAnswer });
      console.log('Question created successfully');
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };
  
  // Get questions by quiz_id
  const getQuestionsByQuiz = async (quizId) => {
    try {
      const questions = await knex('questions').where('quiz_id', quizId);
      console.log('Questions retrieved:', questions);
      return questions;
    } catch (error) {
      console.error('Error retrieving questions:', error);
    }
  };
  
  // Update question by ID
  const updateQuestion = async (questionId, newText, newAnswerOptions, newCorrectAnswer) => {
    try {
      await knex('questions').where('question_id', questionId).update({
        question_text: newText,
        answer_options: newAnswerOptions,
        correct_answer: newCorrectAnswer
      });
      console.log('Question updated successfully');
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };
  
  // Delete question by ID
  const deleteQuestion = async (questionId) => {
    try {
      await knex('questions').where('question_id', questionId).del();
      console.log('Question deleted successfully');
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  module.exports = {
    createQuestion,
    getQuestionsByQuiz,
    updateQuestion,
    deleteQuestion
};
  