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
document.getElementById('playGameButton').addEventListener('click', (event) => {
    if (!selectedLanguage) {
        event.preventDefault(); // Prevent navigation

        // Show the warning modal
        const modal = document.getElementById('warningModal');
        modal.style.display = 'block';
    } else {
        // Redirect to the appropriate page based on the selected language
        if (selectedLanguage === 'SLO') {
            event.target.href = 'ChooseGames_SLO.html';
        } else if (selectedLanguage === 'MKD') {
            event.target.href = 'ChooseGames_MKD.html';
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
    if (points > 600) {
        return "C2";
    } else if (points > 500) {
        return "C1";
    } else if (points > 400) {
        return "B2";
    } else if (points > 300) {
        return "B1";
    } else if (points > 200) {
        return "A2";
    } else if (points > 100) {
        return "A1";
    } else {
        return "None";
    }
}

// Function to update the displayed levels and points in the HTML
function updateLanguageTracker() {
    // Get the tracker rows
    const siLevelBox = document.querySelector('.tracker-row:nth-child(1) .level-box');
    const mkdLevelBox = document.querySelector('.tracker-row:nth-child(2) .level-box');

    // Update the levels and points based on the current points
    siLevelBox.textContent = `${calculateLevel(languagePoints.SI)} (${languagePoints.SI} points)`;
    mkdLevelBox.textContent = `${calculateLevel(languagePoints.MKD)} (${languagePoints.MKD} points)`;
}

// Function to simulate adding points (will connect to game logic later)
function addPoints(language, points) {
    if (languagePoints.hasOwnProperty(language)) {
        languagePoints[language] += points; // Add points to the language
        updateLanguageTracker(); // Update the tracker display
    } else {
        console.error("Invalid language code!");
    }
}

// Initial call to set default levels on page load
updateLanguageTracker();

// Example usage (simulate user earning points)
addPoints("SI", 150); // Slovenian points increase
addPoints("MKD", 300); // Macedonian points increase
    