document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".word-options button");
    const feedback = document.querySelector(".feedback");
    const correctAnswer = document.querySelector(".image-area").dataset.correct; // Fetch correct answer

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            // Remove previous feedback
            buttons.forEach((btn) => btn.classList.remove("correct", "incorrect"));

            // Check if the selected button matches the correct answer
            if (button.dataset.word === correctAnswer) {
                button.classList.add("correct");
                feedback.textContent = "Correct! 🎉";
                feedback.style.color = "#28a745";
            } else {
                button.classList.add("incorrect");
                feedback.textContent = "Incorrect! ❌";
                feedback.style.color = "#dc3545";
            }

            // Disable all buttons after selection
            buttons.forEach((btn) => (btn.disabled = true));
        });
    });
});
