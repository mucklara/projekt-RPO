document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        console.error("User is not logged in.");
        window.location.href = "login.html";
        return;
    }

    const apiUrl = "http://localhost:3000/api/users"; // Adjust the API route if needed

    // Fetch user profile by userId
    async function fetchUserProfile(userId) {
        try {
            const response = await fetch(`${apiUrl}/${userId}`);
            if (!response.ok) throw new Error("Failed to fetch user profile.");
            
            const userData = await response.json();
            console.log("User Profile Data:", userData); // Debugging log
            updateUserProfile(userData);
        } catch (error) {
            console.error("Error fetching user profile:", error);
            displayError("Failed to load user profile. Please try again.");
        }
    }

    // Update the profile UI with user data
    function updateUserProfile(userData) {
        const avatarElement = document.getElementById("avatar");
        const nameElement = document.getElementById("userName");
        const emailElement = document.getElementById("userEmail");
        const registrationDateElement = document.getElementById("userRegistrationDate");
        const progressElement = document.getElementById("userProgress");

        if (avatarElement) avatarElement.src = userData.avatar || "/uploads/avatars/default-avatar.png";
        if (nameElement) nameElement.textContent = userData.username || "Not available";
        if (emailElement) emailElement.textContent = userData.email || "Not available";
        if (registrationDateElement) registrationDateElement.textContent = userData.registrationDate || "Not available";
        if (progressElement) progressElement.textContent = userData.progress || "Not available";

        // Save data to localStorage for future use
        localStorage.setItem("username", userData.username);
        localStorage.setItem("email", userData.email);
        localStorage.setItem("registrationDate", userData.registrationDate);
        localStorage.setItem("progress", userData.progress);
    }

    // Function to fetch and update user progress for a language
    async function fetchAndDisplayProgress(languageId, trackerRowSelector) {
        const trackerRow = document.querySelector(trackerRowSelector);
        console.log(`Fetching progress for language ID ${languageId}...`); // Debugging log

        try {
            const response = await fetch(`http://localhost:3000/api/user-progress/${userId}/${languageId}`);
            if (response.ok) {
                const progress = await response.json();
                console.log(`Progress for language ID ${languageId}:`, progress); // Debugging log
                const level = calculateLevel(progress.points || 0);
                trackerRow.querySelector('.level-box').textContent = `${level} (${progress.points || 0} points)`;
            } else if (response.status === 404) {
                // No progress found for the language
                trackerRow.querySelector('.level-box').textContent = "None (0 points)";
            } else {
                console.error(`Error fetching progress for language ID ${languageId}:`, await response.text());
                trackerRow.querySelector('.level-box').textContent = "Error";
            }
        } catch (error) {
            console.error(`Error fetching progress for language ID ${languageId}:`, error.message);
            trackerRow.querySelector('.level-box').textContent = "Error";
        }
    }

    // Helper function to calculate level based on points
    function calculateLevel(points) {
        if (points >= 600) return "C2";
        if (points >= 500) return "C1";
        if (points >= 400) return "B2";
        if (points >= 300) return "B1";
        if (points >= 200) return "A2";
        if (points >= 100) return "A1";
        return "None";
    }

    // Fetch user profile
    await fetchUserProfile(userId);

    // Fetch progress for Slovenian (Language ID: 1)
    await fetchAndDisplayProgress(1, '.tracker-row:nth-child(1)');

    // Fetch progress for Macedonian (Language ID: 2)
    await fetchAndDisplayProgress(2, '.tracker-row:nth-child(2)');
});

// userProfile.js
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


