document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".word-options button");
    const feedback = document.querySelector(".feedback");
    const correctAnswer = document.querySelector(".image-area").dataset.correct; // Fetch correct answer

    const userId = 123; // ID trenutnega uporabnika
    const languageId = 1; // ID trenutnega jezika

    // Funkcija za posodobitev napredka uporabnika
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

    buttons.forEach((button) => {
        button.addEventListener("click", async () => {
            // Remove previous feedback
            buttons.forEach((btn) => btn.classList.remove("correct", "incorrect"));

            // Check if the selected button matches the correct answer
            if (button.dataset.word === correctAnswer) {
                button.classList.add("correct");
                feedback.textContent = "Correct! 🎉";
                feedback.style.color = "#28a745";

                // Posodobi napredek za pravilen odgovor
                await updateUserProgress(userId, languageId, 10);
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
