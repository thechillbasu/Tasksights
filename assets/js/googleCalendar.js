// Google Calendar OAuth Integration
// 
// Handles Google OAuth 2.0 authentication and fetches user's personal calendar events.
// Uses Google Identity Services (GIS) for client-side OAuth and Google Calendar API
// for fetching events. Provides read-only access to user's primary calendar.

const CLIENT_ID = '1081706752334-20bvivbj9ldmdhf8kot0ma7k585atajo.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;
let hasToken = false;

export function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
  try {
    await gapi.client.init({});
    await gapi.client.load('https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest');
    gapiInited = true;
    maybeEnableMyEventsButton();
  } catch (err) {
    console.error('Error initializing gapi:', err);
  }
}

export function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: handleAuthResponse,
  });
  gisInited = true;
  maybeEnableMyEventsButton();
}

function handleAuthResponse(tokenResponse) {
  if (tokenResponse.error) {
    console.error('OAuth error:', tokenResponse.error);
    return;
  }

  hasToken = true;
  
  // Set token in gapi client
  if (gapi && gapi.client && tokenResponse.access_token) {
    gapi.client.setToken(tokenResponse);
  }
  
  // When token is acquired, immediately fetch events
  fetchAndDisplayEvents();
}

function maybeEnableMyEventsButton() {
  if (!gapiInited || !gisInited) return;
  const myEventsBtn = document.getElementById('myEventsBtn');
  if (myEventsBtn) {
    myEventsBtn.disabled = false;
  }
}

export function ensureGoogleAuth() {
  return new Promise((resolve, reject) => {
    if (hasToken && gapi && gapi.client && gapi.client.getToken()) {
      resolve(true);
      return;
    }
    
    if (!tokenClient) {
      reject(new Error('Token client not ready'));
      return;
    }

    tokenClient.callback = (res) => {
      if (res && !res.error) {
        hasToken = true;
        if (gapi && gapi.client && res.access_token) {
          gapi.client.setToken(res);
        }
        resolve(true);
      } else {
        reject(res?.error || new Error('Auth failed'));
      }
    };

    tokenClient.requestAccessToken({ prompt: 'consent' });
  });
}

export async function fetchAndDisplayEvents() {
  try {
    if (!gapi || !gapi.client || !gapi.client.getToken()) {
      console.error('No valid token available');
      return;
    }

    const now = new Date().toISOString();
    const resp = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: now,
      maxResults: 15,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = resp.result.items || [];
    renderGoogleEvents(events);
  } catch (e) {
    console.error('Error fetching events', e);
    const container = document.getElementById('googleEventsList');
    if (container) {
      container.innerHTML = '<p class="googleEventsEmpty">Error loading events. Please try again.</p>';
    }
  }
}

function renderGoogleEvents(events) {
  const container = document.getElementById('googleEventsList');
  if (!container) return;

  if (!events.length) {
    container.innerHTML = '<p class="googleEventsEmpty">No upcoming events</p>';
    return;
  }

  container.innerHTML = events.map((event) => {
    const start = event.start.dateTime || event.start.date;
    const date = new Date(start);
    const isAllDay = !event.start.dateTime;

    const timeString = isAllDay
      ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

    const location = event.location ? `<p class="googleEventLocation"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(event.location)}</p>` : '';

    return `
      <div class="googleEventItem">
        <p class="googleEventTitle">${escapeHtml(event.summary || 'Untitled event')}</p>
        <p class="googleEventTime">
          <i class="fas fa-clock"></i>
          ${timeString}
        </p>
        ${location}
      </div>
    `;
  }).join('');
}

function escapeHtml(text) {
  const map = { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' };
  return String(text || '').replace(/[&<>"']/g, m => map[m]);
}

// Expose load callbacks for the script tags (needed for inline script in HTML)
window.gapiLoaded = gapiLoaded;
window.gisLoaded = gisLoaded;

