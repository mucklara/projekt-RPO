// Fetch game data dynamically based on language ID
async function fetchGameData(languageId) {
    try {
        const response = await fetch(`/vocabulary/${languageId}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('No game data found for the selected language.');
            } else if (response.status >= 500) {
                throw new Error('Server error. Please try again later.');
            } else {
                throw new Error('Failed to fetch game data.');
            }
        }
        const data = await response.json();
        populateGameArea(data);
    } catch (error) {
        console.error('Error fetching game data:', error);
    }
}

// Populate the game area with fetched data
function populateGameArea(data) {
    const imageArea = document.querySelector(".image-area");
    const wordOptions = document.querySelector(".word-options");

    // Populate the image
    imageArea.innerHTML = `<img src="${data.image}" alt="${data.altText}">`;
    imageArea.setAttribute("data-correct", data.correctAnswer);

    // Populate the word options
    wordOptions.innerHTML = '';
    data.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option.text;
        button.setAttribute("data-word", option.word);
        wordOptions.appendChild(button);
    });

    // Reinitialize event listeners
    addAnswerListeners();
}

// Add listeners to buttons for answer selection
function addAnswerListeners() {
    const buttons = document.querySelectorAll(".word-options button");
    const feedback = document.querySelector(".feedback");
    const correctAnswer = document.querySelector(".image-area").dataset.correct;

    buttons.forEach(button => {
        button.addEventListener("click", async () => {
            // Remove previous feedback
            buttons.forEach(btn => btn.classList.remove("correct", "incorrect"));

            // Check if the selected button matches the correct answer
            const isCorrect = button.dataset.word === correctAnswer;
            if (isCorrect) {
                button.classList.add("correct");
                feedback.textContent = "Correct! 🎉";
                feedback.style.color = "#28a745";
                await submitAnswer(true);
            } else {
                button.classList.add("incorrect");
                feedback.textContent = "Incorrect! ❌";
                feedback.style.color = "#dc3545";
                await submitAnswer(false);
            }

            // Disable all buttons after selection
            buttons.forEach(btn => (btn.disabled = true));
        });
    });
}

// Submit user answer to the backend
async function submitAnswer(isCorrect) {
    try {
        const response = await fetch('/userAnswers/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: 1, // Replace with dynamic userId
                questionId: document.querySelector(".image-area").dataset.questionId,
                isCorrect,
            }),
        });

        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('Invalid answer submission.');
            } else if (response.status >= 500) {
                throw new Error('Server error. Please try again later.');
            } else {
                throw new Error('Failed to submit answer.');
            }
        }

        console.log('Answer submitted successfully');
        if (isCorrect) {
            await updateProgress(10); // Example points
        }
    } catch (error) {
        console.error('Error submitting answer:', error);
    }
}

// Update user progress in the backend
async function updateProgress(points) {
    try {
        const response = await fetch('/userProgress/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: 1, // Replace with dynamic userId
                languageId: 1, // Replace with dynamic languageId
                points,
            }),
        });

        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('Invalid progress update request.');
            } else if (response.status >= 500) {
                throw new Error('Server error. Please try again later.');
            } else {
                throw new Error('Failed to update progress.');
            }
        }

        console.log('Progress updated successfully');
    } catch (error) {
        console.error('Error updating progress:', error);
    }
}

// Initialize game on page load
document.addEventListener("DOMContentLoaded", () => {
    const languageId = document.body.lang === "mk" ? 2 : 1;
    fetchGameData(languageId);
});
