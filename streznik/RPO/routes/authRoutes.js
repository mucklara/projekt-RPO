const express = require('express');
const db = require('../db'); // Import the database connection
const router = express.Router();

// Route to fetch completed levels for a user
router.get('/completed-levels/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Check if the user exists
        const [user] = await db.query('SELECT * FROM Users WHERE user_id = ?', [userId]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User does not exist.' });
        }

        // Fetch completed levels along with username and language
        const [completedLevels] = await db.query(`
            SELECT u.username, l.language_name, up.level, up.points
            FROM User_Progress up
            JOIN Users u ON up.user_id = u.user_id
            JOIN Languages l ON up.language_id = l.language_id
            WHERE up.user_id = ? AND up.points > 0
        `, [userId]);

        if (completedLevels.length === 0) {
            return res.status(200).json({ message: 'No completed levels found.', completedLevels: [] });
        }

        res.status(200).json({ completedLevels });
    } catch (error) {
        console.error('Error fetching completed levels:', error);
        res.status(500).json({ message: 'Error retrieving data.' });
    }
});

// Route to fetch total points for a user
router.get('/total-points/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Check if the user exists
        const [user] = await db.query('SELECT * FROM Users WHERE user_id = ?', [userId]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User does not exist.' });
        }

        // Fetch total points for the user
        const [totalPoints] = await db.query(`
            SELECT COALESCE(SUM(points), 0) AS total_points
            FROM User_Progress
            WHERE user_id = ?
        `, [userId]);

        res.status(200).json({ totalPoints: totalPoints[0].total_points });
    } catch (error) {
        console.error('Error fetching total points:', error);
        res.status(500).json({ message: 'Error retrieving data.' });
    }
});

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Preveri, če uporabnik že obstaja
        const [existingUser] = await db.query('SELECT * FROM Users WHERE username = ? OR email = ?', [username, email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Username or email already exists.' });
        }

        await db.query('INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, password]);

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Registration failed.', error: error.message });
    }
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Poišči uporabnika v bazi z uporabo `password_hash`
        const [user] = await db.query('SELECT * FROM Users WHERE username = ? AND password_hash = ?', [username, password]);

        if (user.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        res.status(200).json({ message: 'Login successful!', user: user[0] });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Login failed.' });
    }
});



module.exports = router;
