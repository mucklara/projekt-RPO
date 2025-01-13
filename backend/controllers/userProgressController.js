const knex = require('../setupDatabase');

// Add user progress
const addProgress = async (userId, languageId, level, points) => {
  try {
    if (!userId || !languageId || !level || points === undefined) {
      throw new Error('Missing required fields: userId, languageId, level, and points are required');
    }
    await knex('user_progress').insert({ user_id: userId, language_id: languageId, level, points });
    //console.log(`Progress added for userId ${userId} and languageId ${languageId}`);
  } catch (error) {
    console.error(`Error adding progress: ${error.message}`);
    throw new Error(`Failed to add progress: ${error.message}`);
  }
};

// Get user progress by user_id and language_id
const getUserProgress = async (userId, languageId) => {
  try {
    if (!userId || !languageId) {
      throw new Error('Both userId and languageId are required');
    }

    const progress = await knex('user_progress')
      .where({ user_id: userId, language_id: languageId })
      .first();
    
    if (!progress) {
      throw new Error(`No progress found for userId ${userId} and languageId ${languageId}`);
    }

    //console.log(`User progress for userId ${userId} and languageId ${languageId} retrieved successfully`);
    return progress;
  } catch (error) {
    console.error(`Error retrieving user progress: ${error.message}`);
    throw new Error(`Failed to retrieve user progress: ${error.message}`);
  }
};

// Function to calculate the user's level based on points
const calculateLevel = (points) => {
  // Example level logic: Adjust as needed
  if (points >= 600) return 'C2';
  if (points >= 500) return 'C1';
  if (points >= 400) return 'B2';
  if (points >= 300) return 'B1';
  if (points >= 200) return 'A2';
  return 'A1';
};

// Update user progress
const updateUserProgress = async (userId, languageId, pointsToAdd) => {
  try {
    // Check if user progress exists
    const userProgress = await knex('user_progress')
      .where({ user_id: userId, language_id: languageId })
      .first();

    if (userProgress) {
      // Increment existing points
      const newPoints = userProgress.points + pointsToAdd;
      const level = calculateLevel(newPoints);

      await knex('user_progress')
        .where({ user_id: userId, language_id: languageId })
        .update({ points: newPoints, level});

      return { points: newPoints, level }; // Return updated points and level
    } else {
      // Insert new progress
      const level = calculateLevel(pointsToAdd);

      await knex('user_progress').insert({
        user_id: userId,
        language_id: languageId,
        points: pointsToAdd,
        level
      });

      return { points: pointsToAdd, level }; // Return the initial points and level
    }
  } catch (error) {
    console.error(`Error updating user progress: ${error.message}`);
    throw new Error(`Failed to update user progress: ${error.message}`);
  }
};

// Delete user progress by user_id and language_id
const deleteProgress = async (userId, languageId) => {
  try {
    if (!userId || !languageId) {
      throw new Error('Both userId and languageId are required');
    }

    const deletedRows = await knex('user_progress')
      .where({ user_id: userId, language_id: languageId })
      .del();

    if (deletedRows === 0) {
      throw new Error(`No progress found to delete for userId ${userId} and languageId ${languageId}`);
    }

    //console.log(`User progress for userId ${userId} and languageId ${languageId} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting user progress: ${error.message}`);
    throw new Error(`Failed to delete user progress: ${error.message}`);
  }
};


module.exports = {
  addProgress,
  getUserProgress,
  updateUserProgress,
  deleteProgress
};
