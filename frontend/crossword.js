// Function to check answers
function checkAnswers() {
    const inputs = document.querySelectorAll(".word-cell input");
    let isCorrect = true; // Flag to determine if the entire crossword is correct

    inputs.forEach(input => {
        const correctLetter = input.dataset.correct.toUpperCase();
        const userLetter = input.value.toUpperCase();

        if (userLetter === correctLetter) {
            input.style.backgroundColor = "lightgreen"; // Correct answer
        } else {
            input.style.backgroundColor = "lightcoral"; // Incorrect answer
            isCorrect = false; // Mark the crossword as incorrect if any letter is wrong
        }
    });

    // Display result based on the correctness of the entire crossword
    if (isCorrect) {
        alert("The entire crossword is correct!");
    } else {
        alert("The crossword is incorrect. Please try again.");
    }
}

// Add event listener for the "Check Answers" button
document.getElementById("check-answers").addEventListener("click", checkAnswers);
