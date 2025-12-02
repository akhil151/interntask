document.addEventListener('DOMContentLoaded', function() {
    let currentStep = 1;
    let selectedDestination = null;
    let selectedPackage = null;
    let bookingData = {
        destination: null,
        destinationPrice: 0,
        checkin: null,
        checkout: null,
        adults: 2,
        children: 0,
        package: null,
        packageMultiplier: 1,
        name: '',
        email: '',
        phone: '',
        specialRequests: ''
    };

    // Initialize
    updateStepVisibility();
    updateNavigationButtons();
    setupEventListeners();
    
    // Set minimum date to today
    const today = new Date(). toISOString().split('T')[0];
    document.getElementById('checkin').setAttribute('min', today);
    document.getElementById('checkout').setAttribute('min', today);

    function setupEventListeners() {
        // Destination selection
        document.querySelectorAll('.destination-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.destination-option').forEach(opt => 
                    opt.classList.remove('selected'));
                this.classList.add('selected');
                
                selectedDestination = this.dataset.destination;
                bookingData.destination = this.querySelector('h3').textContent;
                bookingData.destinationPrice = parseFloat(this.dataset. price);
                
                updatePriceCalculator();
            });
        });

        // Package selection
        document.querySelectorAll('.package-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.package-option').forEach(opt => 
                    opt.classList.remove('selected'));
                this.classList. add('selected');
                
                selectedPackage = this.dataset. package;
                bookingData. package = this.querySelector('h4').textContent;
                bookingData.packageMultiplier = parseFloat(this.dataset.multiplier);
                
                updatePriceCalculator();
            });
        });

        // Number input controls
        document.querySelectorAll('.number-input'). forEach(container => {
            const input = container.querySelector('input');
            const minusBtn = container.querySelector('. minus');
            const plusBtn = container.querySelector('.plus');

            minusBtn.addEventListener('click', () => {
                const currentValue = parseInt(input.value);
                const minValue = parseInt(input.getAttribute('min')) || 0;
                if (currentValue > minValue) {
                    input.value = currentValue - 1;
                    updateBookingData();
                }
            });

            plusBtn.addEventListener('click', () => {
                const currentValue = parseInt(input.value);
                const maxValue = parseInt(input.getAttribute('max')) || 999;
                if (currentValue < maxValue) {
                    input.value = currentValue + 1;
                    updateBookingData();
                }
            });

            input.addEventListener('change', updateBookingData);
        });

        // Date inputs
        document.getElementById('checkin').addEventListener('change', function() {
            const checkinDate = new Date(this.value);
            const checkoutInput = document.getElementById('checkout');
            
            // Set minimum checkout date to day after checkin
            const minCheckout = new Date(checkinDate);
            minCheckout. setDate(minCheckout.getDate() + 1);
            checkoutInput.setAttribute('min', minCheckout.toISOString(). split('T')[0]);
            
            updateBookingData();
        });

        document.getElementById('checkout').addEventListener('change', updateBookingData);

        // Personal info inputs
        ['name', 'email', 'phone', 'special-requests'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element. addEventListener('input', updateBookingData);
            }
        });

        // Newsletter form (if exists)
        const newsletterForm = document.querySelector('. newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e. preventDefault();
                alert('Thank you for subscribing! ');
                e.target.reset();
            });
        }
    }

    function updateBookingData() {
        bookingData.checkin = document.getElementById('checkin').value;
        bookingData.checkout = document.getElementById('checkout').value;
        bookingData.adults = parseInt(document.getElementById('adults').value);
        bookingData.children = parseInt(document.getElementById('children').value);
        bookingData.name = document.getElementById('name').value;
        bookingData.email = document.getElementById('email').value;
        bookingData.phone = document.getElementById('phone').value;
        bookingData.specialRequests = document.getElementById('special-requests').value;
        
        updatePriceCalculator();
    }

    function updatePriceCalculator() {
        const calculator = document.querySelector('.price-calculator');
        
        if (bookingData.destination) {
            calculator.classList.add('show');
            
            const basePrice = bookingData.destinationPrice;
            const multiplier = bookingData.packageMultiplier;
            const guests = bookingData.adults + bookingData.children;
            const nights = calculateNights();
            const total = basePrice * multiplier * guests * Math.max(nights, 1);

            document.getElementById('calc-base').textContent = `$${basePrice}`;
            document.getElementById('calc-multiplier').textContent = `${multiplier}x`;
            document.getElementById('calc-guests').textContent = guests;
            document.getElementById('calc-nights').textContent = nights || 1;
            document.getElementById('calc-total').textContent = `$${total. toLocaleString()}`;
        } else {
            calculator.classList.remove('show');
        }
    }

    function calculateNights() {
        if (bookingData.checkin && bookingData.checkout) {
            const checkin = new Date(bookingData. checkin);
            const checkout = new Date(bookingData.checkout);
            const diffTime = checkout - checkin;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return Math.max(diffDays, 1);
        }
        return 1;
    }

    window.changeStep = function(direction) {
        const totalSteps = 4;
        
        if (direction === 1) {
            // Validate current step
            if (! validateStep(currentStep)) {
                return;
            }
            
            if (currentStep < totalSteps) {
                currentStep++;
            }
        } else if (direction === -1) {
            if (currentStep > 1) {
                currentStep--;
            }
        }

        updateStepVisibility();
        updateNavigationButtons();
        
        if (currentStep === 4) {
            updateSummary();
        }
        
        // Animate step transition
        document.querySelector('.form-step. active').style.animation = 'fadeInSlide 0.5s ease-in-out';
    };

    function validateStep(step) {
        switch(step) {
            case 1:
                if (!selectedDestination) {
                    showAlert('Please select a destination');
                    return false;
                }
                break;
            case 2:
                const checkin = document.getElementById('checkin').value;
                const checkout = document.getElementById('checkout').value;
                
                if (!checkin || !checkout) {
                    showAlert('Please select check-in and check-out dates');
                    return false;
                }
                
                if (new Date(checkout) <= new Date(checkin)) {
                    showAlert('Check-out date must be after check-in date');
                    return false;
                }
                
                if (! selectedPackage) {
                    showAlert('Please select a tour package');
                    return false;
                }
                break;
            case 3:
                const name = document.getElementById('name').value. trim();
                const email = document.getElementById('email').value.trim();
                const phone = document. getElementById('phone').value.trim();
                
                if (!name || !email || !phone) {
                    showAlert('Please fill in all required fields');
                    return false;
                }
                
                if (! isValidEmail(email)) {
                    showAlert('Please enter a valid email address');
                    return false;
                }
                break;
        }
        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showAlert(message) {
        // Create and show custom alert
        const alert = document.createElement('div');
        alert.className = 'custom-alert';
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10001;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;
        alert.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; margin-left: auto;">×</button>
            </div>
        `;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }

    function updateStepVisibility() {
        document.querySelectorAll('. form-step').forEach(step => {
            step.classList.remove('active');
        });
        
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 <= currentStep);
        });
        
        document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
    }

    function updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const confirmBtn = document.getElementById('confirmBtn');

        prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
        nextBtn.style.display = currentStep < 4 ? 'block' : 'none';
        confirmBtn.style.display = currentStep === 4 ? 'block' : 'none';
    }

    function updateSummary() {
        updateBookingData();
        
        const nights = calculateNights();
        const guests = bookingData.adults + bookingData.children;
        const total = bookingData.destinationPrice * bookingData.packageMultiplier * guests * Math.max(nights, 1);

        document.getElementById('summary-destination').textContent = bookingData. destination || '-';
        document.getElementById('summary-dates').textContent = 
            bookingData.checkin && bookingData.checkout 
                ? `${formatDate(bookingData.checkin)} - ${formatDate(bookingData.checkout)} (${nights} nights)`
                : '-';
        document.getElementById('summary-guests').textContent = 
            `${bookingData.adults} Adult(s)` + (bookingData.children > 0 ? `, ${bookingData.children} Children` : '');
        document. getElementById('summary-package').textContent = bookingData.package || '-';
        document.getElementById('summary-total').textContent = `$${total.toLocaleString()}`;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    window.confirmBooking = function() {
        if (! validateStep(3)) {
            return;
        }

        // Generate booking ID
        const bookingId = 'WL' + Math.random().toString(36).substr(2, 9). toUpperCase();
        document.getElementById('bookingId').textContent = bookingId;

        // Show success modal
        document.getElementById('successModal').style.display = 'block';
        
        // Add celebration animation
        createConfetti();
    };

    window.closeModal = function() {
        document. getElementById('successModal').style.display = 'none';
        
        // Reset form
        currentStep = 1;
        selectedDestination = null;
        selectedPackage = null;
        bookingData = {
            destination: null,
            destinationPrice: 0,
            checkin: null,
            checkout: null,
            adults: 2,
            children: 0,
            package: null,
            packageMultiplier: 1,
            name: '',
            email: '',
            phone: '',
            specialRequests: ''
        };
        
        // Reset form inputs
        document.querySelectorAll('input, textarea').forEach(input => {
            if (input.type !== 'number') {
                input.value = '';
            } else if (input.id === 'adults') {
                input.value = 2;
            } else if (input.id === 'children') {
                input.value = 0;
            }
        });
        
        document.querySelectorAll('. selected').forEach(el => {
            el.classList. remove('selected');
        });
        
        updateStepVisibility();
        updateNavigationButtons();
        document.querySelector('.price-calculator').classList.remove('show');
    };

    function createConfetti() {
        const colors = ['#667eea', '#764ba2', '#ffd700', '#28a745', '#dc3545'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    top: -10px;
                    left: ${Math.random() * 100}%;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    z-index: 10002;
                    animation: confettifall ${2 + Math.random() * 3}s linear forwards;
                    transform: rotate(${Math.random() * 360}deg);
                `;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.remove();
                    }
                }, 5000);
            }, i * 50);
        }
    }

    // Add CSS for confetti animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettifall {
            0% {
                transform: translateY(-10px) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
        @keyframes slideInRight {
            from {
                transform: translateX(300px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head. appendChild(style);

    // Animate elements on scroll
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('. animate-on-scroll').forEach(el => {
        animateOnScroll.observe(el);
    });
});