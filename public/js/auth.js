/* ==========================================================================
   VALOIS B2B // FORM VALIDATION CONTROLLERS
   ========================================================================== */

/**
 * Slide transition between Partner Log In and Create Account
 * @param {string} mode - 'login' or 'signup'
 */
function switchAuthMode(mode) {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const loginTab = document.getElementById('tab-login');
  const signupTab = document.getElementById('tab-signup');
  const authCard = document.getElementById('auth-card');

  if (mode === 'login') {
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    authCard.style.transform = 'rotateY(0deg)';
  } else {
    loginForm.classList.remove('active');
    signupForm.classList.add('active');
    loginTab.classList.remove('active');
    signupTab.classList.add('active');
    authCard.style.transform = 'rotateY(360deg)';
  }
}

/**
 * Decrypt password eyeball toggler
 * @param {string} inputId - ID of password input
 * @param {HTMLElement} element - Clicking eye element
 */
function togglePasswordVisibility(inputId, element) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    element.setAttribute('data-lucide', 'eye-off');
  } else {
    input.type = 'password';
    element.setAttribute('data-lucide', 'eye');
  }
  // Refresh icons
  lucide.createIcons();
}

/**
 * Form Submit Telemetry validator
 * @param {Event} event - form submit
 * @param {string} mode - 'login' or 'signup'
 */
function handleAuthSubmit(event, mode) {
  event.preventDefault();

  if (mode === 'login') {
    const email = document.getElementById('login-email').value.trim();
    const secret = document.getElementById('login-password').value;

    if (!email || !secret) {
      showToast('Login Failed', 'Please fill in all required fields.', 'error');
      return;
    }

    showToast('Sign In', 'Verifying credentials...', 'info');

    // Simulate standard check
    setTimeout(() => {
      showToast('Login Successful', 'Welcome back to your Valois Dashboard.', 'success');
      
      // Initialize fluid viewport switch
      triggerWarpTransition(() => {
        document.getElementById('auth-page').classList.add('hidden');
        document.getElementById('app-layout').classList.remove('hidden');
        
        // Re-align layouts and trigger animations
        window.dispatchEvent(new Event('resize'));
        initializeDashboardCore();
      });
    }, 600);

  } else {
    const name = document.getElementById('signup-name').value.trim();
    const brand = document.getElementById('signup-brand').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const secret = document.getElementById('signup-password').value;

    if (!name || !brand || !email || !secret) {
      showToast('Registration Error', 'Please complete all signup fields.', 'error');
      return;
    }

    showToast('Sign Up', 'Submitting your account request...', 'info');

    // Simulate account setup approval
    setTimeout(() => {
      showToast('Account Created', 'Your partner registration is complete! You can now log in.', 'success');
      
      // Auto-slide back to login and populate
      switchAuthMode('login');
      document.getElementById('login-email').value = email;
      document.getElementById('login-password').value = secret;
      // Focus
      document.getElementById('login-password').focus();
    }, 1000);
  }
}

/**
 * Clean transition navigator (instantly executes for rapid SaaS UX)
 * @param {Function} callback - Execution callback
 */
function triggerWarpTransition(callback) {
  if (typeof callback === 'function') callback();
}
