// Fetch pairs of words for the game
async function fetchGameData(languageId) {
    try {
        const response = await fetch(`/vocabulary/${languageId}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('No word pairs found for the selected language.');
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

// Populate the game area with dynamic data
function populateGameArea(data) {
    const leftColumn = document.querySelector(".left-column .word-buttons");
    const rightColumn = document.querySelector(".right-column .word-buttons");

    leftColumn.innerHTML = '';
    rightColumn.innerHTML = '';

    data.leftWords.forEach(word => {
        const button = document.createElement("button");
        button.textContent = word.text;
        button.setAttribute("data-pair", word.pair);
        leftColumn.appendChild(button);
    });

    data.rightWords.forEach(word => {
        const button = document.createElement("button");
        button.textContent = word.text;
        button.setAttribute("data-pair", word.pair);
        rightColumn.appendChild(button);
    });

    // Reinitialize event listeners
    addAnswerListeners();
}

// Add listeners for matching words
function addAnswerListeners() {
    const leftButtons = document.querySelectorAll(".left-column button");
    const rightButtons = document.querySelectorAll(".right-column button");
    const feedback = document.getElementById("feedback");
    let selectedLeft = null;

    leftButtons.forEach(leftButton => {
        leftButton.addEventListener("click", () => {
            leftButtons.forEach(btn => btn.classList.remove("selected"));
            leftButton.classList.add("selected");
            selectedLeft = leftButton;
        });
    });

    rightButtons.forEach(rightButton => {
        rightButton.addEventListener("click", async () => {
            if (selectedLeft) {
                const leftPair = selectedLeft.dataset.pair;
                const rightPair = rightButton.dataset.pair;

                if (leftPair === rightPair) {
                    rightButton.classList.add("correct");
                    feedback.textContent = "Correct! 🎉";
                    feedback.style.color = "#28a745";
                    await submitAnswer(true);
                } else {
                    rightButton.classList.add("incorrect");
                    feedback.textContent = "Incorrect! ❌";
                    feedback.style.color = "#dc3545";
                    await submitAnswer(false);
                }

                selectedLeft.classList.remove("selected");
                selectedLeft = null;
            } else {
                feedback.textContent = "Please select a word on the left first!";
                feedback.style.color = "#ffc107";
            }
        });
    });
}


async function submitAnswer(isCorrect) {
    try {
        const response = await fetch('/userAnswers/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: 1, // Replace with dynamic userId
                questionId: document.querySelector(".game-area").dataset.questionId,
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
                userId: 1, //Zamenjaj z dinamicnim id
                languageId: 1, // isto kot gor
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
