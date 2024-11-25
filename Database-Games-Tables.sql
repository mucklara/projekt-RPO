CREATE DATABASE IF NOT EXISTS LanguageLearning;
USE LanguageLearning;

CREATE TABLE IF NOT EXISTS Users (
	user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(250) NOT NULL,
    avatar VARCHAR(255),
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Languages (
    language_id INT AUTO_INCREMENT PRIMARY KEY,
    language_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS User_Progress (
    user_progress_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    language_id INT,
    level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') NOT NULL,
    points INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES Languages(language_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Quizzes (
    quiz_id INT AUTO_INCREMENT PRIMARY KEY,
    language_id INT,
    quiz_name VARCHAR(100) NOT NULL,
    quiz_description TEXT,
    FOREIGN KEY (language_id) REFERENCES Languages(language_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT,
    question_text TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES Quizzes(quiz_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS User_Answers (
    user_answer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    question_id INT,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES Questions(question_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Leaderboard (
    leaderboard_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    language_id INT,
    points INT DEFAULT 0,
    level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES Languages(language_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Vocabulary (
    vocabulary_id INT AUTO_INCREMENT PRIMARY KEY,
    language_id INT,
    word VARCHAR(100) NOT NULL,
    translation VARCHAR(100) NOT NULL,
    hint VARCHAR(255),
    level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') NOT NULL,
    image_url VARCHAR(255),
    FOREIGN KEY (language_id) REFERENCES Languages(language_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS User_Vocabulary (
    user_vocabulary_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    vocabulary_id INT,
    learned BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (vocabulary_id) REFERENCES Vocabulary(vocabulary_id) ON DELETE CASCADE
);
	
DELIMITER $$
DROP PROCEDURE IF EXISTS GetCrosswordVocabulary$$

CREATE PROCEDURE GetCrosswordVocabulary(IN input_language_id INT, IN input_level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2'))
BEGIN
    SELECT *
    FROM Vocabulary
    WHERE hint IS NOT NULL AND hint != ''
      AND language_id = input_language_id
      AND level = input_level;
END$$

DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS GetMatchImageToWordVocabulary$$

CREATE PROCEDURE GetMatchImageToWordVocabulary(IN input_language_id INT, IN input_level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2'))
BEGIN
    SELECT *
    FROM Vocabulary
    WHERE image_url IS NOT NULL AND image_url != ''
      AND language_id = input_language_id
      AND level = input_level;
END$$

DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS GetMatchTwoWordsVocabulary$$

CREATE PROCEDURE GetMatchTwoWordsVocabulary(IN input_language_id INT, IN input_level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2'))
BEGIN
    SELECT word, translation
    FROM Vocabulary
    WHERE language_id = input_language_id
      AND level = input_level;
END$$

DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS GetGuessTheMeaningVocabulary$$

CREATE PROCEDURE GetGuessTheMeaningVocabulary(IN input_language_id INT, IN input_level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2'))
BEGIN
    SELECT word, translation
    FROM Vocabulary
    WHERE language_id = input_language_id
      AND level = input_level;
END$$

DELIMITER ;



