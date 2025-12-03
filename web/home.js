document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.feature-card, .dest-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-in forwards';
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => observer.observe(card));
});