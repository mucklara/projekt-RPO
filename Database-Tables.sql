CREATE DATABASE LanguageLearning;
USE LanguageLearning;

CREATE TABLE Users (
	user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(250) NOT NULL,
    avatar VARCHAR(255),
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Languages (
    language_id INT AUTO_INCREMENT PRIMARY KEY,
    language_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE User_Progress (
    user_progress_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    language_id INT,
    level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') NOT NULL,
    points INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES Languages(language_id) ON DELETE CASCADE
);

CREATE TABLE Quizzes (
    quiz_id INT AUTO_INCREMENT PRIMARY KEY,
    language_id INT,
    quiz_name VARCHAR(100) NOT NULL,
    quiz_description TEXT,
    FOREIGN KEY (language_id) REFERENCES Languages(language_id) ON DELETE CASCADE
);

CREATE TABLE Questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT,
    question_text TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES Quizzes(quiz_id) ON DELETE CASCADE
);

CREATE TABLE User_Answers (
    user_answer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    question_id INT,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES Questions(question_id) ON DELETE CASCADE
);

CREATE TABLE Games (
    game_id INT AUTO_INCREMENT PRIMARY KEY,
    game_name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE User_Games (
    user_game_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    game_id INT,
    score INT DEFAULT 0,
    level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') NOT NULL,
    played_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES Games(game_id) ON DELETE CASCADE
);

CREATE TABLE Leaderboard (
    leaderboard_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    language_id INT,
    points INT DEFAULT 0,
    level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES Languages(language_id) ON DELETE CASCADE
);

CREATE TABLE Vocabulary (
    vocabulary_id INT AUTO_INCREMENT PRIMARY KEY,
    language_id INT,
    word VARCHAR(100) NOT NULL,
    translation VARCHAR(100) NOT NULL,
    FOREIGN KEY (language_id) REFERENCES Languages(language_id) ON DELETE CASCADE
);

CREATE TABLE User_Vocabulary (
    user_vocabulary_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    vocabulary_id INT,
    learned BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (vocabulary_id) REFERENCES Vocabulary(vocabulary_id) ON DELETE CASCADE
);

