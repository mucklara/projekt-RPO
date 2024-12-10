document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
        username: document.getElementById('username').value.trim(),
        password: document.getElementById('password').value.trim()
    };

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (response.ok) {
            alert('Login successful!');
            window.location.href = 'leaderboard.html';
        } else {
            displayError(data.message || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        displayError('An error occurred. Please try again later.');
    }
});

// Funkcija za prikaz napak
function displayError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}
