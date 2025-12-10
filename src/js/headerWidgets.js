// Header Widgets - Live Clock
// 
// Handles the live clock capsule display in the header.
// Updates the header clock capsule with current time and date every second.

// Update clock display with current time and date
function updateClock() {
  const now = new Date();

  // Format time as HH:MM:SS
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;

  // Format date - use short format on small screens to fit in one line
  const width = window.innerWidth;
  const isMobileSmall = width <= 450;
  const isSmallScreen = width <= 760;

  const options = {
    weekday: isSmallScreen ? 'short' : 'long',
    year: isMobileSmall ? '2-digit' : 'numeric',
    month: isSmallScreen ? 'short' : 'long',
    day: 'numeric'
  };
  const dateString = now.toLocaleDateString('en-US', options).toUpperCase();

  // Update DOM elements
  const timeElement = document.getElementById('liveTime');
  const dateElement = document.getElementById('liveDate');

  if (timeElement) timeElement.textContent = timeString;
  if (dateElement) dateElement.textContent = dateString;
}

// Initialize clock on page load
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 1000); // Update every second
});

// Open the Google Calendar panel (for iframe view)
export function openGooglePanel() {
  const panel = document.getElementById('googleCalendarPanel');
  const iframeContainer = document.getElementById('googleCalendarIframeContainer');
  const eventsContainer = document.getElementById('googleEventsListContainer');

  if (panel) {
    panel.classList.remove('hidden');

    // Show iframe, hide events
    if (iframeContainer) iframeContainer.classList.remove('hidden');
    if (eventsContainer) eventsContainer.classList.add('hidden');
  }
}

// Close the Google Calendar panel with animation
export function closeGooglePanel() {
  const panel = document.getElementById('googleCalendarPanel');
  const container = panel?.querySelector('.googleCalendarPanelContainer');

  if (panel && container) {
    container.classList.add('closing');
    setTimeout(() => {
      panel.classList.add('hidden');
      container.classList.remove('closing');
    }, 200);
  }
}
