const knex = require('../setupDatabase'); // Adjust the path as necessary

const createUser = async (username, email, passwordHash, avatar = null) => {
  try {
    if (!username || !email || !passwordHash) {
      throw new Error('Missing required fields: username, email, and password hash are mandatory');
    }

    await knex('users').insert({ username, email, password_hash: passwordHash, avatar });
    console.info(`User "${username}" created successfully.`);
  } catch (error) {
    console.error(`Failed to create user: ${error.message}`);
    throw new Error(`Error while creating user: ${error.message}`);
  }
};

const getUsers = async () => {
  try {
    const users = await knex('users').select('*');
    console.info('Users retrieved successfully.');
    return users;
  } catch (error) {
    console.error(`Failed to retrieve users: ${error.message}`);
    throw new Error(`Error while retrieving users: ${error.message}`);
  }
};

const getUserById = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required.');
    }

    const user = await knex('users').where('user_id', userId).first();
    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    console.info(`User with ID ${userId} retrieved successfully.`);
    return user;
  } catch (error) {
    console.error(`Failed to retrieve user with ID ${userId}: ${error.message}`);
    throw new Error(`Error while retrieving user with ID ${userId}: ${error.message}`);
  }
};

const updateUserEmail = async (userId, newEmail) => {
  try {
    if (!userId || !newEmail) {
      throw new Error('User ID and new email are required.');
    }

    const updatedRows = await knex('users').where('user_id', userId).update({ email: newEmail });
    if (updatedRows === 0) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    console.info(`Email for user with ID ${userId} updated to "${newEmail}".`);
  } catch (error) {
    console.error(`Failed to update email for user with ID ${userId}: ${error.message}`);
    throw new Error(`Error while updating email for user with ID ${userId}: ${error.message}`);
  }
};

const deleteUserById = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required.');
    }

    const deletedRows = await knex('users').where('user_id', userId).del();
    if (deletedRows === 0) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    console.info(`User with ID ${userId} deleted successfully.`);
  } catch (error) {
    console.error(`Failed to delete user with ID ${userId}: ${error.message}`);
    throw new Error(`Error while deleting user with ID ${userId}: ${error.message}`);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserEmail,
  deleteUserById,
};
