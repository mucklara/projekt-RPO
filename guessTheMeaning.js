document.addEventListener("DOMContentLoaded", () => {
    const leftWord = document.getElementById("word-left");
    const rightItems = document.querySelectorAll("#right-list li");
    const feedback = document.getElementById("feedback");

    rightItems.forEach(item => {
        item.addEventListener("click", () => {
            // Remove previous styles
            rightItems.forEach(i => i.classList.remove("correct", "incorrect"));

            // Check if the pair matches
            if (item.dataset.pair === leftWord.dataset.pair) {
                item.classList.add("correct");
                feedback.textContent = "Pravilno! 🎉";
                feedback.style.color = "#28a745";
            } else {
                item.classList.add("incorrect");
                feedback.textContent = "Napačno! Poskusi znova. ❌";
                feedback.style.color = "#dc3545";
            }
        });
    });
});
