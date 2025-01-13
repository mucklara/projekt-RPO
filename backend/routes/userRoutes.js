const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const knex = require('../setupDatabase'); // Ensure the path is correct for your setup

// Configure multer for file uploads with a size limit of 8MB
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/avatars');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // Unique filename
    }
});

const upload = multer({ storage: storage });

// Serve static files for avatars
router.use('/uploads/avatars', express.static('uploads/avatars'));

// POST route for creating a user
router.post('/create', async (req, res) => {
    const { username, email, passwordHash, avatar } = req.body;

    try {
        await knex('users').insert({
            username,
            email,
            passwordHash,
            avatar
        });
        res.status(201).json({ message: `User ${username} created successfully` });
    } catch (error) {
        console.error(`Error creating user: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// GET route for retrieving a user by ID
router.get('/:userId', async (req, res) => {
    try {
        const user = await knex('users').where({ user_id: req.params.userId }).first();
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Format the registration date (YYYY-MM-DD)
        const formattedDate = new Date(user.registration_date).toISOString().split("T")[0];

        // Construct the user data response
        const userData = {
            username: user.username,
            email: user.email,
            avatar: user.avatar ? `http://${req.get('host')}/uploads/avatars/${user.avatar}` : null,
            registrationDate: formattedDate
        };

        // Send the user data
        res.json(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Error fetching user data' });
    }
});


// Endpoint to get the user's avatar
router.get('/:userId/avatar', async (req, res) => {
    try {
        const user = await knex('users').where({ user_id: req.params.userId }).first();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const avatarPath = user.avatar ? `/uploads/avatars/${user.avatar}` : '/uploads/avatars/default-avatar.png';

        // Set no-cache headers
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');

        res.json({ avatar: avatarPath });
    } catch (error) {
        console.error('Error fetching avatar:', error);
        res.status(500).json({ message: 'Error fetching avatar' });
    }
});


// PUT route for updating a user's avatar
router.put('/:userId/avatar', upload.single('avatar'), async (req, res) => {
    try {
        const user = await knex('users').where({ user_id: req.params.userId }).first();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Handle avatar upload
        if (req.file) {
            // Update the avatar in the database
            await knex('users')
                .where({ user_id: req.params.userId })
                .update({ avatar: req.file.filename });

            // Return the full URL to the uploaded avatar
            const avatarUrl = `http://${req.get('host')}/uploads/avatars/${req.file.filename}`;
            res.json({ avatar: avatarUrl });
        } else {
            res.status(400).json({ message: 'No avatar file uploaded' });
        }
    } catch (error) {
        console.error('Error updating avatar:', error);
        res.status(500).json({ message: 'Error updating avatar' });
    }
});

// Error handling middleware for file size or type errors
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size exceeds 8MB limit.' });
        }
    } else if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
});

router.get("/:userId/details", async (req, res) => {
    try {
        await userController.getUserDetails(req, res); // Call the controller method
    } catch (error) {
        console.error("Error in user details route:", error.message);
        res.status(500).json({ message: "Error fetching user details." });
    }
});

module.exports = router;
