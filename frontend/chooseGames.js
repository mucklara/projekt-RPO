// Fetch available games dynamically
async function fetchGames(languageCode) {
    try {
        const response = await fetch(`/games/${languageCode}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('No games found for the selected language.');
            } else if (response.status >= 500) {
                throw new Error('Server error. Please try again later.');
            } else {
                throw new Error('Failed to fetch games. Please try again.');
            }
        }
        const games = await response.json();
        populateGames(games);
    } catch (error) {
        console.error('Error fetching games:', error);
        displayError(error.message);
    }
}

// Populate the game options dynamically
function populateGames(games) {
    const gameOptionsGrid = document.querySelector('.game-options-grid');
    gameOptionsGrid.innerHTML = '';

    if (games.length === 0) {
        displayError('No games available.');
        return;
    }

    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';

        const textDiv = document.createElement('div');
        textDiv.className = 'text';

        const title = document.createElement('h2');
        title.textContent = game.title;

        const description = document.createElement('p');
        description.textContent = game.description;

        const image = document.createElement('img');
        image.src = game.image;
        image.alt = `${game.title} Game`;

        const playButton = document.createElement('a');
        playButton.href = game.link;
        playButton.className = 'play-button';
        playButton.textContent = 'PLAY';

        textDiv.appendChild(title);
        textDiv.appendChild(description);
        card.appendChild(textDiv);
        card.appendChild(image);
        card.appendChild(playButton);

        gameOptionsGrid.appendChild(card);
    });
}

// Display an error message
function displayError(message) {
    const gameOptionsGrid = document.querySelector('.game-options-grid');
    gameOptionsGrid.innerHTML = `<p class="error">${message}</p>`;
}

// Initialize the page
function initializePage() {
    const languageCode = document.body.lang === 'mk' ? 'MKD' : 'SLO';
    fetchGames(languageCode);
}

// Run on page load
document.addEventListener('DOMContentLoaded', initializePage);