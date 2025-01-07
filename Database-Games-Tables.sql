CREATE DATABASE IF NOT EXISTS Learning;
USE Learning;

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
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE
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

-- C2: Najpreprostejše besede
INSERT INTO vocabulary (language_id, word, translation, hint, level, image_url) VALUES
(1, "cat", "mačka", "A small domesticated carnivorous mammal", 'C2', "https://plus.unsplash.com/premium_vector-1719015253440-ccedd0c117c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2F0fGVufDB8fDB8fHww"),
(1, "dog", "pes", "A loyal animal often referred to as 'man's best friend'", 'C2', "https://plus.unsplash.com/premium_vector-1721985703466-0e6a7f83486a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
(1, "car", "avtomobil", "A personal vehicle with a motor and 4 wheels", 'C2', "https://plus.unsplash.com/premium_vector-1716901215342-3deb40b7bff1?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
(1, "tree", "drevo", "A large plant with a trunk, branches, and leaves", 'C2', "https://plus.unsplash.com/premium_vector-1712595407962-3aea2fd58d7a?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
(1, "book", "knjiga", "A collection of written pages bound together", 'C2', "https://plus.unsplash.com/premium_vector-1727952231396-e301fbf4ef1b?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
(1, "apple", "jabolko", "A sweet fruit commonly red, green, or yellow", 'C2', "https://plus.unsplash.com/premium_vector-1722200084794-9155e6c2a1c7?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
(1, "water", "voda", "A liquid necessary for life", 'C2', "https://plus.unsplash.com/premium_vector-1727952230707-372d1ba06834?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
(1, "sun", "sonce", "The star at the center of our solar system", 'C2', "https://plus.unsplash.com/premium_vector-1721868095856-175a62efa32d?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
(1, "house", "hiša", "A building for living in", 'C2', "https://plus.unsplash.com/premium_vector-1721890983105-625c0d32045f?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
(1, "chair", "stol", "A piece of furniture for sitting", 'C2', "https://plus.unsplash.com/premium_vector-1731582098043-7a66bf935b2e?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");

-- C1: Enostavne besede
INSERT INTO vocabulary (language_id, word, translation, hint, level, image_url) VALUES
(1, "bicycle", "kolo", "A two-wheeled vehicle powered by pedaling", 'C1', "https://plus.unsplash.com/premium_vector-1728574627795-6c36b0bd6f5a?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
(1, "river", "reka", "A large natural stream of water flowing to the sea", 'C1', "https://plus.unsplash.com/premium_vector-1709416733845-b520a08cc17a?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
(1, "mountain", "gora", "A large natural elevation of the Earth's surface", 'C1', "https://plus.unsplash.com/premium_vector-1697729787260-d9653992cef3?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
(1, "window", "okno", "An opening in a wall or door to let in light", 'C1', "https://plus.unsplash.com/premium_vector-1714646900322-18a763aacb7d?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
(1, "kitchen", "kuhinja", "A room used for cooking food", 'C1', "https://plus.unsplash.com/premium_vector-1724599568531-d631bd24408a?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
(1, "friend", "prijatelj", "A person whom one knows and with whom one has a bond", 'C1', "https://plus.unsplash.com/premium_vector-1712750956909-4476b1c40cc5?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
(1, "garden", "vrt", "An area of land used for growing plants and flowers", 'C1', "https://plus.unsplash.com/premium_vector-1682303433900-6d0bdbdd2e0b?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
(1, "bread", "kruh", "A staple food made of flour, water, and yeast", 'C1', "https://plus.unsplash.com/premium_vector-1731665821207-980af3cada6b?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
(1, "clock", "ura", "A device used to tell time", 'C1', "https://plus.unsplash.com/premium_vector-1727953895788-4d2132a9c503?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
(1, "phone", "telefon", "A device used for communication", 'C1', "https://plus.unsplash.com/premium_vector-1721296174065-171be100c680?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");

-- B2: Zmerno zahtevne besede
INSERT INTO vocabulary (language_id, word, translation, hint, level, image_url) VALUES
(1, "bridge", "most", "A structure built to span a physical obstacle", 'B2', ""),
(1, "engine", "motor", "A machine that converts energy into mechanical force", 'B2', ""),
(1, "pencil", "svinčnik", "A tool for writing or drawing, made of wood and graphite", 'B2', ""),
(1, "painting", "slika", "A picture made using paint", 'B2', ""),
(1, "language", "jezik", "A system of communication used by a particular community", 'B2', ""),
(1, "desert", "puščava", "A barren area of land with little precipitation", 'B2', ""),
(1, "planet", "planet", "A celestial body orbiting a star", 'B2', ""),
(1, "shadow", "senca", "A dark area created when light is blocked", 'B2', ""),
(1, "island", "otok", "A piece of land surrounded by water", 'B2', ""),
(1, "ladder", "lestev", "A tool used to climb up and down", 'B2', "");

-- B1: Zahtevnejše besede
INSERT INTO vocabulary (language_id, word, translation, hint, level, image_url) VALUES
(1, "architect", "arhitekt", "A person who designs buildings", 'B1', ""),
(1, "philosophy", "filozofija", "The study of fundamental nature of knowledge and existence", 'B1', ""),
(1, "strategy", "strategija", "A plan of action to achieve a goal", 'B1', ""),
(1, "photography", "fotografija", "The art or practice of taking and processing photographs", 'B1', ""),
(1, "biology", "biologija", "The scientific study of life and living organisms", 'B1', ""),
(1, "astronomy", "astronomija", "The study of celestial objects and the universe", 'B1', ""),
(1, "mechanism", "mehanizem", "A system of parts working together in a machine", 'B1', ""),
(1, "sculpture", "kiparstvo", "The art of making three-dimensional figures", 'B1', ""),
(1, "electricity", "elektrika", "A form of energy resulting from charged particles", 'B1', ""),
(1, "geography", "geografija", "The study of Earth's landscapes, people, and places", 'B1', "");

-- A2: Zelo zahtevne besede
INSERT INTO vocabulary (language_id, word, translation, hint, level, image_url) VALUES
(1, "thermodynamics", "termodinamika", "The branch of physics concerned with heat and temperature", 'A2', ""),
(1, "microbiology", "mikrobiologija", "The study of microscopic organisms", 'A2', ""),
(1, "electromagnetism", "elektromagnetizem", "The interaction of electric currents and magnetic fields", 'A2', ""),
(1, "quantum", "kvant", "The smallest amount of a physical quantity", 'A2', ""),
(1, "metamorphosis", "metamorfoza", "The process of transformation in insects or amphibians", 'A2', ""),
(1, "biochemistry", "biokemija", "The study of chemical processes in living organisms", 'A2', ""),
(1, "parallelogram", "paralelogram", "A four-sided shape with opposite sides parallel", 'A2', ""),
(1, "photosynthesis", "fotosinteza", "The process by which plants make their food using sunlight", 'A2', ""),
(1, "oxidation", "oksidacija", "A chemical reaction involving the loss of electrons", 'A2', ""),
(1, "chromosome", "kromosom", "A thread-like structure carrying genetic information", 'A2', "");

-- A1: Najbolj zahtevne besede
INSERT INTO vocabulary (language_id, word, translation, hint, level, image_url) VALUES
(1, "epistemology", "epistemologija", "The study of knowledge and justified belief", 'A1', ""),
(1, "anthropomorphism", "antropomorfizem", "Attributing human characteristics to non-human entities", 'A1', ""),
(1, "existentialism", "eksistencializem", "A philosophical theory focusing on free will and existence", 'A1', ""),
(1, "synecdoche", "sinegdoha", "A figure of speech where a part represents the whole", 'A1', ""),
(1, "onomatopoeia", "onomatopeja", "A word that imitates the sound it represents", 'A1', ""),
(1, "hermeneutics", "hermenevtika", "The study of interpretation, especially of texts", 'A1', ""),
(1, "dialectics", "dialektika", "The art of investigating or discussing the truth of opinions", 'A1', ""),
(1, "phenomenology", "fenomenologija", "The philosophical study of the structures of experience", 'A1', ""),
(1, "semiotics", "semiotika", "The study of signs and symbols", 'A1', ""),
(1, "nihilism", "nihilizem", "The rejection of all religious and moral principles", 'A1', "");

select *  from vocabulary;

CALL GetMatchImageToWordVocabulary(1, 'C2');

