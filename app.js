const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const knex = require('./setupDatabase');  // Import the knex instance

// Import routes
const userRoutes = require('./routes/userRoutes');
const languageRoutes = require('./routes/languageRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const questionsRoutes = require('./routes/questionsRoutes');
const quizzesRoutes = require('./routes/quizzesRoutes');
const userAnswersRoutes = require('./routes/userAnswersRoutes');
const userVocabularyRoutes = require('./routes/userVocabularyRoutes');
const vocabularyRoutes = require('./routes/vocabularyRoutes');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Use the routes
app.use('/api/users', userRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/user-answers', userAnswersRoutes);
app.use('/api/user-vocabulary', userVocabularyRoutes);
app.use('/api/vocabulary', vocabularyRoutes);

// Set up the port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
