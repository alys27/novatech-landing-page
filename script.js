const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__menu');
navToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});


const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        targetSection.scrollIntoView({ behavior: 'smooth' });

        navMenu.classList.remove('active');
    });
});

const header = document.querySelector('.header');
const scrollTopBtn = document.querySelector('#scrollTop');
const sections = document.querySelectorAll('main section');

window.addEventListener('scroll', function() {

    // 1. Header rəngi
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // 2. Scroll-to-top düyməsi
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }

    // 3. Aktiv nav link
    let current = '';
    sections.forEach(function(section) {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(function(link) {
        link.classList.remove('nav__link--active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('nav__link--active');
        }
    });
});

scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const contactForm = document.querySelector('.contact__form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    let isValid = true;

    const nameInput = document.querySelector('#name');
    const nameError = document.querySelector('#name-error');

    if (nameInput.value.trim() === '') {
        nameError.textContent = 'Ad və soyad boş qala bilməz';
        isValid = false;
    } else {
        nameError.textContent = '';
    }

    const emailInput = document.querySelector('#email');
    const emailError = document.querySelector('#email-error');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailInput.value.trim() === '') {
        emailError.textContent = 'Email boş qala bilməz';
        isValid = false;
    } else if (!emailPattern.test(emailInput.value.trim())) {
        emailError.textContent = 'Düzgün email formatı daxil edin (məs. ad@domain.com)';
        isValid = false;
    } else {
        emailError.textContent = '';
    }

    const messageInput = document.querySelector('#message');
    const messageError = document.querySelector('#message-error');

    if (messageInput.value.trim() === '') {
        messageError.textContent = 'Mesaj boş qala bilməz';
        isValid = false;
    } else {
        messageError.textContent = '';
    }

    if (isValid) {
    const successMessage = document.querySelector('#successMessage');
    successMessage.classList.add('show');
    contactForm.reset();

    setTimeout(function() {
        successMessage.classList.remove('show');
    }, 4000);
}
});

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(function(el) {
    revealObserver.observe(el);
});

const canvas = document.querySelector('#particleCanvas');
const ctx = canvas.getContext('2d');
const hero = document.querySelector('.hero');

function resizeCanvas() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
for (let i = 0; i < 40; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4
    });
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function(p) {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(250, 246, 241, 0.5)';
        ctx.fill();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();
 