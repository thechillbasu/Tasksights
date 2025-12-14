// Dashboard Main Logic for TaskSights
import { onAuthChange, signOutUser, getCurrentUser } from './auth.js';
import { initProfile } from './modules/profile.js';
import { initKanban } from './modules/kanban.js';
import { initTracker } from './modules/tracker.js';
import { initInsights } from './modules/insights.js';
import { initJournal } from './modules/journal.js';

// Check authentication
onAuthChange((user) => {
  if (!user) {
    // No user signed in, redirect to login
    window.location.href = '/login.html';
  } else {
    // User is signed in, initialize dashboard
    initializeDashboard(user);
  }
});

// Initialize dashboard
function initializeDashboard(user) {
  console.log('Initializing dashboard for user:', user.email);
  
  // Initialize all modules
  initProfile(user);
  initKanban(user);
  initTracker(user);
  initInsights(user);
  initJournal(user);
  
  // Set up navigation
  setupNavigation();
  
  // Set up logout
  setupLogout();
}

// Navigation System
function setupNavigation() {
  const sidebar = document.getElementById('sidebar');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarItems = document.querySelectorAll('.sidebar-item[data-section]');
  const sections = document.querySelectorAll('.section');
  
  // Mobile menu toggle
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
  
  // Sidebar close button (mobile)
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }
  
  // Navigation items
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const sectionName = item.getAttribute('data-section');
      switchSection(sectionName);
      
      // Close mobile menu
      if (window.innerWidth < 1024) {
        sidebar.classList.remove('open');
      }
    });
  });
  
  // Switch section function
  function switchSection(sectionName) {
    // Update active nav item
    sidebarItems.forEach(item => {
      if (item.getAttribute('data-section') === sectionName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    
    // Update visible section
    sections.forEach(section => {
      const sectionId = `${sectionName}Section`;
      if (section.id === sectionId) {
        section.classList.remove('hidden');
        section.classList.add('active', 'fade-in');
      } else {
        section.classList.add('hidden');
        section.classList.remove('active');
      }
    });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth < 1024) {
      if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    }
  });
}

// Logout functionality
function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  
  logoutBtn.addEventListener('click', async () => {
    const confirmed = confirm('Are you sure you want to logout?');
    
    if (confirmed) {
      showLoading();
      const result = await signOutUser();
      hideLoading();
      
      if (result.success) {
        window.location.href = '/login.html';
      } else {
        alert('Failed to logout. Please try again.');
      }
    }
  });
}

// Loading overlay
function showLoading() {
  document.getElementById('loadingOverlay').classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('loadingOverlay').classList.add('hidden');
}

export { showLoading, hideLoading };
