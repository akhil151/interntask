document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (email && password) {
        if (password.length < 6) {
            alert('Password must be at least 6 characters long!');
            return;
        }
        
        // Simulate login
        document.querySelector('.login-btn').textContent = 'Logging in...';
        
        setTimeout(() => {
            alert('Login successful! Welcome back, ' + email);
            window.location.href = 'home.html';
        }, 1000);
    }
});

// Add input animations
document.querySelectorAll('.input-group input').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'scale(1)';
    });
});