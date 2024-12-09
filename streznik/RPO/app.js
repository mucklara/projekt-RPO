const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes'); // Import routes
const app = express();

// Middleware for processing JSON requests
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Use authentication routes
app.use('/api/auth', authRoutes);

// Default route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Path for the crossword page
app.get('/crossword', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'crossword', 'crossword.html'));
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send('Stran ni najdena.');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Strežnik deluje na http://localhost:${PORT}`);
});
