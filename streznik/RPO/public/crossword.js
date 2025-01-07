// Function to load crossword data based on theme
async function loadCrosswordData() {
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get('theme'); // Get theme from URL

    if (!theme) {
        console.error('No theme specified in the URL.');
        document.getElementById('crossword-title').textContent = 'Error: No theme selected.';
        return null;
    }

    try {
        const response = await fetch(`data/${theme}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load data for theme: ${theme}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading crossword data:', error.message);
        document.getElementById('crossword-title').textContent = 'Error loading crossword data.';
        return null;
    }
}

// Function to generate the crossword grid
function generateCrossword(crosswordData) {
    const { title, rows, cols, words } = crosswordData;

    // Set crossword title
    document.getElementById('crossword-title').textContent = title;

    // Create grid
    const container = document.getElementById('crossword-container');
    container.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
    container.style.gridTemplateRows = `repeat(${rows}, 40px)`;
    container.innerHTML = ''; // Clear previous content

    // Create empty grid
    const grid = Array.from({ length: rows }, () => Array(cols).fill(null));

    // Place words in the grid
    words.forEach(({ word, startX, startY, direction }) => {
        for (let i = 0; i < word.length; i++) {
            const x = direction === 'horizontal' ? startX + i : startX;
            const y = direction === 'vertical' ? startY + i : startY;
            grid[y][x] = word[i];
        }
    });

    // Render the grid
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';

            if (grid[y][x]) {
                cell.classList.add('word-cell');
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.dataset.correct = grid[y][x]; // Store the correct letter
                input.placeholder = grid[y][x]; // Show correct letter as a hint
                cell.appendChild(input);
            } else {
                cell.classList.add('empty');
            }

            container.appendChild(cell);
        }
    }

    return { grid, words };
}

// Function to calculate points based on word length
function calculateScore(wordLength) {
    if (wordLength <= 3) return 5;
    if (wordLength <= 6) return 10;
    return 15;
}

// Function to send progress update to the server
async function updateUserProgress(userId, languageId, points) {
    try {
        const response = await fetch('/api/progress/update-user-progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                language_id: languageId,
                points: points,
            }),
        });

        if (!response.ok) {
            console.error('Failed to update progress:', await response.text());
        }
    } catch (error) {
        console.error('Error updating progress:', error.message);
    }
}

// Function to check answers and calculate scores
function checkAnswers(grid, words) {
    const inputs = document.querySelectorAll('.word-cell input');
    const userId = 123; // Replace with actual user ID
    const languageId = 1; // Replace with actual language ID
    let totalScore = 0;

    words.forEach(({ word }) => {
        const wordInputs = Array.from(inputs).filter(
            (input) => input.dataset.correct && word.includes(input.dataset.correct)
        );

        const isCorrect = wordInputs.every((input) => {
            const correctLetter = input.dataset.correct.toUpperCase();
            const userLetter = input.value.toUpperCase();
            return correctLetter === userLetter;
        });

        if (isCorrect) {
            const wordScore = calculateScore(word.length);
            totalScore += wordScore;
        }
    });

    updateUserProgress(userId, languageId, totalScore);

    inputs.forEach((input) => {
        const correctLetter = input.dataset.correct.toUpperCase();
        const userLetter = input.value.toUpperCase();

        if (userLetter === correctLetter) {
            input.style.backgroundColor = 'lightgreen'; // Correct answer
        } else {
            input.style.backgroundColor = 'lightcoral'; // Incorrect answer
        }
    });

    const feedback = document.getElementById('feedback');
    feedback.textContent = `You scored ${totalScore} points!`;
    feedback.style.color = '#28a745';
}

// Main function to load and generate the crossword
(async function () {
    const crosswordData = await loadCrosswordData();
    if (crosswordData) {
        const { grid, words } = generateCrossword(crosswordData);

        // Add event listener for checking answers
        document.getElementById('check-answers').addEventListener('click', () => {
            checkAnswers(grid, words);
        });
    }
})();
