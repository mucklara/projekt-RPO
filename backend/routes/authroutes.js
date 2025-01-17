const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes for authentication
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/check-username', authController.checkUsername);
router.get('/check-email', authController.checkEmail);

module.exports = router;
