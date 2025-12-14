// Theme Management for TaskSights
// Handles dark/light mode toggle with localStorage persistence

const THEME_KEY = 'tasksights-theme';

// Get current theme from localStorage or default to 'dark'
export function getCurrentTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark';
}

// Set theme and save to localStorage
export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

// Apply theme to document
export function applyTheme(theme) {
  const html = document.documentElement;
  html.setAttribute('data-theme', theme);
  
  // Also add/remove darkMode class for custom CSS
  if (theme === 'dark') {
    html.classList.add('darkMode');
  } else {
    html.classList.remove('darkMode');
  }
}

// Toggle between dark and light
export function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
}

// Initialize theme on page load
export function initTheme() {
  const theme = getCurrentTheme();
  applyTheme(theme);
  return theme;
}

// Listen for theme changes across tabs
window.addEventListener('storage', (e) => {
  if (e.key === THEME_KEY) {
    applyTheme(e.newValue || 'dark');
  }
});
