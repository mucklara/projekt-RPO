// Create or update leaderboard score
const updateLeaderboard = async (userId, languageId, score) => {
    try {
      await knex('leaderboard').insert({ user_id: userId, language_id: languageId, score }).onConflict(['user_id', 'language_id']).merge();
      console.log('Leaderboard updated successfully');
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  };
  
  // Get leaderboard for a language
  const getLeaderboard = async (languageId) => {
    try {
      const leaderboard = await knex('leaderboard').where('language_id', languageId).orderBy('score', 'desc');
      console.log('Leaderboard retrieved:', leaderboard);
      return leaderboard;
    } catch (error) {
      console.error('Error retrieving leaderboard:', error);
    }
  };
  
  module.exports = {
    updateLeaderboard,
    getLeaderboard
};