CREATE DATABASE LanguageLearning;

USE LanguageLearning;

-- Table for Hangman game
CREATE TABLE HangmanGame (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    word_to_guess VARCHAR(255) NOT NULL,
    hint TEXT
);

-- Table for Connecting Words game
CREATE TABLE ConnectingWordsGame (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sentence_template TEXT NOT NULL, -- Sentence with a blank space
    correct_word VARCHAR(255) NOT NULL,
    word_options TEXT NOT NULL -- Comma-separated word options
);

-- Table for Crossword game
CREATE TABLE CrosswordGame (
    id INT AUTO_INCREMENT PRIMARY KEY,
    crossRow INT NOT NULL,
    crossColummn INT NOT NULL,
    clue TEXT NOT NULL,
    correct_word VARCHAR(255) NOT NULL
);

-- Table for Guess the Meaning game
CREATE TABLE GuessMeaningGame (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    correct_answer VARCHAR(255) NOT NULL
);

-- Table for Match Image to Word game
CREATE TABLE MatchImageToWordGame (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(255) NOT NULL,
    correct_word VARCHAR(255) NOT NULL
);

-- Table for Match Pair game
CREATE TABLE MatchPairGame (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word_english VARCHAR(255) NOT NULL,
    word_translated VARCHAR(255) NOT NULL,
    language VARCHAR(50) NOT NULL -- Language of the translation
);
