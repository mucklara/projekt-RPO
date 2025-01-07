const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Define routes and link to the controller
router.post('/games', gameController.getGames);
router.post('/crossword', gameController.getCrossword);
router.post('/matchtheimage', gameController.getMatchImage);
router.post('/matchtwowords', gameController.getMatchTwoWords);
router.post('/guessthemeaning', gameController.getGuessTheMeaning);

module.exports = router;
