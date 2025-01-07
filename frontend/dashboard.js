document.addEventListener('DOMContentLoaded', async () => {
    await fetchUserProfile();
    await fetchLanguageProgress();
    fetchUserProgress();

    const leaderboardLink = document.querySelector('.leaderboard-link');
    leaderboardLink.href = 'leaderboard.html'; 
});


async function fetchUserProfile() {
    try {
        const response = await fetch('/backend/routes/userProfile.js'); 
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('User profile not found.');
            } else if (response.status >= 500) {
                throw new Error('Server error. Please try again later.');
            } else {
                throw new Error('Failed to fetch user profile.');
            }
        }
        const userData = await response.json();
        updateUserProfile(userData);
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

async function fetchDashboardData() {
    const userId = localStorage.getItem('userId'); // Assuming the userId is stored in localStorage

    if (!userId) {
        console.error('User is not logged in or userId is not found.');
        window.location.href = 'login.html';
        return;
    }

    // Fetch available languages
    try {
        const languageResponse = await fetch('/api/languages');
        if (!languageResponse.ok) {
            console.error('Failed to fetch languages:', languageResponse.statusText);
            return;
        }
        const languages = await languageResponse.json();
        console.log('Fetched languages:', languages); // Debugging
        
        const languageList = document.getElementById('languageList');
        languageList.innerHTML = ''; // Clear the list first to avoid duplicates
        
        languages.forEach(language => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" class="language-option" data-language="${language.language_id}">${language.language_name}</a>`;
            languageList.appendChild(li);
        });

        // Add event listener to save selected language
        document.querySelectorAll('.language-option').forEach(link => {
            link.addEventListener('click', async (event) => {
                event.preventDefault();
                const selectedLanguage = event.target.dataset.language;

                try {
                    const response = await fetch('/api/user/language', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId, language: selectedLanguage })
                    });

                    if (response.ok) {
                        alert(`Language changed to ${event.target.textContent}`);
                    } else {
                        console.error('Failed to update language');
                    }
                } catch (error) {
                    console.error('Error saving language:', error);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching languages:', error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    fetchDashboardData();
});

async function fetchLanguageProgress() {
    try {
        const response = await fetch(`/api/language-progress?user_id=${userId}`);
        const data = await response.json();

        if (response.ok) {
            console.log('Fetched language progress:', data); // Log to inspect
            updateLanguageTracker(data); // Assuming you have a function to update the UI
        } else {
            console.error('Error fetching language progress:', data.error);
        }
    } catch (error) {
        console.error('Error fetching language progress:', error);
    }
}


async function fetchUserProgress() {
    try {
        const response = await fetch('/userProgress');
        if (!response.ok) throw new Error('Failed to fetch progress data.');

        const { progressToNextLevel } = await response.json();
        updateProgressBar(progressToNextLevel);
        drawProgressGraph(progressToNextLevel);
    } catch (error) {
        console.error('Error fetching progress:', error);
    }
}


function updateProgressBar(progress) {
    const progressFill = document.querySelector('.progress-fill');
    const progressPercentage = document.getElementById('progress-percentage');

    progressFill.style.width = `${progress}%`;
    progressPercentage.textContent = `${progress}%`;
}


function drawProgressGraph(progress) {
    const canvas = document.getElementById('progressGraph');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;
    const startAngle = -0.5 * Math.PI;
    const endAngle = startAngle + (2 * Math.PI * (progress / 100));

    
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#e0e0e0';
    ctx.fill();

    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#76c7c0';
    ctx.stroke();

    
    ctx.font = '20px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${progress}%`, centerX, centerY);
}

// Update profile section in the HTML
function updateUserProfile(userData) {
    const usernameElement = document.getElementById('username');
    const avatarElement = document.getElementById('avatar');

    usernameElement.textContent = userData.username || 'Unknown';
    avatarElement.src = userData.avatar || 'default.png';
}

// Update the language tracker with backend data
function updateLanguageTracker(siData, mkdData) {
    const siLevelBox = document.querySelector('.tracker-row:nth-child(1) .level-box');
    const mkdLevelBox = document.querySelector('.tracker-row:nth-child(2) .level-box');

    siLevelBox.textContent = `${siData.level} (${siData.points} points)`;
    mkdLevelBox.textContent = `${mkdData.level} (${mkdData.points} points)`;
}

// Add points dynamically and update backend
async function addPoints(language, points) {
    try {
        const languageId = language === 'SI' ? 1 : 2;
        const response = await fetch('/userProgress/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: defaultUserId,
                languageId,
                points,
            }),
        });

        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('Invalid points update request.');
            } else if (response.status >= 500) {
                throw new Error('Server error. Please try again later.');
            } else {
                throw new Error('Failed to update points.');
            }
        }

        console.log(`Points added to ${language} successfully`);
        await fetchLanguageProgress();
    } catch (error) {
        console.error('Error updating points:', error);
    }


}

// Fetch data on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchUserProfile();
    fetchLanguageProgress();
});