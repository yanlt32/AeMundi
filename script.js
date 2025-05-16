document.addEventListener('DOMContentLoaded', () => {
  // Initialize EmailJS with your User ID
  emailjs.init('wsvc4Dlnoa4wsx3xJ');

  // Hamburger menu functionality
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
  });

  // Smooth scroll for navigation links
  nav.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      hamburger.classList.remove('active');
      nav.classList.remove('active');

      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        smoothScrollTo(targetPosition, 1200);
      }
    });
  });

  // Custom smooth scroll function
  function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutQuad(progress);

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    requestAnimationFrame(animation);
  }

  // Generic Carousel functionality
  function initCarousel(carouselSelector) {
    const carousel = document.querySelector(carouselSelector);
    if (!carousel) return;

    const carouselInner = carousel.querySelector('.carousel-inner');
    const carouselItems = carousel.querySelectorAll('.carousel-item');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    let currentIndex = 0;
    let isTransitioning = false;

    function showSlide(index) {
      if (isTransitioning) return;
      isTransitioning = true;

      carouselItems.forEach(item => item.classList.remove('active'));
      carouselItems[index].classList.add('active');
      carouselInner.style.transform = `translateX(-${index * 100}%)`;

      setTimeout(() => {
        isTransitioning = false;
      }, 300);
    }

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === 0) ? carouselItems.length - 1 : currentIndex - 1;
        showSlide(currentIndex);
      });

      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === carouselItems.length - 1) ? 0 : currentIndex + 1;
        showSlide(currentIndex);
      });

      let autoSlide = setInterval(() => {
        currentIndex = (currentIndex === carouselItems.length - 1) ? 0 : currentIndex + 1;
        showSlide(currentIndex);
      }, 5000);

      carousel.addEventListener('mouseenter', () => clearInterval(autoSlide));
      carousel.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => {
          currentIndex = (currentIndex === carouselItems.length - 1) ? 0 : currentIndex + 1;
          showSlide(currentIndex);
        }, 5000);
      });
    }

    showSlide(currentIndex);
  }

  // Initialize carousels only on mobile/tablet
  if (window.innerWidth <= 768) {
    initCarousel('#eventos .carousel'); // Events carousel
    initCarousel('#feedbacks .carousel'); // Testimonials carousel
  }

  // Re-initialize carousel on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      initCarousel('#eventos .carousel');
      initCarousel('#feedbacks .carousel');
    } else {
      // Reset carousel styles on desktop
      const eventosCarousel = document.querySelector('#eventos .carousel');
      if (eventosCarousel) {
        const carouselInner = eventosCarousel.querySelector('.carousel-inner');
        carouselInner.style.transform = 'translateX(0)';
        eventosCarousel.querySelectorAll('.carousel-item').forEach(item => {
          item.style.opacity = '1';
        });
      }
    }
  });

  // Form submission with EmailJS
  const form = document.getElementById('contato-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
      nome: document.querySelector('input[name="nome"]').value,
      email: document.querySelector('input[name="email"]').value,
      assunto: document.querySelector('input[name="assunto"]').value || 'Sem assunto',
      mensagem: document.querySelector('textarea[name="mensagem"]').value,
      time: new Date().toLocaleString('pt-BR')
    };

    emailjs.send('service_ah5857d', 'template_adarn91', formData)
      .then(() => {
        alert('Mensagem enviada com sucesso!');
        form.reset();
      }, (error) => {
        alert('Erro ao enviar a mensagem: ' + error.text);
      });
  });
});