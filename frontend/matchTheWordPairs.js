document.addEventListener("DOMContentLoaded", () => {
    const leftButtons = document.querySelectorAll(".left-column button");
    const rightButtons = document.querySelectorAll(".right-column button");
    const feedback = document.getElementById("feedback");
    let selectedLeft = null;

    const userId = 123; // ID trenutnega uporabnika
    const languageId = 1; // ID trenutnega jezika

    async function updateUserProgress(userId, languageId, points) {
        try {
            const response = await fetch('/api/progress/update-user-progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    language_id: languageId,
                    points: points,
                }),
            });

            if (response.ok) {
                console.log('Progress updated successfully!');
            } else {
                console.error('Failed to update progress:', await response.text());
            }
        } catch (error) {
            console.error('Error updating progress:', error.message);
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
                    feedback.textContent = "Correct! 🎉";
                    feedback.style.color = "#28a745";

                    // Posodobi napredek za pravilni par
                    await updateUserProgress(userId, languageId, 10);
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
