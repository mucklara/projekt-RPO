// Fetch Match The Word Pairs options dynamically
async function fetchOptions(languageCode) {
    try {
        const response = await fetch(`/match-word-pairs/${languageCode}`); // Replace with the correct backend route
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('No game options found for the selected language.');
            } else if (response.status >= 500) {
                throw new Error('Server error. Please try again later.');
            } else {
                throw new Error('Failed to fetch options.');
            }
        }
        const options = await response.json();
        populateOptions(options);
    } catch (error) {
        console.error('Error fetching options:', error);
        displayError(error.message);
    }
}

// Populate the game options dynamically
function populateOptions(options) {
    const optionsGrid = document.querySelector('.game-options-grid');
    optionsGrid.innerHTML = '';

    if (options.length === 0) {
        displayError('No game options available.');
        return;
    }

    options.forEach(option => {
        const card = document.createElement('div');
        card.className = 'game-card';

        const title = document.createElement('h2');
        title.textContent = option.title;

        const description = document.createElement('p');
        description.textContent = option.description;

        const playButton = document.createElement('a');
        playButton.href = option.link;
        playButton.className = 'play-button';
        playButton.textContent = 'PLAY';

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(playButton);

        optionsGrid.appendChild(card);
    });
}

// Display an error message
function displayError(message) {
    const optionsGrid = document.querySelector('.game-options-grid');
    optionsGrid.innerHTML = `<p class="error">${message}</p>`;
}

// Initialize the page
function initializePage() {
    const languageCode = document.body.lang === 'mk' ? 'MKD' : 'SLO';
    fetchOptions(languageCode);
}

// Run on page load
document.addEventListener('DOMContentLoaded', initializePage);
