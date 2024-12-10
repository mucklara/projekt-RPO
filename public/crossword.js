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
        const response = await fetch(`data/${theme}.json`); // Load the corresponding JSON file
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

// Function to generate the crossword grid and display hints
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
    const inputs = [];
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
                cell.appendChild(input);
                inputs.push(input);
            } else {
                cell.classList.add('empty');
            }

            container.appendChild(cell);
        }
    }

    // Display hints
    displayHints(words);

    // Add navigation functionality
    addInputNavigation(inputs);

    return grid;
}

// Function to display hints
function displayHints(words) {
    const hintsList = document.getElementById('hints-list');
    hintsList.innerHTML = ''; // Clear previous hints

    words.forEach((wordObj, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${wordObj.hint} (${wordObj.direction === 'horizontal' ? 'Across' : 'Down'})`;
        hintsList.appendChild(listItem);
    });
}

// Function to handle input navigation with Enter and Arrow keys
function addInputNavigation(inputs) {
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === 'ArrowRight') {
                e.preventDefault();
                if (index + 1 < inputs.length) {
                    inputs[index + 1].focus();
                }
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                if (index - 1 >= 0) {
                    inputs[index - 1].focus();
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (index + Math.sqrt(inputs.length) < inputs.length) {
                    inputs[index + Math.sqrt(inputs.length)].focus();
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (index - Math.sqrt(inputs.length) >= 0) {
                    inputs[index - Math.sqrt(inputs.length)].focus();
                }
            }
        });
    });
}

// Function to check answers
function checkAnswers(grid) {
    const inputs = document.querySelectorAll('.word-cell input');
    inputs.forEach(input => {
        const correctLetter = input.dataset.correct.toUpperCase();
        const userLetter = input.value.toUpperCase();

        if (userLetter === correctLetter) {
            input.style.backgroundColor = 'lightgreen'; // Correct answer
        } else {
            input.style.backgroundColor = 'lightcoral'; // Incorrect answer
        }
    });
}

// Main function to load and generate the crossword
(async function () {
    const crosswordData = await loadCrosswordData();
    if (crosswordData) {
        const grid = generateCrossword(crosswordData);

        // Add event listener for checking answers
        document.getElementById('check-answers').addEventListener('click', () => {
            checkAnswers(grid);
        });
    }
})();
