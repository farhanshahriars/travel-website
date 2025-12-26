document.addEventListener('DOMContentLoaded', function() {

    
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    const totalSlides = slides.length;

    
    function showSlide(n) {
        
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        
        if (n >= totalSlides) currentSlide = 0;
        else if (n < 0) currentSlide = totalSlides - 1;
        else currentSlide = n;

        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    
    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    
    let slideInterval = setInterval(nextSlide, 5000);

    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        clearInterval(slideInterval); 
        slideInterval = setInterval(nextSlide, 5000);
    });
    prevBtn.addEventListener('click', () => {
        prevSlide();
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    });

    
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            showSlide(slideIndex);
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });
    });

    
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.padding = '15px 5%';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.padding = '20px 5%';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
    });

    
    const currentYearElement = document.getElementById('currentYear');
    if(currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==================== DROPDOWN FUNCTIONALITY ====================
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // For desktop - hover
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        // Desktop hover
        dropdown.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                dropdown.classList.add('active');
            }
        });
        
        dropdown.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                dropdown.classList.remove('active');
            }
        });
        
        // Mobile touch/click
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                
                // Close other dropdowns
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
            }
        });
    });
    
    // Close dropdowns when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // ==================== MOBILE HAMBURGER MENU ====================
    // Create hamburger menu for mobile
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    
    // Check if we need a hamburger (on mobile)
    if (window.innerWidth <= 768) {
        // Create hamburger button
        const hamburger = document.createElement('div');
        hamburger.className = 'hamburger';
        hamburger.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        // Insert hamburger before the nav links
        navbar.insertBefore(hamburger, navLinks);
        
        // Toggle mobile menu
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Close dropdowns when closing menu
            if (!navLinks.classList.contains('active')) {
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                
                // Close dropdowns
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            });
        });
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        const hamburger = document.querySelector('.hamburger');
        
        if (window.innerWidth > 768) {
            // Remove hamburger if it exists
            if (hamburger) {
                hamburger.remove();
            }
            // Ensure nav links are visible
            navLinks.style.display = 'flex';
            navLinks.classList.remove('active');
            
            // Close all dropdowns
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        } else {
            // Add hamburger if it doesn't exist
            if (!hamburger && navLinks) {
                const newHamburger = document.createElement('div');
                newHamburger.className = 'hamburger';
                newHamburger.innerHTML = `
                    <span></span>
                    <span></span>
                    <span></span>
                `;
                navbar.insertBefore(newHamburger, navLinks);
                navLinks.style.display = 'none';
                
                // Add click event to new hamburger
                newHamburger.addEventListener('click', function() {
                    this.classList.toggle('active');
                    navLinks.classList.toggle('active');
                });
            }
        }
    });
});