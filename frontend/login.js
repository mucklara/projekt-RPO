// Select the login form and error message element
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

// Event listener for form submission
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get user inputs
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Send a POST request to the backend login endpoint
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Login successful
            alert('Login successful!');
            console.log('User details:', data.user);
            // Redirect to another page after successful login
            window.location.href = 'dashboard.html'; // Replace with your dashboard page
        } else {
            // Display the error message
            errorMessage.style.display = 'block';
            errorMessage.textContent = data.message || 'Login failed. Please try again.';
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'An error occurred. Please try again later.';
    }
});
