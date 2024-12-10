// Select the signup form
const signupForm = document.getElementById('signup-form');

// Event listener for form submission
signupForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

  
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Send a POST request to the backend register endpoint
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username,
                email,
                password,
                avatar: null // Optional, add avatar input later if needed
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
