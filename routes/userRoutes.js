const express = require('express');
const router = express.Router();

// Importing functions from the userController.js
const {
    createUser,
    getUsers,
    getUserById,
    updateUserEmail,
    deleteUserById
} = require('../controllers/userController');

// Route for creating a user
router.post('/create', async (req, res) => {
    const { username, email, password_hash, avatar } = req.body;
    await createUser(username, email, password_hash, avatar);
    res.status(201).send('User created successfully');
});

// Route for getting all users
router.get('/', async (req, res) => {
    const users = await getUsers();
    res.status(200).json(users);
});

// Route for getting a user by ID
router.get('/:id', async (req, res) => {
    const user = await getUserById(req.params.id);
    res.status(200).json(user);
});

// Route for updating a user's email
router.put('/:id/email', async (req, res) => {
    const newEmail = req.body.email;
    await updateUserEmail(req.params.id, newEmail);
    res.status(200).send('User email updated successfully');
});

// Route for deleting a user
router.delete('/:id', async (req, res) => {
    await deleteUserById(req.params.id);
    res.status(200).send('User deleted successfully');
});

module.exports = router;
