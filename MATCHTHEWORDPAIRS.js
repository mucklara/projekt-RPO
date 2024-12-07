document.addEventListener("DOMContentLoaded", () => {
    const leftButtons = document.querySelectorAll(".left-column button");
    const rightButtons = document.querySelectorAll(".right-column button");
    const feedback = document.getElementById("feedback");
    let selectedLeft = null;

    leftButtons.forEach((leftButton) => {
        leftButton.addEventListener("click", () => {
            leftButtons.forEach((btn) => btn.classList.remove("selected"));
            leftButton.classList.add("selected");
            selectedLeft = leftButton;
        });
    });

    rightButtons.forEach((rightButton) => {
        rightButton.addEventListener("click", () => {
            if (selectedLeft) {
                const leftPair = selectedLeft.dataset.pair;
                const rightPair = rightButton.dataset.pair;

                if (leftPair === rightPair) {
                    rightButton.classList.add("correct");
                    feedback.textContent = "Correct! 🎉";
                    feedback.style.color = "#28a745";
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
});
