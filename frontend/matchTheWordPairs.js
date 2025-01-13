document.addEventListener("DOMContentLoaded", () => {
    const leftButtons = document.querySelectorAll(".left-column button");
    const rightButtons = document.querySelectorAll(".right-column button");
    const feedback = document.getElementById("feedback");
    const currentPage = window.location.pathname.split("/").pop(); // Get the current file name
    let selectedLeft = null;
    let correctMatches = 0; // Counter for correct matches
    const totalPairs = leftButtons.length; // Total pairs to match

    // Get userId and languageId from localStorage
    const userId = localStorage.getItem("userId");
    const selectedLanguage = localStorage.getItem("selectedLanguage");
    const languageId = selectedLanguage === "SLO" ? 1 : 2; // Map language to ID (SLO = 1, MKD = 2)

    const finalPages = ["matchTheWordPairs_MKD2.html", "matchTheWordPairs_SLO2.html"]; // Final game pages

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

    leftButtons.forEach((leftButton) => {
        leftButton.addEventListener("click", () => {
            leftButtons.forEach((btn) => btn.classList.remove("selected"));
            leftButton.classList.add("selected");
            selectedLeft = leftButton;
        });
    });

    rightButtons.forEach((rightButton) => {
        rightButton.addEventListener("click", async () => {
            if (selectedLeft) {
                const leftPair = selectedLeft.dataset.pair;
                const rightPair = rightButton.dataset.pair;

                if (leftPair === rightPair) {
                    rightButton.classList.add("correct");
                    selectedLeft.classList.add("correct");
                    feedback.textContent = "Correct! 🎉";
                    feedback.style.color = "#28a745";

                    correctMatches++; // Increment correct match count

                    if (userId && selectedLanguage) {
                        console.log(`Updating points for userId: ${userId}, languageId: ${languageId}`);
                        await updateUserProgress(parseInt(userId), languageId, 10); // Add 10 points
                    } else {
                        console.error("userId or selectedLanguage is missing in localStorage!");
                    }

                    // Check if all pairs are matched
                    if (correctMatches === totalPairs) {
                        showCompletionMessage(); // Show "Well done!" message
                    }
                } else {
                    rightButton.classList.add("incorrect");
                    feedback.textContent = "Incorrect! ❌";
                    feedback.style.color = "#dc3545";
                }

                selectedLeft.classList.remove("selected");
                selectedLeft = null;
            } else {
                feedback.textContent = "Please select a word on the left first!";
                feedback.style.color = "#ffc107";
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
