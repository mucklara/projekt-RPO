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
// Function to filter the leaderboard rows based on the search bar input
function searchLeaderboard() {
    const input = document.getElementById('searchBar').value.toLowerCase();
    const rows = document.querySelectorAll('.leaderboard-container tbody tr');
    
    rows.forEach(row => {
        const usernameCell = row.querySelector('td:nth-child(2)'); // 2nd column is the username
        const username = usernameCell.textContent.toLowerCase();
        
        if (username.indexOf(input) !== -1) {
            row.style.display = ''; // Show the row if the username matches the search
        } else {
            row.style.display = 'none'; // Hide the row if it doesn't match
        }
    });
}
