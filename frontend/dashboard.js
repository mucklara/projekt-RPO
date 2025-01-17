document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId'); // Get user ID from localStorage
    const username = localStorage.getItem('username'); // Get username from localStorage
    if (!userId) {
        console.error('User ID not found in localStorage. Cannot fetch progress.');
        return;
    }
    document.getElementById('username').textContent = username || 'Unknown';

    // Function to calculate level based on points
    function calculateLevel(points) {
        if (points >= 600) return "C2";
        if (points >= 500) return "C1";
        if (points >= 400) return "B2";
        if (points >= 300) return "B1";
        if (points >= 200) return "A2";
        if (points >= 100) return "A1";
        return "None";
    }

// Fetch user's avatar path and set it
async function fetchUserData() {
    const userId = localStorage.getItem('userId');  // Get the userId from localStorage
    if (!userId) {
        console.error('User ID is missing in localStorage');
        return;
    }

    try {
        // Fetch basic user data (including username)
        const response = await fetch(`http://localhost:3000/api/users/${userId}`);
        const userData = await response.json();
        if (response.ok) {
            document.getElementById('username').textContent = userData.username;
            
            // Fetch the avatar image
            const avatarResponse = await fetch(`http://localhost:3000/api/users/${userId}/avatar`);
            const avatarData = await avatarResponse.json();
            if (avatarResponse.ok) {
                document.getElementById('avatarImage').src = avatarData.avatar; // Set the avatar image source
            } else {
                console.error('Error fetching avatar:', avatarData.message || 'Unknown error');
            }
        } else {
            console.error('Error fetching user data:', userData.message || 'Unknown error');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Call this function once the DOM content is loaded
document.addEventListener('DOMContentLoaded', fetchUserData);

document.getElementById('uploadAvatarBtn').addEventListener('click', () => {
    document.getElementById('avatarInput').click();  // Trigger file input click when the button is clicked
});

// Handle avatar file selection
document.getElementById('avatarInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('userId', localStorage.getItem('userId')); // Append user ID to the form data

        try {
            const response = await fetch(`http://localhost:3000/api/users/${localStorage.getItem('userId')}/avatar`, {
                method: 'PUT',
                body: formData
            });
            const result = await response.json();

            if (response.ok) {
                // Update avatar image on success
                document.getElementById('avatarImage').src = result.avatar;
            } else {
                console.error('Error uploading avatar:', result.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error updating avatar:', error);
        }
    }
});


    // Function to fetch and update user progress for a language
    async function fetchAndDisplayProgress(languageId, trackerRowSelector) {
        const trackerRow = document.querySelector(trackerRowSelector);

        try {
            const response = await fetch(`http://localhost:3000/api/user-progress/${userId}/${languageId}`);
            if (response.ok) {
                const progress = await response.json();
                const level = calculateLevel(progress.points || 0);
                trackerRow.querySelector('.level-box').textContent = `${level} (${progress.points || 0} points)`;
            } else if (response.status === 404) {
                // No progress found for the language
                trackerRow.querySelector('.level-box').textContent = "None (0 points)";
            } else {
                console.error(`Error fetching progress for language ID ${languageId}:`, await response.text());
                trackerRow.querySelector('.level-box').textContent = "None (0 points)";
            }
        } catch (error) {
            console.error(`Error fetching progress for language ID ${languageId}:`, error.message);
            trackerRow.querySelector('.level-box').textContent = "Error";
        }
    }

    // Fetch progress for Slovenian (Language ID: 1)
    await fetchAndDisplayProgress(1, '.tracker-row:nth-child(1)');

    // Fetch progress for Macedonian (Language ID: 2)
    await fetchAndDisplayProgress(2, '.tracker-row:nth-child(2)');
});

let selectedLanguage = null; // Independent of localStorage

// Handle language selection
document.querySelectorAll('.language-option').forEach(option => {
    option.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior

        // Clear any previous selections
        document.querySelectorAll('.language-option').forEach(opt => {
            opt.style.backgroundColor = ''; // Reset background color
        });

        // Highlight the selected option
        event.target.style.backgroundColor = 'lightgreen';

        // Update the selected language
        selectedLanguage = event.target.getAttribute('data-language'); // Only update in memory
        console.log(`Selected language: ${selectedLanguage}`); // Debug log
    });
});

document.getElementById('playGameButton').addEventListener('click', (event) => {
    if (!selectedLanguage) {
        event.preventDefault(); // Prevent navigation if no language is selected

        // Show the warning modal
        const modal = document.getElementById('warningModal');
        if (modal) {
            modal.style.display = 'block';
        } else {
            console.error('Warning modal not found.');
        }
    } else {
        // Redirect to the appropriate page based on the selected language
        if (selectedLanguage === 'SLO') {
            event.target.href = 'chooseGames_SLO.html';
        } else if (selectedLanguage === 'MKD') {
            event.target.href = 'chooseGames_MKD.html';
        }
    }
});
// Close modal on "X" button click
document.querySelector('.close-button').addEventListener('click', () => {
    const modal = document.getElementById('warningModal');
    if (modal) {
        modal.style.display = 'none';
    }
});

// Close modal if the user clicks outside it
window.addEventListener('click', (event) => {
    const modal = document.getElementById('warningModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
// Wait for the document to load
document.addEventListener('DOMContentLoaded', () => {
    const avatarImage = document.getElementById('avatarImage');
    const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
    const avatarInput = document.getElementById('avatarInput');

    // Retrieve the user ID from localStorage
    const userId = localStorage.getItem('userId');

    if (userId) {
        // Fetch the user's avatar on page load using the userId from localStorage
        fetch(`http://localhost:3000/api/users/${userId}/avatar`) // Use the userId to fetch the avatar
            .then(response => response.json())
            .then(data => {
                if (data.avatar) {
                    avatarImage.src = `http://localhost:3000${data.avatar}`;  // Assuming the avatar is under /uploads/avatars/
                } else {
                    avatarImage.src = 'http://localhost:3000/uploads/avatars/default-avatar.png'; // Default avatar
                }
            })
            .catch(error => {
                console.error('Error fetching avatar:', error);
                avatarImage.src = 'http://localhost:3000/uploads/avatars/default-avatar.png'; // Default avatar in case of error
            });
    } else {
        console.error('User ID not found in localStorage.');
        avatarImage.src = 'http://localhost:3000/uploads/avatars/default-avatar.png'; // Default avatar if no user ID
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.querySelector('.logout-button');  // Select the logout button
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // Remove user data from local storage (this doesn't affect the database)
            localStorage.removeItem('userData');
            
            // Redirect the user to the login page
            window.location.href = 'login.html';
        });
    } else {
        console.error('Logout button not found');
    }
});



