document.addEventListener('DOMContentLoaded', () => {
  // Initialize EmailJS
  emailjs.init('wsvc4Dlnoa4wsx3xJ');

  // Hamburger menu
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
  });

  // Smooth scroll for navigation
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

  // Smooth scroll function
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

  // Carousel functionality
  function initCarousel(carouselSelector) {
    const carousel = document.querySelector(carouselSelector);
    if (!carousel) {
      console.error(`Carousel not found for selector: ${carouselSelector}`);
      return;
    }

    const carouselInner = carousel.querySelector('.carousel-inner');
    const carouselItems = carousel.querySelectorAll('.carousel-item');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    let currentIndex = 0;
    let isTransitioning = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    if (carouselItems.length === 0) {
      console.error(`No carousel items found for selector: ${carouselSelector}`);
      return;
    }

    function showSlide(index) {
      if (isTransitioning) return;
      isTransitioning = true;

      if (index < 0 || index >= carouselItems.length) {
        console.error(`Invalid slide index: ${index} for ${carouselSelector}`);
        isTransitioning = false;
        return;
      }

      carouselItems.forEach(item => item.classList.remove('active'));
      carouselItems[index].classList.add('active');
      carouselInner.style.transform = `translateX(-${index * 100}%)`;

      setTimeout(() => {
        isTransitioning = false;
      }, 500);
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
    }

    // Touch support
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    carousel.addEventListener('touchmove', (e) => {
      touchEndX = e.touches[0].clientX;
      touchEndY = e.touches[0].clientY;
    });

    carousel.addEventListener('touchend', (e) => {
      const swipeDistanceX = touchEndX - touchStartX;
      const swipeDistanceY = touchEndY - touchStartY;
      const minSwipeDistance = 50;
      const maxVerticalSwipe = 50;

      if (Math.abs(swipeDistanceX) > minSwipeDistance && Math.abs(swipeDistanceY) < maxVerticalSwipe) {
        e.preventDefault();
        if (swipeDistanceX > 0) {
          currentIndex = (currentIndex === 0) ? carouselItems.length - 1 : currentIndex - 1;
        } else {
          currentIndex = (currentIndex === carouselItems.length - 1) ? 0 : currentIndex + 1;
        }
        showSlide(currentIndex);
      }

      touchStartX = 0;
      touchStartY = 0;
      touchEndX = 0;
      touchEndY = 0;
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

    showSlide(currentIndex);
  }

  // Initialize carousels
  initCarousel('#feedbacks .carousel');
  initCarousel('#conversa-presidente .president-carousel');

  // Form submission
  const form = document.getElementById('contato-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');

    const formData = {
      nome: document.querySelector('input[name="nome"]').value,
      email: document.querySelector('input[name="email"]').value,
      assunto: document.querySelector('input[name="assunto"]').value || 'Sem assunto',
      mensagem: document.querySelector('textarea[name="mensagem"]').value,
      time: new Date().toLocaleString('pt-BR')
    };

    emailjs.send('service_ah5857d', 'template_adarn91', formData)
      .then(() => {
        const formMessage = form.querySelector('.form-message');
        formMessage.classList.add('success');
        formMessage.textContent = 'Mensagem enviada com sucesso!';
        formMessage.style.display = 'block';
        form.reset();
        submitBtn.classList.remove('loading');
        setTimeout(() => {
          formMessage.style.display = 'none';
        }, 3000);
      }, (error) => {
        const formMessage = form.querySelector('.form-message');
        formMessage.classList.add('error');
        formMessage.textContent = 'Erro ao enviar a mensagem: ' + error.text;
        formMessage.style.display = 'block';
        submitBtn.classList.remove('loading');
        setTimeout(() => {
          formMessage.style.display = 'none';
        }, 3000);
      });
  });
});