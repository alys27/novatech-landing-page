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
    console.log('scroll oldu, scrollY:', window.scrollY);

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