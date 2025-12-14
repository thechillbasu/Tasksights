// Insights Module for TaskSights with AI Integration
import { getKanbanTasks } from '../firestore-helpers.js';
import { getTimeLogs } from '../firestore-helpers.js';
import { getUserProfile } from '../firestore-helpers.js';

let currentUser = null;
let charts = {};

export async function initInsights(user) {
  console.log('Initializing Insights module');
  currentUser = user;
  
  const insightsContent = document.getElementById('insightsContent');
  if (!insightsContent) return;
  
  insightsContent.innerHTML = `
    <!-- AI Insights Card -->
    <div class="card bg-gradient-to-br from-secondary/20 to-accent/20 shadow-xl mb-6" data-testid="ai-insights-card">
      <div class="card-body">
        <h3 class="card-title">
          <i class="fas fa-brain text-secondary"></i>
          AI-Powered Insights
        </h3>
        <p class="text-sm text-base-content/70 mb-4">Get personalized productivity analysis with environmental and ethical considerations</p>
        
        <div class="flex gap-4 mb-4">
          <button class="btn btn-primary" id="generateInsightsBtn" data-testid="generate-insights-button">
            <i class="fas fa-sparkles"></i> Generate Insights
          </button>
          <select class="select select-bordered" id="insightsPeriod" data-testid="insights-period-select">
            <option value="daily">Today</option>
            <option value="weekly" selected>This Week</option>
            <option value="monthly">This Month</option>
          </select>
        </div>
        
        <div id="aiInsightsContainer" class="hidden">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="card bg-base-100">
              <div class="card-body">
                <h4 class="font-semibold mb-2"><i class="fas fa-chart-line"></i> Productivity Analysis</h4>
                <p class="text-sm" id="productivityAnalysis"></p>
              </div>
            </div>
            
            <div class="card bg-base-100">
              <div class="card-body">
                <h4 class="font-semibold mb-2"><i class="fas fa-lightbulb"></i> Improvement Suggestions</h4>
                <p class="text-sm" id="improvementSuggestions"></p>
              </div>
            </div>
            
            <div class="card bg-base-100">
              <div class="card-body">
                <h4 class="font-semibold mb-2"><i class="fas fa-leaf"></i> Environmental Impact</h4>
                <p class="text-sm" id="environmentalImpact"></p>
              </div>
            </div>
            
            <div class="card bg-base-100">
              <div class="card-body">
                <h4 class="font-semibold mb-2"><i class="fas fa-heart"></i> Ethical Considerations</h4>
                <p class="text-sm" id="ethicalConsiderations"></p>
              </div>
            </div>
          </div>
          
          <div class="card bg-base-100 mt-4">
            <div class="card-body">
              <h4 class="font-semibold mb-2"><i class="fas fa-trophy"></i> Goal Progress & Summary</h4>
              <p class="text-sm mb-2" id="goalProgress"></p>
              <p class="text-sm font-medium text-primary" id="summary"></p>
            </div>
          </div>
        </div>
        
        <div id="insightsLoading" class="text-center py-8 hidden">
          <span class="loading loading-spinner loading-lg text-primary"></span>
          <p class="mt-4">Generating AI insights...</p>
        </div>
      </div>
    </div>
    
    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="card bg-base-200 shadow-md" data-testid="time-distribution-chart">
        <div class="card-body">
          <h3 class="card-title">Time Distribution</h3>
          <canvas id="timeDistributionChart"></canvas>
        </div>
      </div>
      
      <div class="card bg-base-200 shadow-md" data-testid="tasks-status-chart">
        <div class="card-body">
          <h3 class="card-title">Tasks Status</h3>
          <canvas id="tasksStatusChart"></canvas>
        </div>
      </div>
    </div>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="stats shadow" data-testid="total-tasks-stat">
        <div class="stat">
          <div class="stat-title">Total Tasks</div>
          <div class="stat-value text-primary" id="totalTasks">0</div>
          <div class="stat-desc">All time</div>
        </div>
      </div>
      
      <div class="stats shadow" data-testid="completed-tasks-stat">
        <div class="stat">
          <div class="stat-title">Completed</div>
          <div class="stat-value text-success" id="completedTasks">0</div>
          <div class="stat-desc">✓ Done</div>
        </div>
      </div>
      
      <div class="stats shadow" data-testid="total-time-stat">
        <div class="stat">
          <div class="stat-title">Total Time</div>
          <div class="stat-value text-accent" id="totalTime">0h</div>
          <div class="stat-desc">Tracked</div>
        </div>
      </div>
      
      <div class="stats shadow" data-testid="activities-stat">
        <div class="stat">
          <div class="stat-title">Activities</div>
          <div class="stat-value text-secondary" id="totalActivities">0</div>
          <div class="stat-desc">Tracked</div>
        </div>
      </div>
    </div>
  `;
  
  // Load data and render charts
  await loadInsightsData();
  
  // Set up event listeners
  document.getElementById('generateInsightsBtn')?.addEventListener('click', generateAIInsights);
}

async function loadInsightsData() {
  // Load tasks
  const tasksResult = await getKanbanTasks(currentUser.uid);
  const tasks = tasksResult.success ? tasksResult.tasks : [];
  
  // Load time logs
  const logsResult = await getTimeLogs(currentUser.uid);
  const logs = logsResult.success ? logsResult.logs : [];
  
  // Update stats
  const todoTasks = tasks.filter(t => t.column === 'todo').length;
  const inprogressTasks = tasks.filter(t => t.column === 'inprogress').length;
  const doneTasks = tasks.filter(t => t.column === 'done').length;
  
  document.getElementById('totalTasks').textContent = tasks.length;
  document.getElementById('completedTasks').textContent = doneTasks;
  document.getElementById('totalActivities').textContent = logs.length;
  
  // Calculate total time
  const totalSeconds = logs.reduce((sum, log) => sum + (log.duration || 0), 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  document.getElementById('totalTime').textContent = `${totalHours}h`;
  
  // Render charts
  renderTimeDistributionChart(logs);
  renderTasksStatusChart(todoTasks, inprogressTasks, doneTasks);
}

function renderTimeDistributionChart(logs) {
  const ctx = document.getElementById('timeDistributionChart');
  if (!ctx) return;
  
  // Group by category
  const categoryTime = {};
  logs.forEach(log => {
    const category = log.category || 'other';
    categoryTime[category] = (categoryTime[category] || 0) + (log.duration || 0);
  });
  
  const categories = Object.keys(categoryTime);
  const durations = categories.map(cat => Math.floor(categoryTime[cat] / 60)); // Convert to minutes
  
  if (charts.timeDistribution) {
    charts.timeDistribution.destroy();
  }
  
  charts.timeDistribution = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
      datasets: [{
        data: durations,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function renderTasksStatusChart(todo, inprogress, done) {
  const ctx = document.getElementById('tasksStatusChart');
  if (!ctx) return;
  
  if (charts.tasksStatus) {
    charts.tasksStatus.destroy();
  }
  
  charts.tasksStatus = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['To Do', 'In Progress', 'Done'],
      datasets: [{
        label: 'Tasks',
        data: [todo, inprogress, done],
        backgroundColor: [
          'rgba(6, 182, 212, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

async function generateAIInsights() {
  const loadingEl = document.getElementById('insightsLoading');
  const containerEl = document.getElementById('aiInsightsContainer');
  const btn = document.getElementById('generateInsightsBtn');
  
  loadingEl.classList.remove('hidden');
  containerEl.classList.add('hidden');
  btn.disabled = true;
  
  try {
    // Get data
    const tasksResult = await getKanbanTasks(currentUser.uid);
    const tasks = tasksResult.tasks || [];
    
    const logsResult = await getTimeLogs(currentUser.uid);
    const logs = logsResult.logs || [];
    
    const profileResult = await getUserProfile(currentUser.uid);
    const profile = profileResult.profile || {};
    
    const period = document.getElementById('insightsPeriod').value;
    
    // Prepare request
    const totalSeconds = logs.reduce((sum, log) => sum + (log.duration || 0), 0);
    const categories = [...new Set(logs.map(l => l.category || 'other'))];
    
    const requestData = {
      user_name: currentUser.displayName || 'User',
      tasks: {
        tasks_completed: tasks.filter(t => t.column === 'done').length,
        tasks_in_progress: tasks.filter(t => t.column === 'inprogress').length,
        tasks_todo: tasks.filter(t => t.column === 'todo').length,
        total_time_spent: totalSeconds,
        categories: categories
      },
      activities: logs.slice(0, 10).map(log => ({
        activity_name: log.activityName || 'Unknown',
        duration: log.duration || 0,
        category: log.category || 'other',
        timestamp: new Date(log.startTime).toISOString()
      })),
      time_period: period,
      goals: profile.goals || []
    };
    
    // Call AI API
    const response = await fetch('/api/ai/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) throw new Error('Failed to generate insights');
    
    const insights = await response.json();
    
    // Display insights
    document.getElementById('productivityAnalysis').textContent = insights.productivity_analysis;
    document.getElementById('improvementSuggestions').textContent = insights.improvement_suggestions;
    document.getElementById('environmentalImpact').textContent = insights.environmental_impact;
    document.getElementById('ethicalConsiderations').textContent = insights.ethical_considerations;
    document.getElementById('goalProgress').textContent = insights.goal_progress;
    document.getElementById('summary').textContent = insights.summary;
    
    containerEl.classList.remove('hidden');
  } catch (error) {
    console.error('AI Insights Error:', error);
    alert('Failed to generate insights. Please try again.');
  } finally {
    loadingEl.classList.add('hidden');
    btn.disabled = false;
  }
}