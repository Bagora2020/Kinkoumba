import './style.css'

document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.getElementById('header');
  const contactForm = document.getElementById('contact-form');
  const newsletterForms = document.querySelectorAll('.newsletter-form');

  if (navToggle) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.add('show');
    });
  }

  if (navClose) {
    navClose.addEventListener('click', function() {
      navMenu.classList.remove('show');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navMenu.classList.remove('show');

      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.product-card, .value-card, .impact-card, .team-card');
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      alert(`Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.\n\nRécapitulatif:\nNom: ${data.name}\nEmail: ${data.email}\nSujet: ${data.subject}`);

      contactForm.reset();
    });
  }

  newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value;

      alert(`Merci de votre inscription ! Vous recevrez nos actualités à l'adresse: ${email}`);

      this.reset();
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');

      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Animation de compteur croissant pour les statistiques
  function animateCounter(element, target, duration = 2000) {
    let startTime = null;
    const startValue = 0;
    
    function updateCounter(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Utiliser une fonction d'easing pour un effet plus fluide
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(easeOutQuart * target);
      
      element.textContent = currentValue;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    }
    
    requestAnimationFrame(updateCounter);
  }

  // Observer pour déclencher l'animation quand la section impact est visible
  const impactObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statValues = entry.target.querySelectorAll('.stat-value');
        
        statValues.forEach(statValue => {
          const target = parseInt(statValue.getAttribute('data-target'));
          if (!isNaN(target) && !statValue.classList.contains('animated')) {
            statValue.classList.add('animated');
            // Délai progressif pour chaque compteur
            const delay = Array.from(statValues).indexOf(statValue) * 200;
            setTimeout(() => {
              animateCounter(statValue, target, 2000);
            }, delay);
          }
        });
        
        // Arrêter d'observer après l'animation
        impactObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });

  // Observer la section impact
  const impactSection = document.querySelector('.impact');
  if (impactSection) {
    impactObserver.observe(impactSection);
  }

  // Animation 3D interactive sur les cartes About
  const aboutCards = document.querySelectorAll('.about-content-card');
  aboutCards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
      card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 40px rgba(0, 0, 0, 0.15)`;

      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;
      card.style.setProperty('--mouse-x', percentX + '%');
      card.style.setProperty('--mouse-y', percentY + '%');
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
});
