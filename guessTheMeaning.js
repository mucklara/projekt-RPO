async function fetchGameData(languageId) {
    try {
        const response = await fetch(`/vocabulary/${languageId}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Game data not found for the selected language.');
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

function populateGameArea(data) {
    const leftWord = document.getElementById("word-left");
    const rightList = document.getElementById("right-list");

 
    leftWord.textContent = data.word;
    leftWord.setAttribute('data-pair', data.correctPair);

    
    rightList.innerHTML = '';
    data.options.forEach(option => {
        const li = document.createElement('li');
        li.textContent = option.text;
        li.setAttribute('data-pair', option.pair);
        rightList.appendChild(li);
    });

    addAnswerListeners();
}


function addAnswerListeners() {
    const leftWord = document.getElementById("word-left");
    const rightItems = document.querySelectorAll("#right-list li");
    const feedback = document.getElementById("feedback");

    rightItems.forEach(item => {
        item.addEventListener("click", async () => {
            // Remove previous styles
            rightItems.forEach(i => i.classList.remove("correct", "incorrect"));

            // Check if the pair matches
            const isCorrect = item.dataset.pair === leftWord.dataset.pair;
            if (isCorrect) {
                item.classList.add("correct");
                feedback.textContent = "Correct! 🎉";
                feedback.style.color = "#28a745";
                await submitAnswer(true);
            } else {
                item.classList.add("incorrect");
                feedback.textContent = "Wrong! Try again. ❌";
                feedback.style.color = "#dc3545";
                await submitAnswer(false);
            }
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
                questionId: document.getElementById("word-left").dataset.questionId,
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
