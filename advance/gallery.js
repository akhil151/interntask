document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery
    const galleryGrid = document. querySelector('.gallery-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    
    let currentImageIndex = 0;
    let filteredItems = Array.from(galleryItems);

    // Initialize
    setupFilterButtons();
    setupLightbox();
    setupKeyboardNavigation();
    animateGalleryOnLoad();

    function setupFilterButtons() {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList. add('active');
                
                // Filter gallery items
                const filter = button.dataset.filter;
                filterGallery(filter);
            });
        });
    }

    function filterGallery(filter) {
        galleryGrid.classList.add('filtering');
        
        setTimeout(() => {
            galleryItems.forEach((item, index) => {
                const category = item.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                    // Animate in
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, index * 50);
                } else {
                    item.classList.add('hidden');
                    item.style. opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });

            // Update filtered items array for lightbox navigation
            filteredItems = Array. from(galleryItems). filter(item => 
                filter === 'all' || item. dataset.category === filter
            );

            galleryGrid.classList.remove('filtering');
        }, 100);
    }

    function setupLightbox() {
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentImageIndex = filteredItems.indexOf(item);
                openLightbox(item);
            });
        });

        // Close lightbox
        document.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
        
        // Navigation buttons
        document.querySelector('.prev-btn').addEventListener('click', showPreviousImage);
        document.querySelector('.next-btn').addEventListener('click', showNextImage);
        
        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    function openLightbox(item) {
        const img = item.querySelector('img');
        const title = item.querySelector('h3').textContent;
        const description = item.querySelector('p').textContent;
        
        lightboxImg.src = img. src;
        lightboxImg.alt = img.alt;
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
        
        lightbox. style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Add animation class
        lightboxImg.style.animation = 'zoomIn 0.3s ease';
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + filteredItems. length) % filteredItems.length;
        updateLightboxImage();
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % filteredItems.length;
        updateLightboxImage();
    }

    function updateLightboxImage() {
        const currentItem = filteredItems[currentImageIndex];
        const img = currentItem.querySelector('img');
        const title = currentItem.querySelector('h3').textContent;
        const description = currentItem.querySelector('p').textContent;
        
        // Fade out
        lightboxImg.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxTitle.textContent = title;
            lightboxDescription.textContent = description;
            
            // Fade in
            lightboxImg.style.opacity = '1';
            lightboxImg.style.animation = 'zoomIn 0.3s ease';
        }, 150);
    }

    function setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'block') {
                switch(e.key) {
                    case 'Escape':
                        closeLightbox();
                        break;
                    case 'ArrowLeft':
                        showPreviousImage();
                        break;
                    case 'ArrowRight':
                        showNextImage();
                        break;
                }
            }
        });
    }

    function animateGalleryOnLoad() {
        // Stagger animation of gallery items
        galleryItems.forEach((item, index) => {
            item.style.opacity = '0';
            item. style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries. forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add bounce animation to filter buttons
                if (entry.target.classList.contains('gallery-filters')) {
                    const buttons = entry.target.querySelectorAll('.filter-btn');
                    buttons.forEach((btn, index) => {
                        setTimeout(() => {
                            btn. style.animation = 'bounce 0.6s ease';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe gallery section
    const gallerySection = document.querySelector('. gallery-section');
    if (gallerySection) {
        observer.observe(gallerySection);
    }

    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        startX = e.touches[0]. clientX;
    });

    lightbox.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    });

    lightbox.addEventListener('touchend', () => {
        const difference = startX - endX;
        
        if (Math.abs(difference) > 50) {
            if (difference > 0) {
                showNextImage();
            } else {
                showPreviousImage();
            }
        }
    });

    // Lazy loading for images (optional enhancement)
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    // If using lazy loading, replace src with data-src in HTML
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
});