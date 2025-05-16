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

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // Carousel functionality
    const carouselInner = document.querySelector('.carousel-inner');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let currentIndex = 0;

    function showSlide(index) {
        carouselItems.forEach(item => item.classList.remove('active'));
        carouselItems[index].classList.add('active');
        carouselInner.style.transform = `translateX(-${index * 100}%)`;
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

        // Auto-slide every 5 seconds
        setInterval(() => {
            currentIndex = (currentIndex === carouselItems.length - 1) ? 0 : currentIndex + 1;
            showSlide(currentIndex);
        }, 5000);
    }

    // Form submission with EmailJS
    const form = document.getElementById('contato-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Coleta os dados do formulário
        const formData = {
            nome: document.querySelector('input[name="nome"]').value,
            email: document.querySelector('input[name="email"]').value,
            assunto: document.querySelector('input[name="assunto"]').value || 'Sem assunto',
            mensagem: document.querySelector('textarea[name="mensagem"]').value,
            time: new Date().toLocaleString('pt-BR') // Adiciona data e hora no formato local
        };

        // Envia o e-mail usando EmailJS
        emailjs.send('service_ah5857d', 'template_adarn91', formData)
            .then(() => {
                alert('Mensagem enviada com sucesso!');
                form.reset(); // Limpa o formulário
            }, (error) => {
                alert('Erro ao enviar a mensagem: ' + error.text);
            });
    });
});