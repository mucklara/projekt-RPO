const express = require('express');
const router = express.Router();
const db = require('../db'); // Uvoz povezave z bazo podatkov

// API za posodobitev uporabniškega napredka
router.post('/update-user-progress', async (req, res) => {
    const { user_id, language_id, points } = req.body;

    // Validacija vhodnih podatkov
    if (!user_id || !language_id || typeof points !== 'number') {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
        // Začetek transakcije
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Preveri, ali zapis že obstaja
            const [rows] = await connection.query(
                'SELECT points FROM user_progress WHERE user_id = ? AND language_id = ?',
                [user_id, language_id]
            );

            if (rows.length > 0) {
                // Če obstaja, posodobi točke
                await connection.query(
                    'UPDATE user_progress SET points = points + ? WHERE user_id = ? AND language_id = ?',
                    [points, user_id, language_id]
                );
            } else {
                // Če ne obstaja, vstavi nov zapis
                await connection.query(
                    'INSERT INTO user_progress (user_id, language_id, points) VALUES (?, ?, ?)',
                    [user_id, language_id, points]
                );
            }

            await connection.commit();
            res.status(200).json({ message: 'User progress updated successfully!' });
        } catch (err) {
            await connection.rollback();
            console.error('Error during transaction:', err.message);
            res.status(500).json({ error: 'Failed to update user progress' });
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error('Database connection error:', err.message);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
