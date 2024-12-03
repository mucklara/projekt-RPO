const mockDatabase = JSON.parse(localStorage.getItem('mockDatabase')) || []; // Load the database from localStorage

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        displayError('Please fill in both username and password.');
        return;
    }

    const user = mockDatabase.find((user) => user.username === username);

    if (!user) {
        displayError('User not found.');
    } else if (user.password !== password) {
        displayError('Incorrect password.');
    } else {
        alert('Login successful!');
        window.location.href = 'leaderboard.html';
    }
});

// Function to display error messages
function displayError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}
