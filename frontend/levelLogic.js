let selectedLanguage = null;

// Handle language selection
document.querySelectorAll('.language-option').forEach(option => {
    option.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior

        // Remove selection highlight from all options
        document.querySelectorAll('.language-option').forEach(opt => {
            opt.style.backgroundColor = ''; // Reset background color
        });

        // Highlight the selected option
        event.target.style.backgroundColor = 'lightgreen';

        // Update the selected language
        selectedLanguage = event.target.getAttribute('data-language');
    });
});

// Restrict "Play a Game" button functionality
document.getElementById('playQuizButton').addEventListener('click', (event) => {
    if (!selectedLanguage) {
        event.preventDefault(); // Prevent navigation
        const modal = document.getElementById('warningModal');
        modal.style.display = 'block';
    } else {
        if (selectedLanguage === 'SLO') {
            event.target.href = 'ChooseQuizzes_SLO.html';
        } else if (selectedLanguage === 'MKD') {
            event.target.href = 'ChooseQuizzes_MKD.html';
        }
    }
});


// Close the modal when the user clicks the close button
document.querySelector('.close-button').addEventListener('click', () => {
    const modal = document.getElementById('warningModal');
    modal.style.display = 'none';
});

// Close the modal if the user clicks anywhere outside of the modal content
window.addEventListener('click', (event) => {
    const modal = document.getElementById('warningModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Object to store points for each language
let languagePoints = {
    SI: 0, // Slovenian
    MKD: 0 // Macedonian
};

// Function to calculate level based on points
function calculateLevel(points) {
    if (points >= 100) return "C2";
    if (points >= 80) return "C1";
    if (points >= 60) return "B2";
    if (points >= 40) return "B1";
    if (points >= 20) return "A2";
    return "A1";
}

// Function to update the displayed levels and points in the HTML
function updateLanguageTracker() {
    document.querySelector('.tracker-row:nth-child(1) .level-box').textContent = 
        `${calculateLevel(languagePoints.SI)} (${languagePoints.SI} points)`;
    document.querySelector('.tracker-row:nth-child(2) .level-box').textContent = 
        `${calculateLevel(languagePoints.MKD)} (${languagePoints.MKD} points)`;
}

// Function to simulate adding points (will connect to game logic later)
function addPoints(language, points) {
    if (languagePoints.hasOwnProperty(language)) {
        languagePoints[language] += points; // Add points to the language
        updateLanguageTracker(); // Update the tracker display

        // Call backend to update user progress
        fetch('/api/user_progress/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUserId, // Use dynamic user ID
                languageId: language === "SI" ? 1 : 2, // Map language to ID
                points: languagePoints[language],
                level: calculateLevel(languagePoints[language]),
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('User progress updated:', data);
        })
        .catch(error => console.error('Error updating user progress:', error));
    } else {
        console.error("Invalid language code!");
    }
}



// Fetch quiz data and display it
function loadQuizzes(languageId) {
    fetch(`/api/quizzes?languageId=${languageId}`)
        .then(response => response.json())
        .then(data => {
            const quizList = document.getElementById('quizList');
            quizList.innerHTML = '';
            data.forEach(quiz => {
                const quizItem = document.createElement('li');
                quizItem.textContent = quiz.quiz_name;
                quizItem.addEventListener('click', () => loadQuizQuestions(quiz.quiz_id));
                quizList.appendChild(quizItem);
            });
        })
        .catch(error => console.error('Error fetching quizzes:', error));
}


// Fetch and display questions for a specific quiz
function loadQuizQuestions(quizId) {
    fetch(`/api/questions?quizId=${quizId}`)
        .then(response => response.json())
        .then(data => {
            // Display the first question dynamically
            const questionBox = document.getElementById('questionBox');
            const question = data[0]; // Example: Display the first question
            questionBox.textContent = question.question_text;
        })
        .catch(error => console.error('Error fetching questions:', error));
}

// Function to fetch game data based on the game type
async function fetchGameData(gameType, languageId, level) {
    try {
      const response = await fetch(`/api/games/${gameType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language_id: languageId, level: level }),
      });
  
      const data = await response.json();
      if (response.ok) {
        return data; // Use this data to render the game
      } else {
        console.error('Error fetching game data:', data.error);
        return null;
      }
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  }
  
  // Example usage of the fetchGameData function
  async function renderCrossword(languageId, level) {
    const crosswordData = await fetchGameData('crossword', languageId, level);
    if (crosswordData) {
      // Use crosswordData to render the game (update the UI)
      console.log(crosswordData);
    }
  }
  
  // Function to submit answers for a specific game
  async function submitAnswers(gameId, answers, currentUserId) {
    try {
      const response = await fetch('/api/userAnswers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          gameId,
          answers,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        if (result.isCorrect) {
          alert('Correct!');
        } else {
          alert('Try Again!');
        }
      } else {
        console.error('Error submitting answers:', result.error);
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  }
  
  // Example of submitting answers for a game
  async function handleGameSubmission(gameId, userAnswers, currentUserId) {
    const gameData = await submitAnswers(gameId, userAnswers, currentUserId); // Submit answers to get result
    
    if (gameData.isCorrect) {
        const pointsEarned = gameData.points; // Calculate points (adjust based on your logic)
        addPoints("SI", pointsEarned); // Add points to the selected language
        
        // Optionally, send user progress update
        await fetch('/api/user_progress/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUserId,
                languageId: 1, // Assuming language ID for Slovenian
                points: languagePoints.SI,
                level: calculateLevel(languagePoints.SI),
            }),
        });
    } else {
        alert('Incorrect answers, try again!');
    }
}

  


// Initial call to set default levels on page load
updateLanguageTracker();

// Example usage (simulate user earning points)
addPoints("SI", 150); // Slovenian points increase
addPoints("MKD", 300); // Macedonian points increase