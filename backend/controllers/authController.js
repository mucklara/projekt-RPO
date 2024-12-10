const bcrypt = require('bcrypt');
const knex = require('../setupDatabase'); // Import your knex instance

// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, email, password, avatar } = req.body;

        // Check if the username or email already exists
        const existingUser = await knex('users')
            .where('username', username)
            .orWhere('email', email)
            .first();

        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const newUser = await knex('users').insert({
            username,
            email,
            password_hash: passwordHash,
            avatar: avatar || null, // Optional avatar
        });

        res.status(201).json({ message: 'User registered successfully', userId: newUser[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login an existing user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await knex('users').where({ email }).first();
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Return user data (excluding password_hash for security)
        const { user_id, username, avatar, registration_date } = user;
        res.status(200).json({
            message: 'Login successful',
            user: { user_id, username, email, avatar, registration_date },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
