document.addEventListener("DOMContentLoaded", async () => {
    const apiUrl = "/users"; // Adjust the API route as needed

    // Fetch user data from backend
    async function fetchUserData() {
        try {
            const userId = await getUserId(); // Dynamically fetch the user ID
            const response = await fetch(`${apiUrl}/${userId}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("User data not found.");
                } else if (response.status >= 500) {
                    throw new Error("Server error. Please try again later.");
                } else {
                    throw new Error("Failed to fetch user data.");
                }
            }

            const userData = await response.json();
            document.getElementById("userName").textContent = userData.name;
            document.getElementById("userProgress").textContent = `${userData.progress}%`;
            document.getElementById("userLanguages").textContent = userData.languages.join(", ");
            document.getElementById("avatar").src = userData.avatar || "default.png";
        } catch (error) {
            console.error("Error fetching user data:", error);
            displayError("Failed to load user data. Please try again.");
        }
    }

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
        } catch (error) {
            console.error("Error saving avatar:", error);
            displayError("Failed to save avatar. Please try again.");
        }
    }

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
        await fetchUserData();
        setupAvatarSelection();
    } catch (error) {
        console.error("Error initializing profile page:", error);
        displayError("Failed to initialize profile page. Please try again.");
    }
});
