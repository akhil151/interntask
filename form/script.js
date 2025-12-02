const form = document.getElementById('jobForm');
const message = document.getElementById('message');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get all form values
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const dob = document.getElementById('dob').value;
    const position = document.getElementById('position').value;
    const experience = document.querySelector('input[name="experience"]:checked');
    const skills = document.querySelectorAll('input[name="skills"]:checked');
    const resume = document.getElementById('resume').files[0];
    
    // Simple validation
    if (!fullName || !email || !phone || !dob || !position) {
        showMessage('Please fill in all required fields!', 'error');
        return;
    }
    
    if (!experience) {
        showMessage('Please select your years of experience!', 'error');
        return;
    }
    
    if (skills.length === 0) {
        showMessage('Please select at least one skill!', 'error');
        return;
    }
    
    if (!resume) {
        showMessage('Please upload your resume!', 'error');
        return;
    }
    
    // If all validations pass
    showMessage('Application submitted successfully!', 'success');
    form.reset();
});

function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
    message.style.display = 'block';
    
    setTimeout(() => {
        message.style.display = 'none';
    }, 5000);
}