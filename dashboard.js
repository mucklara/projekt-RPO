document.addEventListener('DOMContentLoaded', async () => {
    await fetchUserProfile();
    await fetchLanguageProgress();
    fetchUserProgress();

    const leaderboardLink = document.querySelector('.leaderboard-link');
    leaderboardLink.href = 'leaderboard.html'; 
});


async function fetchUserProfile() {
    try {
        const response = await fetch('/auth/user'); 
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

// Fetch language progress for the tracker
async function fetchLanguageProgress() {
    try {
        const siResponse = await fetch(`/userProgress/${defaultUserId}/1`);
        const mkdResponse = await fetch(`/userProgress/${defaultUserId}/2`);

        if (!siResponse.ok || !mkdResponse.ok) {
            if (siResponse.status === 404 || mkdResponse.status === 404) {
                throw new Error('Language progress data not found.');
            } else if (siResponse.status >= 500 || mkdResponse.status >= 500) {
                throw new Error('Server error. Please try again later.');
            } else {
                throw new Error('Failed to fetch language progress.');
            }
        }

        const siData = await siResponse.json();
        const mkdData = await mkdResponse.json();

        updateLanguageTracker(siData, mkdData);
    } catch (error) {
        console.error('Error fetching language progress:', error);
    }
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
