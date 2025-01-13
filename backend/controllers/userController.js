const knex = require('../setupDatabase'); // Adjust the path as necessary
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '..', 'uploads', 'avatars');

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toISOString().split("T")[0]; // Extract only the date part (YYYY-MM-DD)
};

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const updateUserAvatar = async (userId, avatar) => {
  try {
    if (!userId || !avatar) {
      throw new Error('User ID and avatar are required.');
    }

    const updatedRows = await knex('users')
      .where('user_id', userId)  // Ensure correct column name
      .update({ avatar });
    if (updatedRows === 0) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    console.info(`Avatar for user with ID ${userId} updated successfully.`);
  } catch (error) {
    console.error(`Failed to update avatar for user with ID ${userId}: ${error.message}`);
    throw new Error(`Error while updating avatar for user with ID ${userId}: ${error.message}`);
  }
};

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

const getUserDetails = async (req, res) => {
  try {
      const userId = req.params.userId; // Extract user ID from request parameters

      // Fetch user details from the database
      const user = await knex("users")
          .select("email", "registration_date")
          .where({ user_id: userId })
          .first();

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Format the registration date
      const formattedDate = formatDate(user.registration_date);

      // Respond with the user details
      res.status(200).json({
          email: user.email,
          registrationDate: formattedDate,
      });
  } catch (error) {
      console.error("Error fetching user details:", error.message);
      res.status(500).json({ message: "Server error. Please try again later." });
  }
};


module.exports = {
  createUser,
  updateUserAvatar,
  getUserDetails,
};
