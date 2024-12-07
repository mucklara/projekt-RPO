// Function to check answers
function checkAnswers() {
    const inputs = document.querySelectorAll(".word-cell input");
    inputs.forEach(input => {
        const correctLetter = input.dataset.correct.toUpperCase();
        const userLetter = input.value.toUpperCase();

        if (userLetter === correctLetter) {
            input.style.backgroundColor = "lightgreen"; // Correct answer
        } else if (userLetter) {
            input.style.backgroundColor = "lightcoral"; // Incorrect answer
        } else {
            input.style.backgroundColor = "white"; // No input
        }
    });
}

// Add event listener for the "Check Answers" button
document.getElementById("check-answers").addEventListener("click", checkAnswers);
