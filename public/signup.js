document.getElementById('signup-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Preverjanje uporabniškega imena
    if (!isValidUsername(username)) {
        showError('Username must be at least 5 characters long and contain only letters and numbers.');
        return;
    }

    // Preverjanje gesla
    if (!isValidPassword(password)) {
        showError('Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.');
        return;
    }

    const formData = {
        username,
        email,
        password,
    };

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful!');
            window.location.href = 'login.html';
        } else {
            showError(data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        showError('An error occurred. Please try again later.');
    }
});

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Username validation
function isValidUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9]{5,}$/; // Alphanumeric, minimum 5 characters
    return usernameRegex.test(username);
}

// Password validation
function isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.@$!%*?&#])[A-Za-z\d.@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
}
