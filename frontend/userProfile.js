document.addEventListener("DOMContentLoaded", async () => {
    const apiUrl = "/users"; // Adjust the API route as needed

    // Fetch user data from backend
// Fetch the user profile based on the userId from localStorage
async function fetchUserProfile() {
    try {
        const response = await fetch('backend/routes/userProfile.js');  // Fetch user profile from backend
        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }

        const userData = await response.json();
        updateUserProfile(userData);
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

  

    // Save user info to localStorage
    function saveUserInfoToLocalStorage(userProfile) {
        localStorage.setItem('userId', userProfile.user_id);
        localStorage.setItem('username', userProfile.username);
        localStorage.setItem('email', userProfile.email);
        localStorage.setItem('avatar', userProfile.avatar || 'images/default.png');
    }
// Optionally, other profile data

    // Save avatar selection to backend
    async function saveAvatar(avatar) {
        try {
            const userId = await getUserId(); // Dynamically fetch the user ID
            const response = await fetch(`${apiUrl}/${userId}/avatar`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ avatar }),
            });
            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error("Invalid avatar data.");
                } else if (response.status >= 500) {
                    throw new Error("Server error. Please try again later.");
                } else {
                    throw new Error("Failed to save avatar.");
                }
            }
            document.getElementById("avatar").src = avatar;

            // Save the updated avatar in localStorage
            localStorage.setItem('avatar', avatar);
        } catch (error) {
            console.error("Error saving avatar:", error);
            displayError("Failed to save avatar. Please try again.");
        }
    }

    // userProfile.js
// userProfile.js (fix for checking localStorage and profile access)
window.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId'); // Ensure the ID is stored
    
    if (!userId) {
      console.error('User is not logged in');
      // Redirect to login if no userId
      window.location.href = '/frontend/login.html';
    } else {
      // Fetch the user profile based on userId
      fetchUserProfile(userId);  // Pass the userId to fetch user data
    }
  });
  
  

    // Dynamically fetch the user ID (mock implementation)
    async function getUserId() {
        try {
            const response = await fetch("/auth/user"); // Example endpoint for getting authenticated user ID
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("User ID not found.");
                } else if (response.status >= 500) {
                    throw new Error("Server error. Please try again later.");
                } else {
                    throw new Error("Failed to fetch user ID.");
                }
            }
            const data = await response.json();
            return data.id;
            
        } catch (error) {
            console.error("Error fetching user ID:", error);
            throw error;
        }
    }

    // Display an error message on the page
    function displayError(message) {
        const errorContainer = document.getElementById("error-container");
        if (errorContainer) {
            errorContainer.textContent = message;
            errorContainer.style.display = "block";
        }
    }

    // Add event listeners for avatar selection
    function setupAvatarSelection() {
        document.querySelectorAll(".avatar-option").forEach(button => {
            button.addEventListener("click", () => {
                const avatar = button.dataset.avatar;
                saveAvatar(avatar);
            });
        });
    }

    // Initialize the profile page
    try {
        await fetchUserProfile();  // Fetch and display the user profile
        setupAvatarSelection();    // Setup avatar selection
    } catch (error) {
        console.error("Error initializing profile page:", error);
        displayError("Failed to initialize profile page. Please try again.");
    }
});
