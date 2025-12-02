document.getElementById('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const form = e.target;
    const successMsg = document.getElementById('successMsg');
    
    // Validate dates
    const checkin = new Date(document.getElementById('checkin').value);
    const checkout = new Date(document.getElementById('checkout').value);
    
    if (checkout <= checkin) {
        alert('Check-out date must be after check-in date!');
        return;
    }
    
    // Show success message
    form.style.display = 'none';
    successMsg.style.display = 'block';
    
    // Reset form after 3 seconds
    setTimeout(() => {
        form.reset();
        form.style.display = 'block';
        successMsg.style.display = 'none';
    }, 3000);
});

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
document.getElementById('checkin').setAttribute('min', today);
document.getElementById('checkout').setAttribute('min', today);