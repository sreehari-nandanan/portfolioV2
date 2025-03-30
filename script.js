// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when a link is clicked
    const navLinksItems = document.querySelectorAll('.nav-links li a');
    navLinksItems.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Scroll to top button
    const scrollTopBtn = document.createElement('div');
    scrollTopBtn.classList.add('scroll-top');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -100px 0px"
    };
    
    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);
    
    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });
    
    // Animate the counter numbers in about section
    const stats = document.querySelectorAll('.count');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        let count = 0;
        const increment = target / 30; // Adjust speed of counting
        
        const updateCount = () => {
            if (count < target) {
                count += increment;
                stat.textContent = Math.floor(count);
                setTimeout(updateCount, 50);
            } else {
                stat.textContent = target;
            }
        };
        
        // Start animation when element comes into view
        const statObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCount();
                    statObserver.unobserve(entry.target);
                }
            });
        });
        
        statObserver.observe(stat);
    });
    
    // Progress bar animation in skills section
    const progressBars = document.querySelectorAll('.progress-bar');
    
    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = "0";
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 200);
                progressObserver.unobserve(entry.target);
            }
        });
    });
    
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
    
    // Achievements auto slide
    setupAchievementsSlider();
    
    function setupAchievementsSlider() {
        const achievementsContainer = document.querySelector('.achievements-container');
        if (!achievementsContainer) return;
        
        // Create a wrapper for the achievements
        const wrapper = document.createElement('div');
        wrapper.className = 'achievements-wrapper';
        
        // Move all achievements into the wrapper
        const achievements = Array.from(achievementsContainer.querySelectorAll('.achievement'));
        achievements.forEach(ach => wrapper.appendChild(ach));
        
        // Add wrapper to container
        achievementsContainer.appendChild(wrapper);
        
        // Create control dots
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'achievement-controls';
        
        const totalSlides = Math.ceil(achievements.length / 3); // 3 achievements per slide on desktop
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'control-btn' + (i === 0 ? ' active' : '');
            dot.dataset.slide = i;
            dot.addEventListener('click', () => {
                moveToSlide(i);
                resetAutoSlideTimer();
            });
            controlsDiv.appendChild(dot);
        }
        
        achievementsContainer.parentNode.appendChild(controlsDiv);
        
        // Function to move to a specific slide
        let currentSlide = 0;
        let autoSlideTimer;
        
        function moveToSlide(index) {
            if (window.innerWidth > 768) {
                // On desktop: 3 achievements per view
                wrapper.style.transform = `translateX(-${index * 100}%)`;
            } else if (window.innerWidth > 480) {
                // On tablet: 2 achievements per view
                const slideWidth = (achievements.length / 2) * 100;
                wrapper.style.transform = `translateX(-${index * (slideWidth / totalSlides)}%)`;
            } else {
                // On mobile: 1 achievement per view
                const slideWidth = achievements.length * 100;
                wrapper.style.transform = `translateX(-${index * (slideWidth / totalSlides)}%)`;
            }
            
            // Update active dot
            document.querySelectorAll('.control-btn').forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            currentSlide = index;
        }
        
        // Auto slide functionality
        function startAutoSlide() {
            autoSlideTimer = setInterval(() => {
                let nextSlide = (currentSlide + 1) % totalSlides;
                moveToSlide(nextSlide);
            }, 3000); // Change slide every 5 seconds
        }
        
        function resetAutoSlideTimer() {
            clearInterval(autoSlideTimer);
            startAutoSlide();
        }
        
        // Start auto slide
        startAutoSlide();
        
        // Pause auto slide on hover
        achievementsContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSlideTimer);
        });
        
        achievementsContainer.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
        
        // Update on window resize
        window.addEventListener('resize', () => {
            moveToSlide(currentSlide);
        });
    }
    
    // Form submission handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Here you would normally handle the form submission with AJAX
            // For now, just show a success message
            alert(`Thanks for reaching out, ${name}! I'll get back to you soon.`);
            
            // Reset the form
            contactForm.reset();
        });
    }
});
