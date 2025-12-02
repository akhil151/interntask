document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    setupEventListeners();
    setupPasswordToggle();
    setupPasswordStrength();
    setupFormValidation();

    function setupEventListeners() {
        // Login form
        document.getElementById('loginForm'). addEventListener('submit', handleLogin);
        
        // Register form
        document.getElementById('registerForm').addEventListener('submit', handleRegister);
        
        // Forgot password form
        document.getElementById('forgotPasswordForm').addEventListener('submit', handleForgotPassword);
        
        // Social login buttons
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', handleSocialLogin);
        });

        // Close modal when clicking outside
        document.getElementById('forgotPasswordModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeForgotPassword();
            }
        });
    }

    function setupPasswordToggle() {
        document.querySelectorAll('.password-toggle'). forEach(toggle => {
            toggle.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                const icon = this.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList. remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }

    function setupPasswordStrength() {
        const passwordInput = document.getElementById('registerPassword');
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');

        if (passwordInput && strengthBar) {
            passwordInput.addEventListener('input', function() {
                const password = this. value;
                const strength = calculatePasswordStrength(password);
                
                strengthBar.className = 'strength-bar ' + strength. class;
                strengthText.textContent = strength.text;
            });
        }
    }

    function calculatePasswordStrength(password) {
        let score = 0;
        let feedback = [];

        // Length check
        if (password.length >= 8) score += 1;
        else feedback.push('At least 8 characters');

        // Uppercase check
        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push('One uppercase letter');

        // Lowercase check
        if (/[a-z]/.test(password)) score += 1;
        else feedback.push('One lowercase letter');

        // Number check
        if (/\d/.test(password)) score += 1;
        else feedback. push('One number');

        // Special character check
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
        else feedback.push('One special character');

        const strengths = [
            { class: '', text: 'Password Strength' },
            { class: 'weak', text: 'Weak' },
            { class: 'weak', text: 'Weak' },
            { class: 'fair', text: 'Fair' },
            { class: 'good', text: 'Good' },
            { class: 'strong', text: 'Strong' }
        ];

        return strengths[score] || strengths[0];
    }

    function setupFormValidation() {
        // Real-time validation
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', validateEmail);
        });

        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs. forEach(input => {
            input.addEventListener('blur', validatePassword);
        });

        // Confirm password validation
        const confirmPassword = document.getElementById('confirmPassword');
        if (confirmPassword) {
            confirmPassword.addEventListener('input', validatePasswordMatch);
        }
    }

    function validateEmail(event) {
        const email = event.target.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const wrapper = event.target.closest('.input-wrapper');
        
        if (email && !emailRegex.test(email)) {
            showFieldError(wrapper, 'Please enter a valid email address');
            return false;
        } else {
            clearFieldError(wrapper);
            return true;
        }
    }

    function validatePassword(event) {
        const password = event. target.value;
        const wrapper = event.target.closest('.input-wrapper');
        
        if (password && password.length < 6) {
            showFieldError(wrapper, 'Password must be at least 6 characters');
            return false;
        } else {
            clearFieldError(wrapper);
            return true;
        }
    }

    function validatePasswordMatch() {
        const password = document. getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const wrapper = document.getElementById('confirmPassword'). closest('.input-wrapper');
        
        if (confirmPassword && password !== confirmPassword) {
            showFieldError(wrapper, 'Passwords do not match');
            return false;
        } else {
            clearFieldError(wrapper);
            return true;
        }
    }

    function showFieldError(wrapper, message) {
        clearFieldError(wrapper);
        wrapper.style.borderColor = '#dc3545';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv. style.cssText = `
            color: #dc3545;
            font-size: 12px;
            margin-top: 5px;
            animation: slideDown 0.3s ease;
        `;
        errorDiv.textContent = message;
        
        wrapper.parentNode.appendChild(errorDiv);
    }

    function clearFieldError(wrapper) {
        wrapper.style.borderColor = '#e0e0e0';
        const existingError = wrapper.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    function handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        const submitBtn = event.target. querySelector('. auth-btn');
        
        // Basic validation
        if (!email || ! password) {
            showMessage('Please fill in all fields', 'error');
            shakeForm();
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Demo credentials for testing
            if (email === 'demo@wanderlust.com' && password === 'password123') {
                showMessage('Login successful!  Redirecting...', 'success');
                
                if (rememberMe) {
                    localStorage.setItem('wanderlust_user', JSON.stringify({
                        email: email,
                        name: 'Demo User'
                    }));
                }

                setTimeout(() => {
                    window. location.href = '../index.html';
                }, 2000);
            } else {
                showMessage('Invalid email or password', 'error');
                shakeForm();
            }
            
            submitBtn.classList.remove('loading');
            submitBtn. disabled = false;
        }, 2000);
    }

    function handleRegister(event) {
        event.preventDefault();
        
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('registerEmail'). value,
            phone: document.getElementById('phone').value,
            password: document.getElementById('registerPassword').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            agreeTerms: document.getElementById('agreeTerms').checked,
            newsletter: document.getElementById('newsletter').checked
        };
        
        const submitBtn = event.target.querySelector('.auth-btn');

        // Validation
        if (!validateRegistrationForm(formData)) {
            shakeForm();
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn. disabled = true;

        // Simulate API call
        setTimeout(() => {
            showMessage('Account created successfully! Please check your email for verification.', 'success');
            
            // Auto switch to login after success
            setTimeout(() => {
                switchToLogin();
                document.getElementById('loginEmail').value = formData.email;
                showMessage('You can now login with your credentials', 'success');
            }, 3000);
            
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }, 2000);
    }

    function validateRegistrationForm(data) {
        if (!data.firstName || !data. lastName || !data.email || ! data.phone || !data.password) {
            showMessage('Please fill in all required fields', 'error');
            return false;
        }

        if (data.password !== data.confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return false;
        }

        if (data.password.length < 6) {
            showMessage('Password must be at least 6 characters', 'error');
            return false;
        }

        if (!data.agreeTerms) {
            showMessage('Please accept the Terms & Conditions', 'error');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex. test(data.email)) {
            showMessage('Please enter a valid email address', 'error');
            return false;
        }

        return true;
    }

    function handleForgotPassword(event) {
        event.preventDefault();
        
        const email = document.getElementById('forgotEmail').value;
        const submitBtn = event.target.querySelector('.auth-btn');
        
        if (!email) {
            showMessage('Please enter your email address', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex. test(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            showMessage('Password reset link sent to your email! ', 'success');
            closeForgotPassword();
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }, 2000);
    }

    function handleSocialLogin(event) {
        const provider = event.currentTarget.classList. contains('google') ? 'Google' : 
                        event.currentTarget.classList.contains('facebook') ? 'Facebook' : 'Twitter';
        
        showMessage(`${provider} login is not implemented in this demo`, 'warning');
    }

    function showMessage(text, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('. message');
        existingMessages. forEach(msg => msg.remove());

        const message = document.createElement('div');
        message.className = `message ${type}`;
        message. innerHTML = `
            <i class="fas ${getMessageIcon(type)}"></i>
            <span>${text}</span>
        `;

        const activeForm = document.querySelector('.auth-form. active');
        activeForm. insertBefore(message, activeForm. firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }

    function getMessageIcon(type) {
        switch(type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    function shakeForm() {
        const activeForm = document.querySelector('.auth-form.active');
        activeForm.classList.add('shake');
        setTimeout(() => {
            activeForm.classList.remove('shake');
        }, 500);
    }

    // Global functions for form switching
    window.switchToLogin = function() {
        document.querySelector('.login-form').classList.add('active');
        document.querySelector('.register-form').classList.remove('active');
        clearMessages();
    };

    window. switchToRegister = function() {
        document.querySelector('.register-form').classList.add('active');
        document.querySelector('.login-form').classList.remove('active');
        clearMessages();
    };

    window.showForgotPassword = function() {
        document.getElementById('forgotPasswordModal').style. display = 'block';
    };

    window.closeForgotPassword = function() {
        document.getElementById('forgotPasswordModal').style.display = 'none';
        document.getElementById('forgotPasswordForm').reset();
    };

    function clearMessages() {
        const messages = document.querySelectorAll('. message');
        messages.forEach(msg => msg.remove());
    }

    // Check for existing user session
    const savedUser = localStorage.getItem('wanderlust_user');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        showMessage(`Welcome back, ${user. name}!`, 'success');
    }
});