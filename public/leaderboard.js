document.addEventListener('DOMContentLoaded', async () => {
    const userId = 1; // Replace with the actual user ID

    try {
        // Fetch completed levels for the user
        const response = await fetch(`/api/auth/completed-levels/${userId}`);
        const data = await response.json();

        console.log('Fetched data:', data); // Debug: Log the fetched data

        if (response.ok) {
            const tableBody = document.querySelector('tbody');

            if (!tableBody) {
                console.error('Table body not found in the HTML'); // Debug: Log if tbody is missing
                return;
            }

            // Clear existing rows in the table body
            tableBody.innerHTML = '';

            // Add rows for each completed level
            data.completedLevels.forEach((level, index) => {
                console.log('Adding row:', level); // Debug: Log each row before adding
                const row = document.createElement('tr');
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
            console.error('API error:', data.message); // Debug: Log any API errors
            alert(data.message);
        }
    } catch (error) {
        console.error('Error fetching completed levels:', error); // Debug: Log fetch errors
    }
});
