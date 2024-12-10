const knex = require('../setupDatabase');
/*
const updateLeaderboard = async (userId, newPoints) => {
  try {
      // Validate inputs
      if (!userId || isNaN(userId)) throw new Error('Invalid user ID');
      if (newPoints === undefined || isNaN(newPoints)) throw new Error('Invalid points');

      // Fetch the current points for the user
      const existingRecord = await knex('leaderboard')
          .where({ user_id: userId })
          .first();

      if (!existingRecord) {
          throw new Error(`User with ID ${userId} not found on the leaderboard.`);
      }

      // Update only the points for the user
      await knex('leaderboard')
          .where({ user_id: userId })
          .update({ points: newPoints });

      console.log(`Leaderboard updated: userId=${userId}, points=${newPoints}`);
      return { success: true, message: 'Leaderboard points updated successfully', newPoints };
  } catch (error) {
      console.error('Error updating leaderboard:', error.message);
      throw new Error('Failed to update leaderboard. Please try again.');
  }
};
*/

// Helper function to calculate the level based on points
const calculateLevel = (points) => {
    if (points > 600) {
        return "C2";
    } else if (points > 500) {
        return "C1";
    } else if (points > 400) {
        return "B2";
    } else if (points > 300) {
        return "B1";
    } else if (points > 200) {
        return "A2";
    } else if (points > 100) {
        return "A1";
    } else {
        return "None";
    }
};


// Get leaderboard by language (or all if no language is specified)
const getLeaderboard = async (languageId = null) => {
    try {
        let query = knex('leaderboard');
        if (languageId) {
            query = query.where('language_id', languageId);
        }
        const leaderboard = await query.orderBy('points', 'desc');
        console.log(`Leaderboard retrieved:`, leaderboard);
        return leaderboard;
    } catch (error) {
        console.error('Error retrieving leaderboard:', error.message);
        throw new Error('Failed to retrieve leaderboard. Please try again.');
    }
};

// Add points to the leaderboard
const addpoints = async (userId, languageId, points) => {
    try {
        if (!userId || isNaN(userId)) throw new Error('Invalid user ID');
        if (!languageId || isNaN(languageId)) throw new Error('Invalid language ID');
        if (points === undefined || isNaN(points)) throw new Error('Invalid points');

        // Add the new entry with calculated level
        const level = calculateLevel(points);
        await knex('leaderboard').insert({ user_id: userId, language_id: languageId, points, level });
        console.log(`Points added: userId=${userId}, languageId=${languageId}, points=${points}, level=${level}`);
        return { success: true, message: 'Points added successfully' };
    } catch (error) {
        console.error('Error adding points:', error.message);
        throw new Error('Failed to add points. Please try again.');
    }
};

// Update points and level for a user
const updateLeaderboard = async (userId, languageId, newPoints) => {
    try {
        if (!userId || isNaN(userId)) throw new Error('Invalid user ID');
        if (!languageId || isNaN(languageId)) throw new Error('Invalid language ID');
        if (newPoints === undefined || isNaN(newPoints)) throw new Error('Invalid points');

        // Get the current record for the user and language
        const existingRecord = await knex('leaderboard')
            .where({ user_id: userId, language_id: languageId })
            .first();

        if (!existingRecord) {
            throw new Error(`User with ID ${userId} not found for language ID ${languageId}.`);
        }

        // Calculate the new level based on points
        const newLevel = calculateLevel(newPoints);

        // Update points and level in the database
        await knex('leaderboard')
            .where({ user_id: userId, language_id: languageId })
            .update({ points: newPoints, level: newLevel });

        console.log(`Leaderboard updated: userId=${userId}, points=${newPoints}, level=${newLevel}`);
        return { success: true, message: 'Leaderboard points and level updated successfully', newPoints, newLevel };
    } catch (error) {
        console.error('Error updating leaderboard:', error.message);
        throw new Error('Failed to update leaderboard. Please try again.');
    }
};

// Delete points for a user and language
const deletepoints = async (userId, languageId) => {
    try {
        if (!userId || isNaN(userId)) throw new Error('Invalid user ID');
        if (!languageId || isNaN(languageId)) throw new Error('Invalid language ID');

        const deleted = await knex('leaderboard')
            .where({ user_id: userId, language_id: languageId })
            .del();

        if (deleted) {
            console.log(`Points deleted: userId=${userId}, languageId=${languageId}`);
            return { success: true, message: 'Points deleted successfully' };
        } else {
            throw new Error('Points not found or already deleted');
        }
    } catch (error) {
        console.error('Error deleting points:', error.message);
        throw new Error('Failed to delete points. Please try again.');
    }
};

module.exports = {
    updateLeaderboard,
    getLeaderboard,
    addpoints,
    deletepoints
};
