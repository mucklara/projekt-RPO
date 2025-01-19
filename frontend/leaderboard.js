document.addEventListener('DOMContentLoaded', async () => {
    let leaderboardData = []; // To store the fetched leaderboard data

    // Fetch leaderboard data from the backend
    const response = await fetch('http://localhost:3000/api/leaderboard');
    const data = await response.json();

    if (response.ok) {
        leaderboardData = data.leaderboard;

        const tableBody = document.querySelector('tbody');
        if (!tableBody) {
            console.error('Leaderboard table not found in HTML');
            return;
        }

        // Clear existing rows
        tableBody.innerHTML = '';

        // Add rows dynamically
        leaderboardData.forEach(entry => {
            const row = document.createElement('tr');
            row.classList.add('leaderboard-row'); // Add class for CSS styling

            // Apply rank-based styles
            if (entry.rank === 1) {
                row.classList.add('gold');
            } else if (entry.rank === 2) {
                row.classList.add('silver');
            } else if (entry.rank === 3) {
                row.classList.add('bronze');
            }

            row.innerHTML = `
                <td>${entry.rank}</td>
                <td>${entry.username}</td>
                <td>${entry.level}</td>
                <td>${entry.points}</td>
                <td>${entry.language}</td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        console.error('API Error:', data.message);
        alert(data.message || 'Failed to fetch leaderboard data');
    }

    // Handle search by language
    document.getElementById('search-language').addEventListener('click', () => {
        const language = document.getElementById('language-search').value.toLowerCase().trim();
        const filteredData = leaderboardData.filter(entry => entry.language.toLowerCase().includes(language));
        updateLeaderboard(filteredData);
    });

    // Handle search by username
    document.getElementById('search-username').addEventListener('click', () => {
        const username = document.getElementById('username-search').value.toLowerCase().trim();
        const filteredData = leaderboardData.filter(entry => entry.username.toLowerCase().includes(username));
        updateLeaderboard(filteredData);
    });

    // Update leaderboard table with filtered data
    function updateLeaderboard(filteredData) {
        const tableBody = document.querySelector('tbody');
        tableBody.innerHTML = ''; // Clear the table

        // If no matching entries, show a message
        if (filteredData.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">No matching entries found</td></tr>';
            return;
        }

        // Add rows based on filtered data
        filteredData.forEach(entry => {
            const row = document.createElement('tr');
            row.classList.add('leaderboard-row');

            // Apply rank-based styles
            if (entry.rank === 1) {
                row.classList.add('gold');
            } else if (entry.rank === 2) {
                row.classList.add('silver');
            } else if (entry.rank === 3) {
                row.classList.add('bronze');
            }

            row.innerHTML = `
                <td>${entry.rank}</td>
                <td>${entry.username}</td>
                <td>${entry.level}</td>
                <td>${entry.points}</td>
                <td>${entry.language}</td>
            `;
            tableBody.appendChild(row);
        });
    }
});
