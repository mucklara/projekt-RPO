// Create user progress
const createUserProgress = async (userId, languageId, level, points) => {
    try {
      await knex('user_progress').insert({ user_id: userId, language_id: languageId, level, points });
      console.log('User progress created successfully');
    } catch (error) {
      console.error('Error creating user progress:', error);
    }
  };
  
  // Get user progress by user_id and language_id
  const getUserProgress = async (userId, languageId) => {
    try {
      const progress = await knex('user_progress').where({ user_id: userId, language_id: languageId }).first();
      console.log('User progress retrieved:', progress);
      return progress;
    } catch (error) {
      console.error('Error retrieving user progress:', error);
    }
  };
  
  // Update user progress (e.g., update points)
  const updateUserProgress = async (userId, languageId, points) => {
    try {
      await knex('user_progress').where({ user_id: userId, language_id: languageId }).update({ points });
      console.log('User progress updated successfully');
    } catch (error) {
      console.error('Error updating user progress:', error);
    }
  };
  
  // Delete user progress by user_id and language_id
  const deleteUserProgress = async (userId, languageId) => {
    try {
      await knex('user_progress').where({ user_id: userId, language_id: languageId }).del();
      console.log('User progress deleted successfully');
    } catch (error) {
      console.error('Error deleting user progress:', error);
    }
  };
  
  module.exports = {
    createUserProgress,
    getUserProgress,
    updateUserProgress,
    deleteUserProgress
};