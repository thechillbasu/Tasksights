// Profile Module for TaskSights
import { getCurrentUser } from '../auth.js';
import { getUserProfile, updateUserProfile } from '../firestore-helpers.js';

export async function initProfile(user) {
  console.log('Initializing Profile module');
  
  const profileContent = document.getElementById('profileContent');
  
  if (!profileContent) return;
  
  // Load user profile
  const profileResult = await getUserProfile(user.uid);
  const profile = profileResult.success ? profileResult.profile : {};
  
  // Render profile UI
  profileContent.innerHTML = `
    <!-- User Info Card -->
    <div class="card bg-base-200 shadow-md" data-testid="profile-card">
      <div class="card-body">
        <div class="flex items-center gap-4 mb-4">
          <div class="avatar placeholder">
            <div class="bg-primary text-primary-content rounded-full w-20">
              <span class="text-3xl">${user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}</span>
            </div>
          </div>
          <div>
            <h3 class="text-2xl font-bold" data-testid="user-display-name">${user.displayName || 'User'}</h3>
            <p class="text-base-content/70" data-testid="user-email">${user.email}</p>
          </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="label">
              <span class="label-text font-semibold">Account Created</span>
            </label>
            <p class="text-sm">${new Date(user.metadata.creationTime).toLocaleDateString()}</p>
          </div>
          <div>
            <label class="label">
              <span class="label-text font-semibold">Last Sign In</span>
            </label>
            <p class="text-sm">${new Date(user.metadata.lastSignInTime).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Goals Management -->
    <div class="card bg-base-200 shadow-md" data-testid="goals-card">
      <div class="card-body">
        <h3 class="card-title">My Goals</h3>
        <p class="text-sm text-base-content/70 mb-4">Set daily time goals for your activities</p>
        
        <div id="goalsList" class="space-y-2">
          <!-- Goals will be rendered here -->
        </div>
        
        <button class="btn btn-primary btn-sm mt-4" id="addGoalBtn" data-testid="add-goal-button">
          <i class="fas fa-plus"></i>
          Add Goal
        </button>
      </div>
    </div>
    
    <!-- Preferences -->
    <div class="card bg-base-200 shadow-md" data-testid="preferences-card">
      <div class="card-body">
        <h3 class="card-title">Preferences</h3>
        
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">Enable Notifications</span>
            <input type="checkbox" class="toggle toggle-primary" id="notificationsToggle" 
              ${profile.preferences?.notifications !== false ? 'checked' : ''}>
          </label>
        </div>
        
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">Dark Mode</span>
            <input type="checkbox" class="toggle toggle-primary" id="darkModeToggle">
          </label>
        </div>
      </div>
    </div>
  `;
  
  // Render goals
  renderGoals(profile.goals || []);
  
  // Set up event listeners
  document.getElementById('addGoalBtn')?.addEventListener('click', () => addGoal(user.uid));
  document.getElementById('notificationsToggle')?.addEventListener('change', (e) => {
    updateUserProfile(user.uid, {
      preferences: { ...profile.preferences, notifications: e.target.checked }
    });
  });
}

function renderGoals(goals) {
  const goalsList = document.getElementById('goalsList');
  if (!goalsList) return;
  
  if (goals.length === 0) {
    goalsList.innerHTML = '<p class="text-sm text-base-content/50">No goals set yet. Add your first goal!</p>';
    return;
  }
  
  goalsList.innerHTML = goals.map((goal, index) => `
    <div class="flex items-center justify-between p-3 bg-base-100 rounded-lg" data-testid="goal-item">
      <div class="flex-1">
        <p class="font-medium">${goal.name}</p>
        <p class="text-sm text-base-content/70">Target: ${goal.target} minutes/day</p>
      </div>
      <button class="btn btn-ghost btn-sm text-error" onclick="window.removeGoal(${index})" data-testid="remove-goal-button">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');
}

async function addGoal(userId) {
  const name = prompt('Goal name (e.g., "Exercise", "Study"):');
  const target = prompt('Target time in minutes per day:');
  
  if (name && target) {
    const profileResult = await getUserProfile(userId);
    const profile = profileResult.profile || {};
    const goals = profile.goals || [];
    
    goals.push({ name, target: parseInt(target) });
    
    await updateUserProfile(userId, { goals });
    renderGoals(goals);
  }
}

window.removeGoal = async function(index) {
  const user = getCurrentUser();
  if (!user) return;
  
  const profileResult = await getUserProfile(user.uid);
  const goals = profileResult.profile?.goals || [];
  
  goals.splice(index, 1);
  await updateUserProfile(user.uid, { goals });
  renderGoals(goals);
};