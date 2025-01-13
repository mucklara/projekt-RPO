document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".word-options button");
    const feedback = document.querySelector(".feedback");
    const correctAnswer = document.querySelector(".image-area").dataset.correct; // Fetch correct answer
    const currentPage = window.location.pathname.split("/").pop(); // Get the current file name

    // Define final game pages (adjust based on your file structure)
    const finalPages = [
        "matchTheImageWithTheWord_MKD3.html",
        "matchTheImageWithTheWord_SLO3.html"
    ];

    // Get userId and languageId from localStorage
    const userId = localStorage.getItem("userId");
    const selectedLanguage = localStorage.getItem("selectedLanguage");
    const languageId = selectedLanguage === "SLO" ? 1 : 2; // Map language to ID (SLO = 1, MKD = 2)

    // Function to update user progress
    async function updateUserProgress(userId, languageId, pointsToAdd) {
        try {
            const response = await fetch("http://localhost:3000/api/user-progress/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    languageId,
                    pointsToAdd,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Progress updated successfully!", data);
            } else {
                const errorText = await response.text();
                console.error("Failed to update progress:", errorText);
            }
        } catch (error) {
            console.error("Error updating progress:", error.message);
        }
    }

    buttons.forEach((button) => {
        button.addEventListener("click", async () => {
            // Remove previous feedback
            buttons.forEach((btn) => btn.classList.remove("correct", "incorrect"));

            // Check if the selected button matches the correct answer
            if (button.dataset.word === correctAnswer) {
                button.classList.add("correct");
                feedback.textContent = "Correct! 🎉";
                feedback.style.color = "#28a745";

                if (userId && selectedLanguage) {
                    console.log(`Updating points for userId: ${userId}, languageId: ${languageId}`);
                    await updateUserProgress(parseInt(userId), languageId, 10); // Add 10 points
                } else {
                    console.error("userId or selectedLanguage is missing in localStorage!");
                }

                // Disable all buttons after a correct answer
                buttons.forEach((btn) => (btn.disabled = true));

                // Show completion message if it's the final game page
                if (finalPages.includes(currentPage)) {
                    showCompletionMessage();
                }
            } else {
                button.classList.add("incorrect");
                feedback.textContent = "Incorrect! ❌";
                feedback.style.color = "#dc3545";

                // Disable all buttons after an incorrect answer
                buttons.forEach((btn) => (btn.disabled = true));
            }
        });
    });

    function showCompletionMessage() {
        feedback.textContent = "Well done! You have completed this game.";
        feedback.style.color = "#007bff";
        feedback.style.fontSize = "20px";
        feedback.style.fontWeight = "bold";
    }
});

// Logic for the Exit Button
document.addEventListener("DOMContentLoaded", () => {
    const exitButton = document.querySelector(".exit-button");

    if (exitButton) {
        // Get the selected language from localStorage
        const selectedLanguage = localStorage.getItem("selectedLanguage");

        // Set the exit button's behavior
        if (selectedLanguage) {
            exitButton.addEventListener("click", () => {
                window.location.href = `chooseGames_${selectedLanguage}.html`;
            });
        } else {
            exitButton.addEventListener("click", () => {
                alert("Language not selected! Redirecting to the dashboard.");
                window.location.href = "dashboard.html";
            });
        }
    }
});
