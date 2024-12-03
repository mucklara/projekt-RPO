const mockDatabase = JSON.parse(localStorage.getItem('mockDatabase')) || [];

document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const surname = document.getElementById('surname').value.trim();
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validation checks
    if (!name || !surname || !email || !username || !password) {
        alert('Please fill in all fields.');
        return;
    }

    if (!isValidUsername(username)) {
        alert('Username must be at least 5 characters long.');
        return;
    }

    if (!isValidPassword(password)) {
        alert('Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.');
        return;
    }

    // Simulated user registration
    if (mockDatabase.some(user => user.username === username)) {
        alert('Username already exists.');
        return;
    }

    mockDatabase.push({ name, surname, email, username, password });
    localStorage.setItem('mockDatabase', JSON.stringify(mockDatabase));

    alert('Registration successful!');
    window.location.href = 'login.html';
});

// Username validation
function isValidUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9]{5,}$/; // Alphanumeric, minimum 5 characters
    return usernameRegex.test(username);
}

// Password validation
function isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.@$!%*?&#])[A-Za-z\d.@$!%*?&#]{8,}$/;
    const result = passwordRegex.test(password);
    console.log("Password validation:", password, result); // Debugging
    return result;
}

