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

  // Scroll reveal animation
  const reveals = document.querySelectorAll('.reveal')

  function revealOnScroll() {
    const windowHeight = window.innerHeight
    const elementVisible = 150

    reveals.forEach((reveal) => {
      const elementTop = reveal.getBoundingClientRect().top
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active')
      }
    })
  }

  window.addEventListener('scroll', revealOnScroll)
  revealOnScroll() // Trigger on load

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

  // Form submission handling (Mock for now since there's no backend)
  const form = document.getElementById('covil-form')

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()

      const submitBtn = form.querySelector('.btn-submit')

      // Visual feedback
      submitBtn.textContent = 'Selando com Sangue...'
      submitBtn.style.background = '#333'
      submitBtn.disabled = true

      // Simulate network request
      setTimeout(() => {
        const formContainer = document.querySelector('.form-container')

        // Show success state
        formContainer.innerHTML = `
                    <div style="text-align: center; padding: 2rem; animation: fadeIn 1s;">
                        <h3 style="color: var(--accent-red); font-family: var(--font-heading); font-size: 2rem; margin-bottom: 1rem;">Pedido Recebido</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Seu pedido foi selado. Suas informações estão sob análise do sindicato.<br/>Se você for considerado digno, nós o encontraremos.</p>
                        <div style="font-size: 4rem; text-shadow: 0 0 20px var(--accent-red-glow);">🩸</div>
                    </div>
                `
      }, 2000)
    })
  }
})
