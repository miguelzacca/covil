document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar')

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled')
    } else {
      navbar.classList.remove('scrolled')
    }
  })

  // Initialize Lenis
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)

  // Custom Cursor
  const cursor = document.querySelector('.cursor')
  const clickableElements = document.querySelectorAll(
    'a, button, input[type="radio"], input[type="checkbox"], label, .feature-card',
  )

  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    })

    // clickableElements.forEach((el) => {
    //   el.addEventListener('mouseenter', () => cursor.classList.add('active'))
    //   el.addEventListener('mouseleave', () => cursor.classList.remove('active'))
    // })
  }

  // Magnetic Buttons
  const magneticButtons = document.querySelectorAll(
    '.btn-primary, .btn-outline',
  )
  magneticButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      gsap.to(btn, {
        duration: 0.3,
        x: x * 0.2,
        y: y * 0.2,
        ease: 'power2.out',
      })
    })

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        duration: 0.7,
        x: 0,
        y: 0,
        ease: 'elastic.out(1, 0.3)',
      })
    })
  })

  // GSAP Animations
  gsap.registerPlugin(ScrollTrigger)

  // Preloader & Intro Sequence
  const tlIntro = gsap.timeline()

  // Prevent scrolling during preloader
  document.body.style.overflow = 'hidden'

  tlIntro
    .to('.loading-bar', {
      width: '100%',
      duration: 1.5,
      ease: 'power2.inOut',
    })
    .to(
      '.preloader .logo',
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      },
      '-=0.5',
    )
    .to('.preloader', {
      yPercent: -100,
      duration: 1,
      ease: 'power4.inOut',
      delay: 0.3,
      onComplete: () => {
        document.body.style.overflow = ''
      },
    })
    .fromTo(
      '.hero-content .location',
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.5',
    )
    .fromTo(
      '.hero-content .glitch',
      { autoAlpha: 0, scale: 0.9 },
      { autoAlpha: 1, scale: 1, duration: 1, ease: 'power3.out' },
      '-=0.6',
    )
    .fromTo(
      '.hero-content .subtitle',
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.7',
    )
    .fromTo(
      '.hero-content .hero-actions',
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.6',
    )

  // Scroll Animations

  // Hero Parallax
  gsap.to('.hero', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
    yPercent: 30,
    ease: 'none',
  })

  // About Features Stagger
  gsap.fromTo(
    '.feature-card',
    { autoAlpha: 0, y: 50, rotationY: 15 },
    {
      scrollTrigger: {
        trigger: '.features',
        start: 'top 80%',
      },
      autoAlpha: 1,
      y: 0,
      rotationY: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
    },
  )

  // Application Section Reveal
  gsap.fromTo(
    '.application-wrapper',
    { autoAlpha: 0, y: 50 },
    {
      scrollTrigger: {
        trigger: '.application',
        start: 'top 70%',
      },
      autoAlpha: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
    },
  )

  // Multi-step Form Logic
  const prevBtns = document.querySelectorAll('.btn-prev')
  const nextBtns = document.querySelectorAll('.btn-next')
  const progress = document.getElementById('progress')
  const formSteps = document.querySelectorAll('.form-step')
  const progressSteps = document.querySelectorAll('.progress-step')

  let formStepsNum = 0

  nextBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Basic validation for current step
      const currentStep = formSteps[formStepsNum]
      const inputs = currentStep.querySelectorAll(
        'input[required], textarea[required]',
      )
      let isValid = true

      // Remove previous custom validity
      inputs.forEach((input) => input.setCustomValidity(''))

      // Check native validity and any custom group validations (e.g., radio buttons)
      inputs.forEach((input) => {
        if (!input.checkValidity()) {
          input.reportValidity()
          isValid = false
        }
      })

      // Special check for radio buttons if present in step
      const radioGroups = currentStep.querySelectorAll('.radio-group')
      radioGroups.forEach((group) => {
        const requiredRadios = group.querySelectorAll(
          'input[type="radio"][required]',
        )
        if (requiredRadios.length > 0) {
          const name = requiredRadios[0].name
          const checked = currentStep.querySelector(
            `input[type="radio"][name="${name}"]:checked`,
          )
          if (!checked) {
            requiredRadios[0].reportValidity()
            isValid = false
          }
        }
      })

      if (isValid) {
        formStepsNum++
        updateFormSteps()
        updateProgressbar()
      }
    })
  })

  prevBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      formStepsNum--
      updateFormSteps()
      updateProgressbar()
    })
  })

  function updateFormSteps() {
    formSteps.forEach((formStep) => {
      formStep.classList.contains('form-step-active') &&
        formStep.classList.remove('form-step-active')
    })

    formSteps[formStepsNum].classList.add('form-step-active')
  }

  function updateProgressbar() {
    progressSteps.forEach((progressStep, idx) => {
      if (idx < formStepsNum + 1) {
        progressStep.classList.add('progress-step-active')
      } else {
        progressStep.classList.remove('progress-step-active')
      }
    })

    const progressActive = document.querySelectorAll('.progress-step-active')

    progress.style.width =
      ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + '%'
  }

  // Form submission handling
  const form = document.getElementById('covil-form')

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault()

      const submitBtn = form.querySelector('.btn-submit')

      // Visual feedback
      submitBtn.textContent = 'Gerando Pagamento...'
      submitBtn.style.background = '#333'
      submitBtn.disabled = true

      const formData = new FormData(form);
      const name = formData.get('name');
      const contact = formData.get('contact');

      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, contact })
        });

        const data = await response.json();

        if (!response.ok || !data.paymentUrl) {
          throw new Error(data.error || 'Erro ao gerar pagamento');
        }

        // Redirect to InfinitePay checkout
        window.location.href = data.paymentUrl;
      } catch (error) {
        console.error('Erro de pagamento:', error);
        alert('Ocorreu um erro ao processar o pagamento da taxa: ' + error.message);
        
        submitBtn.textContent = 'Assinar com Sangue (Enviar)'
        submitBtn.style.background = ''
        submitBtn.disabled = false
      }
    })
  }

  // Check for success param on load
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === 'true') {
    // Scroll to the application section
    const appSection = document.getElementById('solicitar-acesso');
    if (appSection) {
      setTimeout(() => {
        appSection.scrollIntoView({ behavior: 'smooth' });
        const formContainer = document.querySelector('.form-container');
        if (formContainer) {
          formContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; animation: fadeIn 1s;">
              <h3 style="color: var(--accent-red); font-family: var(--font-heading); font-size: 2rem; margin-bottom: 1rem;">Pedido Recebido e Pago</h3>
              <p style="color: var(--text-secondary); margin-bottom: 2rem;">Sua taxa foi paga e o pedido selado. Suas informações estão sob análise do sindicato.<br/>Se você for considerado digno, nós o encontraremos.</p>
              <div style="font-size: 4rem; text-shadow: 0 0 20px var(--accent-red-glow);">🩸</div>
            </div>
          `;
        }
      }, 500);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }
})
