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

async function validateAnswers(gameId, answers) {
  // Retrieve correct answers for the game from the database
  const [rows] = await db.query('CALL GetCorrectAnswers(?)', [gameId]);
  const correctAnswers = rows[0]; // Assuming the stored procedure returns an array of answers

  if (!correctAnswers) {
      throw new Error('Failed to retrieve correct answers');
  }

  // Compare the user’s answers to the correct ones
  return answers.every((answer, index) => answer === correctAnswers[index]);
}


function pointsForGame(gameId) {
  // Assign points based on the gameId (this can be replaced with a DB query if needed)
  const pointsMap = {
      1: 10, // Game ID 1: 10 points
      2: 15, // Game ID 2: 15 points
      3: 20, // Game ID 3: 20 points
  };
  return pointsMap[gameId] || 0; // Default 0 points if gameId is unknown
}

async function updateUserPoints(userId, points) {
  await db.query('CALL UpdateUserPoints(?, ?)', [userId, points]);
}

const userAnswersController = {
  submitAnswers: async (req, res) => {
      const { userId, gameId, answers } = req.body;

      if (!userId || !gameId || !Array.isArray(answers)) {
          return res.status(400).json({ error: 'Invalid request. Missing or incorrect parameters.' });
      }

      try {
          const isCorrect = await validateAnswers(gameId, answers); // Validate the answers

          if (isCorrect) {
              const points = pointsForGame(gameId);
              await updateUserPoints(userId, points); // Update user points if answers are correct
          }

          res.status(200).json({ success: true, isCorrect });
      } catch (err) {
          console.error('Error submitting answers:', err.message);
          res.status(500).json({ error: 'Failed to submit answers' });
      }
  },
};

module.exports = {
  addUserAnswer,
  getUserAnswers,
  getUserAnswerById,
  updateUserAnswer,
  deleteUserAnswer,
  userAnswersController
};
