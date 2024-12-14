const knex = require('../setupDatabase');

// Create a new question
const createQuestion = async (quizId, questionText, options, correctAnswer) => {
    try {
        // Validate inputs
        if (!quizId || isNaN(quizId)) throw new Error('Invalid quiz ID');
        if (!questionText || typeof questionText !== 'string') throw new Error('Invalid question text');
        if (!options || !Array.isArray(options)) throw new Error('Invalid answer options');
        if (correctAnswer === undefined || typeof correctAnswer !== 'string') throw new Error('Invalid correct answer');

        // Insert question into the database
        await knex('questions').insert({
            quiz_id: quizId,
            question_text: questionText,
            options: JSON.stringify(options),
            correct_answer: correctAnswer
        });

        return { success: true, message: 'Question created successfully' };
    } catch (error) {
        console.error('Error creating question:', error.message);
        throw new Error('Failed to create question. Please check the input and try again.');
    }
};

// Get questions by quiz_id
const getQuestionsByQuiz = async (quizId) => {
    try {
        if (!quizId || isNaN(quizId)) throw new Error('Invalid quiz ID');

        const questions = await knex('questions').where('quiz_id', quizId);

        if (questions.length === 0) {
            throw new Error(`No questions found for quiz ID ${quizId}`);
        }

        return { success: true, data: questions };
    } catch (error) {
        console.error('Error retrieving questions:', error.message);
        throw new Error('Failed to retrieve questions. Please try again later.');
    }
};

// Update question by ID
const updateQuestion = async (questionId, newText, newOptions, newCorrectAnswer) => {
    try {
        if (!questionId || isNaN(questionId)) throw new Error('Invalid question ID');
        if (!newText || typeof newText !== 'string') throw new Error('Invalid question text');
        if (!newOptions || !Array.isArray(newOptions)) throw new Error('Invalid answer options');
        if (newCorrectAnswer === undefined || typeof newCorrectAnswer !== 'string') throw new Error('Invalid correct answer');

        const rowsUpdated = await knex('questions')
            .where('question_id', questionId)
            .update({
                question_text: newText,
                options: JSON.stringify(newOptions),
                correct_answer: newCorrectAnswer
            });

        if (rowsUpdated === 0) {
            throw new Error(`No question found with ID ${questionId}`);
        }

        return { success: true, message: 'Question updated successfully' };
    } catch (error) {
        console.error('Error updating question:', error.message);
        throw new Error('Failed to update question. Please check the input and try again.');
    }
};

// Delete question by ID
const deleteQuestion = async (questionId) => {
    try {
        if (!questionId || isNaN(questionId)) throw new Error('Invalid question ID');

        const rowsDeleted = await knex('questions').where('question_id', questionId).del();

        if (rowsDeleted === 0) {
            throw new Error(`No question found with ID ${questionId}`);
        }

        return { success: true, message: 'Question deleted successfully' };
    } catch (error) {
        console.error('Error deleting question:', error.message);
        throw new Error('Failed to delete question. Please try again.');
    }
};

module.exports = {
    createQuestion,
    getQuestionsByQuiz,
    updateQuestion,
    deleteQuestion
};
