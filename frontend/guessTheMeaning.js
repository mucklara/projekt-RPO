document.addEventListener("DOMContentLoaded", () => {
    const leftWord = document.getElementById("word-left");
    const rightItems = document.querySelectorAll("#right-list li");
    const feedback = document.getElementById("feedback");

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

    rightItems.forEach(item => {
        item.addEventListener("click", async () => {
            // Remove previous styles
            rightItems.forEach(i => i.classList.remove("correct", "incorrect"));

            // Check if the pair matches
            if (item.dataset.pair === leftWord.dataset.pair) {
                item.classList.add("correct");
                feedback.textContent = "Pravilno! 🎉";
                feedback.style.color = "#28a745";

                // Posodobi napredek za pravilni odgovor
                await updateUserProgress(userId, languageId, 10);
            } else {
                item.classList.add("incorrect");
                feedback.textContent = "Napačno! Poskusi znova. ❌";
                feedback.style.color = "#dc3545";
            }
        });
    });
});

