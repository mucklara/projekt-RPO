// Function to fetch crossword questions and populate the grid
async function fetchCrosswordData() {
    try {
        const response = await fetch('/questions');
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('No crossword data found.');
            } else if (response.status >= 500) {
                throw new Error('Server error. Please try again later.');
            } else {
                throw new Error('Failed to fetch crossword data.');
            }
        }
        const { data } = await response.json();
        populateCrossword(data);
    } catch (error) {
        console.error('Error fetching crossword data:', error);
    }
}


function populateCrossword(data) {
    const inputs = document.querySelectorAll(".word-cell input");
    data.forEach((item, index) => {
        if (inputs[index]) {
            inputs[index].setAttribute('data-correct', item.correctAnswer);
        }
    });
}


async function submitUserAnswers() {
    const inputs = document.querySelectorAll(".word-cell input");
    const userAnswers = Array.from(inputs).map(input => ({
        questionId: input.dataset.questionId,
        answerText: input.value,
        isCorrect: input.value.toUpperCase() === input.dataset.correct?.toUpperCase(),
    }));

    try {
        const response = await fetch('/userAnswers/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userAnswers }),
        });

        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('Invalid answer submission.');
            } else if (response.status >= 500) {
                throw new Error('Server error. Please try again later.');
            } else {
                throw new Error('Failed to submit answers.');
            }
        }

        console.log('Answers submitted successfully');
    } catch (error) {
        console.error('Error submitting user answers:', error);
    }
}

// Function to store user progress
async function storeUserProgress(isCorrect) {
    try {
        const response = await fetch('/userProgress/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: 1, // Replace with dynamic userId
                languageId: 1, // Replace with the actual languageId
                level: isCorrect ? 'completed' : 'in-progress',
                points: isCorrect ? 10 : 0,
            }),
        });

        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('Invalid progress submission.');
            } else if (response.status >= 500) {
                throw new Error('Server error. Please try again later.');
            } else {
                throw new Error('Failed to store user progress.');
            }
        }

        console.log('Progress stored successfully');
    } catch (error) {
        console.error('Error storing user progress:', error);
    }
}

// Modified checkAnswers function with backend integration
async function checkAnswers() {
    const inputs = document.querySelectorAll(".word-cell input");
    let isCorrect = true;

    inputs.forEach(input => {
        const correctLetter = input.dataset.correct?.toUpperCase();
        const userLetter = input.value.toUpperCase();

        if (userLetter === correctLetter) {
            input.style.backgroundColor = "lightgreen";
        } else {
            input.style.backgroundColor = "lightcoral";
            isCorrect = false;
        }
    });

    alert(isCorrect ? "The entire crossword is correct!" : "The crossword is incorrect. Please try again.");

    // Submit answers and store progress
    await submitUserAnswers();
    await storeUserProgress(isCorrect);
}

// Fetch crossword data on page load
document.addEventListener('DOMContentLoaded', fetchCrosswordData);

// Add event listener for the "Check Answers" button
document.getElementById("check-answers").addEventListener("click", checkAnswers);
