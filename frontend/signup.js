// Select the signup form
const signupForm = document.getElementById('signup-form');

// Helper function to display validation messages
function displayError(inputElement, message) {
    let errorElement = inputElement.previousElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('div');
        errorElement.classList.add('error-message');
        inputElement.parentElement.insertBefore(errorElement, inputElement);
    }
    errorElement.textContent = message;
}

// Helper function to clear validation messages
function clearError(inputElement) {
    const errorElement = inputElement.previousElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
    }
}

// Event listener for form submission
signupForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('email');
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    let isValid = true;

    // Clear previous error messages
    clearError(email);
    clearError(username);
    clearError(password);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        displayError(email, 'Please enter a valid email (e.g., user@example.com).');
        isValid = false;
    }

    // Validate email uniqueness
    try {
        const emailCheckResponse = await fetch(`http://localhost:3000/api/auth/check-email?email=${email.value}`, {
            method: 'GET',  // GET request to check if email is available
        });
        const emailCheckResult = await emailCheckResponse.json();

        if (!emailCheckResponse.ok || emailCheckResult.message === 'Email is already taken') {
            displayError(email, 'This email is already taken. Please choose another one or go to the log in page.');
            isValid = false;
        }
    } catch (error) {
        console.error('Error checking email uniqueness:', error);
        displayError(email, 'Error checking email. Please try again later.');
        isValid = false;
    }

    // Validate username uniqueness
    try {
        const usernameCheckResponse = await fetch(`http://localhost:3000/api/auth/check-username?username=${username.value}`, {
            method: 'GET',  // GET request to check if username is available
        });

        const usernameCheckResult = await usernameCheckResponse.json();

        if (!usernameCheckResponse.ok || usernameCheckResult.message === 'Username already taken') {
            displayError(username, 'This username is already taken. Please choose another one.');
            isValid = false;
        }
    } catch (error) {
        console.error('Error checking username uniqueness:', error);
        displayError(username, 'Error checking username. Please try again later.');
        isValid = false;
    }

    // Validate password length
    if (password.value.length < 3 || password.value.length > 25) {
        displayError(password, 'Password must be between 3 and 25 characters long.');
        isValid = false;
    }

    if (!isValid) return;

    try {
        // Send a POST request to the backend register endpoint
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username.value,
                email: email.value,
                password: password.value,
                avatar: null, // Optional, add avatar input later if needed
            }),
        });

        const data = await response.json();

        if (response.ok) {
            // Registration successful
            alert('Registration successful! Please log in.');
            // Redirect to the login page
            window.location.href = 'login.html';
        } else {
            // Display the error message
            alert(data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
});
