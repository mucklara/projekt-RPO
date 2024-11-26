// Create a new user
const db = require('../db'); // Adjust the path if needed

const createUser = async (username, email, password_hash, avatar = null) => {
  try {
    await knex('users').insert({ username, email, password_hash, avatar });
    console.log('User created successfully');
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

// Get all users
const getUsers = async () => {
  try {
    const users = await knex('users').select('*');
    console.log('Users retrieved:', users);
    return users;
  } catch (error) {
    console.error('Error retrieving users:', error);
  }
};

// Get user by ID
const getUserById = async (userId) => {
  try {
    const user = await knex('users').where('user_id', userId).first();
    console.log('User retrieved:', user);
    return user;
  } catch (error) {
    console.error('Error retrieving user:', error);
  }
};

// Update user email
const updateUserEmail = async (userId, newEmail) => {
  try {
    await knex('users').where('user_id', userId).update({ email: newEmail });
    console.log('User email updated successfully');
  } catch (error) {
    console.error('Error updating user email:', error);
  }
};

// Delete user by ID
const deleteUserById = async (userId) => {
  try {
    await knex('users').where('user_id', userId).del();
    console.log('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserEmail,
  deleteUserById
};
