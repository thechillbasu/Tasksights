// Time Tracker Module for TaskSights
import { getActivities, createActivity, updateActivity, createTimeLog } from '../firestore-helpers.js';

let activities = [];
let currentUser = null;
let activeTimer = null;
let timerInterval = null;
let startTime = null;

export async function initTracker(user) {
  console.log('Initializing Time Tracker module');
  currentUser = user;
  
  const trackerContent = document.getElementById('trackerContent');
  if (!trackerContent) return;
  
  trackerContent.innerHTML = `
    <!-- Timer Card -->
    <div class="card bg-gradient-to-br from-primary/20 to-secondary/20 shadow-xl mb-6" data-testid="timer-card">
      <div class="card-body text-center">
        <h3 class="text-2xl font-bold mb-4">Current Activity</h3>
        
        <div id="activeActivityName" class="text-lg mb-4 text-base-content/70" data-testid="active-activity-name">
          No activity selected
        </div>
        
        <div class="timer-display mb-6" id="timerDisplay" data-testid="timer-display">00:00:00</div>
        
        <div class="flex gap-4 justify-center">
          <button id="startBtn" class="btn btn-success btn-lg" data-testid="start-timer-button">
            <i class="fas fa-play"></i> Start
          </button>
          <button id="pauseBtn" class="btn btn-warning btn-lg hidden" data-testid="pause-timer-button">
            <i class="fas fa-pause"></i> Pause
          </button>
          <button id="stopBtn" class="btn btn-error btn-lg hidden" data-testid="stop-timer-button">
            <i class="fas fa-stop"></i> Stop
          </button>
        </div>
      </div>
    </div>
    
    <!-- Activities Management -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Add Activity -->
      <div class="card bg-base-200 shadow-md" data-testid="add-activity-card">
        <div class="card-body">
          <h3 class="card-title">Create Activity</h3>
          <form id="addActivityForm">
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text">Activity Name</span>
              </label>
              <input type="text" placeholder="e.g., Exercise, Study" class="input input-bordered" 
                id="activityName" data-testid="activity-name-input" required>
            </div>
            
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text">Category</span>
              </label>
              <select class="select select-bordered" id="activityCategory" data-testid="activity-category-select">
                <option value="work">Work</option>
                <option value="study">Study</option>
                <option value="exercise">Exercise</option>
                <option value="hobby">Hobby</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text">Daily Goal (minutes)</span>
              </label>
              <input type="number" placeholder="30" class="input input-bordered" 
                id="activityGoal" data-testid="activity-goal-input" min="0">
            </div>
            
            <button type="submit" class="btn btn-primary w-full" data-testid="create-activity-button">
              <i class="fas fa-plus"></i> Create Activity
            </button>
          </form>
        </div>
      </div>
      
      <!-- Activities List -->
      <div class="card bg-base-200 shadow-md" data-testid="activities-list-card">
        <div class="card-body">
          <h3 class="card-title">My Activities</h3>
          <div id="activitiesList" class="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            <!-- Activities will be rendered here -->
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Load activities
  await loadActivities();
  
  // Set up event listeners
  document.getElementById('addActivityForm')?.addEventListener('submit', handleAddActivity);
  document.getElementById('startBtn')?.addEventListener('click', startTimer);
  document.getElementById('pauseBtn')?.addEventListener('click', pauseTimer);
  document.getElementById('stopBtn')?.addEventListener('click', stopTimer);
}

async function loadActivities() {
  const result = await getActivities(currentUser.uid);
  if (result.success) {
    activities = result.activities;
    renderActivities();
  }
}

function renderActivities() {
  const activitiesList = document.getElementById('activitiesList');
  if (!activitiesList) return;
  
  if (activities.length === 0) {
    activitiesList.innerHTML = '<p class="text-sm text-base-content/50">No activities yet. Create your first activity!</p>';
    return;
  }
  
  activitiesList.innerHTML = activities.map(activity => `
    <div class="activity-item" data-testid="activity-item">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="font-medium">${activity.name}</p>
          <p class="text-sm text-base-content/70">
            <span class="badge badge-sm">${activity.category}</span>
            ${activity.goal ? `<span class="text-xs ml-2">Goal: ${activity.goal}min/day</span>` : ''}
          </p>
        </div>
        <button class="btn btn-sm btn-primary" onclick="window.selectActivity('${activity.id}')" data-testid="select-activity-button">
          Select
        </button>
      </div>
    </div>
  `).join('');
}

async function handleAddActivity(e) {
  e.preventDefault();
  
  const name = document.getElementById('activityName').value.trim();
  const category = document.getElementById('activityCategory').value;
  const goal = parseInt(document.getElementById('activityGoal').value) || null;
  
  const activityData = { name, category, goal };
  
  const result = await createActivity(currentUser.uid, activityData);
  if (result.success) {
    document.getElementById('addActivityForm').reset();
    await loadActivities();
  }
}

window.selectActivity = function(activityId) {
  activeTimer = activities.find(a => a.id === activityId);
  if (activeTimer) {
    document.getElementById('activeActivityName').textContent = activeTimer.name;
    document.getElementById('startBtn').classList.remove('hidden');
  }
};

function startTimer() {
  if (!activeTimer) {
    alert('Please select an activity first!');
    return;
  }
  
  startTime = Date.now();
  
  document.getElementById('startBtn').classList.add('hidden');
  document.getElementById('pauseBtn').classList.remove('hidden');
  document.getElementById('stopBtn').classList.remove('hidden');
  
  timerInterval = setInterval(updateTimerDisplay, 1000);
}

function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    
    document.getElementById('pauseBtn').classList.add('hidden');
    document.getElementById('startBtn').classList.remove('hidden');
  }
}

async function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  if (!startTime || !activeTimer) return;
  
  const duration = Math.floor((Date.now() - startTime) / 1000);
  
  // Save time log
  await createTimeLog(currentUser.uid, {
    activityId: activeTimer.id,
    activityName: activeTimer.name,
    category: activeTimer.category,
    startTime: startTime,
    endTime: Date.now(),
    duration: duration
  });
  
  // Reset timer
  document.getElementById('timerDisplay').textContent = '00:00:00';
  document.getElementById('activeActivityName').textContent = 'No activity selected';
  document.getElementById('startBtn').classList.remove('hidden');
  document.getElementById('pauseBtn').classList.add('hidden');
  document.getElementById('stopBtn').classList.add('hidden');
  
  activeTimer = null;
  startTime = null;
  
  alert(`Activity logged! Duration: ${formatDuration(duration)}`);
}

function updateTimerDisplay() {
  if (!startTime) return;
  
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById('timerDisplay').textContent = formatDuration(elapsed);
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}