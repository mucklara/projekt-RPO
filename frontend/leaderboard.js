document.addEventListener('DOMContentLoaded', async () => {
    const userId = 1; // Zamenjajte z dejanskim ID-jem uporabnika

    try {
        // Pridobite podatke o dokončanih nivojih za uporabnika
        const response = await fetch(`/api/auth/completed-levels/${userId}`);
        const data = await response.json();

        if (response.ok) {
            const tableBody = document.querySelector('tbody');

            if (!tableBody) {
                console.error('Tabela ni bila najdena v HTML-ju');
                return;
            }

            // Počisti obstoječe vrstice v tabeli
            tableBody.innerHTML = '';

            // Dodaj vrstice za vsak nivo
            data.completedLevels.forEach((level, index) => {
                const row = document.createElement('tr');
                row.classList.add('leaderboard-row'); // Dodaj razred za CSS sloge

                // Nastavi barvne indikatorje glede na rank
                if (index === 0) {
                    row.classList.add('gold');
                } else if (index === 1) {
                    row.classList.add('silver');
                } else if (index === 2) {
                    row.classList.add('bronze');
                }

                row.innerHTML = `
                    <td>${index + 1}</td> <!-- Rank -->
                    <td>${level.username}</td> <!-- Username -->
                    <td>${level.level}</td> <!-- Level -->
                    <td>${level.points}</td> <!-- Points -->
                    <td>${level.language_name}</td> <!-- Language -->
                `;
                tableBody.appendChild(row);
            });
        } else {
            console.error('Napaka API:', data.message);
            alert(data.message);
        }
    } catch (error) {
        console.error('Napaka pri pridobivanju nivojev:', error);
    }
});
