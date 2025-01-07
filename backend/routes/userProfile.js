// routes/userProfile.js
const express = require('express');
const router = express.Router();
const db = require('../setupDatabase'); // Assuming you have a database connection

// Route to get user profile data
app.get('/userProfile', (req, res) => {
    if (!req.user) {  // Assuming you're using middleware that adds `req.user` for authenticated users
        return res.status(401).json({ message: 'Not authenticated' });
    }

    // Send the user's data from the database
    res.json({
        username: req.user.username,
        email: req.user.email,
        avatar: req.user.avatar || 'default.png'
    });
});


module.exports = router;
