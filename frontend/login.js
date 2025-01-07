// Select the login form and error message element
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

// Event listener for form submission
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get user inputs
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Send a POST request to the backend login endpoint
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: username, password }), // Assuming "email" is the username
        });

        const data = await response.json();

        // Check if login was successful
        if (response.ok) {
            // Login successful
            alert('Login successful!');

            // Store user data in localStorage
            localStorage.setItem('userId', data.user.user_id);
            localStorage.setItem('username', data.user.username);
            localStorage.setItem('email', data.user.email);
            localStorage.setItem('avatar', data.user.avatar || 'default.png'); // Default avatar if not provided

            // Redirect to the dashboard page
            window.location.href = '/frontend/dashboard.html';
        } else {
            // Display the error message if login failed
            errorMessage.style.display = 'block';
            errorMessage.textContent = data.message || 'Login failed. Please try again.';
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'An error occurred. Please try again later.';
    }
});

async function loginUser(username, password) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed. Please check your credentials.');
        }

        const userData = await response.json(); // Assuming userData includes the username

        // Save the username to localStorage
        localStorage.setItem('userId', userData.user_id);
        localStorage.setItem('username', userData.username); // Ensure the username is saved here
        localStorage.setItem('avatar', userData.avatar || 'default-avatar.png'); // Default avatar if none provided
        localStorage.setItem('email', userData.email); // Optional: store email
        localStorage.setItem('registrationDate', userData.registrationDate); // Optional: store registration date

        // Redirect to dashboard after successful login
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Login error:', error);
    }
}

