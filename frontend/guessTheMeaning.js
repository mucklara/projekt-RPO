document.addEventListener("DOMContentLoaded", () => {
    const leftWord = document.getElementById("word-left");
    const rightItems = document.querySelectorAll("#right-list li");
    const feedback = document.getElementById("feedback");
    const currentPage = window.location.pathname.split("/").pop(); // Get the current file name

    // Define final game pages
    const finalPages = ["guessTheMeaning_MKD2.html", "guessTheMeaning_SLO2.html"];

    // Get userId and selectedLanguage from localStorage
    const userId = localStorage.getItem("userId"); // ID of the current user
    const selectedLanguage = localStorage.getItem("selectedLanguage"); // Get selected language
    const languageId = selectedLanguage === "SLO" ? 1 : 2; // Map language to ID (SLO = 1, MKD = 2)

    if (!userId || !selectedLanguage) {
        console.error("userId or selectedLanguage is missing in localStorage!");
    }

    // Function to update user progress
    async function updateUserProgress(userId, languageId, pointsToAdd) {
        try {
            const response = await fetch('http://localhost:3000/api/user-progress/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    languageId,
                    pointsToAdd,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Points updated successfully in the database!", data);
            } else {
                const errorText = await response.text();
                console.error("Failed to update points in the database:", errorText);
            }
        } catch (error) {
            console.error("Error updating points in the database:", error.message);
        }
    }

    // Add click event listeners to each right-side item
    rightItems.forEach(item => {
        item.addEventListener("click", async () => {
            // Remove previous styles
            rightItems.forEach(i => i.classList.remove("correct", "incorrect"));

            // Check if the pair matches
            if (item.dataset.pair === leftWord.dataset.pair) {
                item.classList.add("correct");
                feedback.textContent = "Correct! 🎉";
                feedback.style.color = "#28a745";

                // Update progress for a correct answer
                if (userId && selectedLanguage) {
                    console.log(`Updating points for userId: ${userId}, languageId: ${languageId}`);
                    await updateUserProgress(parseInt(userId), languageId, 20); // Add 20 points
                }

                // Show completion message if it's the final game page
                if (finalPages.includes(currentPage)) {
                    showCompletionMessage();
                }
            } else {
                item.classList.add("incorrect");
                feedback.textContent = "Incorrect! ❌";
                feedback.style.color = "#dc3545";
            }

            // Disable all items after a selection
            rightItems.forEach(i => (i.disabled = true));
        });
    });

    // Function to show a completion message
    function showCompletionMessage() {
        feedback.textContent = "Well done! You have completed this game.";
        feedback.style.color = "#007bff";
        feedback.style.fontSize = "20px";
        feedback.style.fontWeight = "bold";
    }

    // Logic for the Exit Button
    const exitButton = document.querySelector('.exit-button');
    if (exitButton) {
        // Set the exit button's behavior based on selectedLanguage
        exitButton.addEventListener('click', () => {
            if (selectedLanguage) {
                window.location.href = `chooseGames_${selectedLanguage}.html`;
            } else {
                alert('Language not selected! Redirecting to the dashboard.');
                window.location.href = 'dashboard.html';
            }
        });
    }
});
