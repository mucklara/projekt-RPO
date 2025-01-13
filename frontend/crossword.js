// Function to check answers
async function checkAnswers() {
    const inputs = document.querySelectorAll(".word-cell input");
    let isCorrect = true; // Flag to determine if the entire crossword is correct
    const currentPage = window.location.pathname.split("/").pop(); // Get the current file name

    // Define final crossword pages
    const finalPages = [
        "crosswordBodyparts_MKD.html",
        "crosswordBodyparts_SLO.html",
        "crosswordClothes_MKD.html",
        "crosswordClothes_SLO.html",
        "crosswordFood_MKD.html",
        "crosswordFood_SLO.html"
    ];

    // Validate each input against the correct answer
    inputs.forEach(input => {
        const correctLetter = input.dataset.correct.toUpperCase();
        const userLetter = input.value.toUpperCase();

        if (userLetter === correctLetter) {
            input.style.backgroundColor = "lightgreen"; // Mark as correct
        } else {
            input.style.backgroundColor = "lightcoral"; // Mark as incorrect
            isCorrect = false; // Crossword is incorrect if any letter is wrong
        }
    });

    // Process the result of the crossword
    if (isCorrect) {
        alert("The entire crossword is correct!");

        // Update points in the database
        const userId = localStorage.getItem("userId"); // Get user ID from localStorage
        const selectedLanguage = localStorage.getItem("selectedLanguage"); // Get selected language
        const languageId = selectedLanguage === "SLO" ? 1 : 2; // Map language to ID (SLO = 1, MKD = 2)

        if (userId && selectedLanguage) {
            console.log(`Updating points for userId: ${userId}, languageId: ${languageId}`);
            await updateUserProgress(parseInt(userId), languageId, 50); // Add 50 points
        } else {
            console.error("userId or selectedLanguage is missing in localStorage!");
        }

        // If it's the final crossword page, show completion message
        if (finalPages.includes(currentPage)) {
            showCompletionMessage();
        }
    } else {
        alert("The crossword is incorrect. Please try again.");
    }
}

// Add event listener for the "Check Answers" button
document.getElementById("check-answers").addEventListener("click", checkAnswers);

// Function to show a completion message
function showCompletionMessage() {
    const feedback = document.createElement("div");
    feedback.textContent = "Well done! You have completed this game.";
    feedback.style.color = "#007bff";
    feedback.style.fontSize = "20px";
    feedback.style.fontWeight = "bold";
    feedback.style.textAlign = "center";
    feedback.style.marginTop = "20px";

    document.body.appendChild(feedback);
}

// Function to update user progress in the database
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
            const data=await response.json();
            console.log("Points updated successfully in the database!", data);
        } else {
            const errorText = await response.text();
            console.error("Failed to update points in the database:", errorText);
        }
    } catch (error) {
        console.error("Error updating points in the database:", error.message);
    }
}

// Logic for the Exit Button
document.addEventListener('DOMContentLoaded', () => {
    const exitButton = document.querySelector('.exit-button');

    if (exitButton) {
        // Get the selected language from localStorage
        const selectedLanguage = localStorage.getItem('selectedLanguage');

        // Set the exit button's behavior
        if (selectedLanguage) {
            exitButton.addEventListener('click', () => {
                window.location.href = `chooseGames_${selectedLanguage}.html`;
            });
        } else {
            exitButton.addEventListener('click', () => {
                alert('Language not selected! Redirecting to the dashboard.');
                window.location.href = 'dashboard.html';
            });
        }
    }
});
