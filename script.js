document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll reveal animation
    const reveals = document.querySelectorAll('.reveal');

    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load

    // Form submission handling (Mock for now since there's no backend)
    const form = document.getElementById('covil-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            
            // Visual feedback
            submitBtn.textContent = 'Enviando...';
            submitBtn.style.background = '#333';
            submitBtn.disabled = true;

            // Simulate network request
            setTimeout(() => {
                const formContainer = document.querySelector('.form-container');
                
                // Show success state
                formContainer.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                        <h3 style="color: var(--accent-red); font-family: var(--font-heading); font-size: 2rem; margin-bottom: 1rem;">Pedido Recebido</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Suas informações estão sob análise do sindicato. Se você for considerado digno, nós o encontraremos.</p>
                        <div style="font-size: 4rem; text-shadow: 0 0 20px var(--accent-red-glow);">🩸</div>
                    </div>
                `;
            }, 2000);
        });
    }
});
