// Login Page Logic for TaskSights
import { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, onAuthChange } from './auth.js';

// DOM Elements
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const emailLoginForm = document.getElementById('emailLoginForm');
const emailSignupForm = document.getElementById('emailSignupForm');
const googleSignInBtn = document.getElementById('googleSignInBtn');
const googleSignUpBtn = document.getElementById('googleSignUpBtn');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const alertContainer = document.getElementById('alertContainer');
const loadingOverlay = document.getElementById('loadingOverlay');

// Check if user is already logged in
onAuthChange((user) => {
  if (user) {
    // User is signed in, redirect to dashboard
    window.location.href = '/dashboard.html';
  }
});

// Tab Switching
loginTab.addEventListener('click', () => {
  loginTab.classList.add('tab-active');
  signupTab.classList.remove('tab-active');
  loginForm.classList.remove('hidden');
  signupForm.classList.add('hidden');
  clearAlert();
});

signupTab.addEventListener('click', () => {
  signupTab.classList.add('tab-active');
  loginTab.classList.remove('tab-active');
  signupForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  clearAlert();
});

// Email Login
emailLoginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  showLoading();
  const result = await signInWithEmail(email, password);
  hideLoading();
  
  if (result.success) {
    showSuccess('Login successful! Redirecting...');
    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 1000);
  } else {
    showError(result.error);
  }
});

// Email Signup
emailSignupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupPasswordConfirm').value;
  
  // Validate passwords match
  if (password !== confirmPassword) {
    showError('Passwords do not match.');
    return;
  }
  
  // Validate password length
  if (password.length < 6) {
    showError('Password must be at least 6 characters.');
    return;
  }
  
  showLoading();
  const result = await signUpWithEmail(email, password, name);
  hideLoading();
  
  if (result.success) {
    showSuccess('Account created! Redirecting...');
    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 1000);
  } else {
    showError(result.error);
  }
});

// Google Sign In (from login form)
googleSignInBtn.addEventListener('click', async () => {
  showLoading();
  const result = await signInWithGoogle();
  hideLoading();
  
  if (result.success) {
    showSuccess('Login successful! Redirecting...');
    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 1000);
  } else {
    showError(result.error);
  }
});

// Google Sign Up (from signup form)
googleSignUpBtn.addEventListener('click', async () => {
  showLoading();
  const result = await signInWithGoogle();
  hideLoading();
  
  if (result.success) {
    showSuccess('Account created! Redirecting...');
    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 1000);
  } else {
    showError(result.error);
  }
});

// Forgot Password
forgotPasswordLink.addEventListener('click', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  
  if (!email) {
    showError('Please enter your email address first.');
    return;
  }
  
  showLoading();
  const result = await resetPassword(email);
  hideLoading();
  
  if (result.success) {
    showSuccess('Password reset email sent! Check your inbox.');
  } else {
    showError(result.error);
  }
});

// Alert Functions
function showError(message) {
  alertContainer.innerHTML = `
    <div class="alert alert-error fade-in" data-testid="error-alert">
      <i class="fas fa-exclamation-circle"></i>
      <span>${message}</span>
    </div>
  `;
}

function showSuccess(message) {
  alertContainer.innerHTML = `
    <div class="alert alert-success fade-in" data-testid="success-alert">
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    </div>
  `;
}

function clearAlert() {
  alertContainer.innerHTML = '';
}

function showLoading() {
  loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
  loadingOverlay.classList.add('hidden');
}
