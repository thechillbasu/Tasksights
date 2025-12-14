// Kanban Board Module for TaskSights - Based on Kanby Logic
// Implements exact time tracking, drag-drop, and task management from Kanby
import { getKanbanTasks, createKanbanTask, updateKanbanTask, deleteKanbanTask } from '../firestore-helpers.js';
import { openTaskEditorModal, openTaskDetailsModal } from '../modals.js';

let tasks = [];
let currentUser = null;
let timerManager = null;
let timerUpdateInterval = null;

// Timer Manager Class (from Kanby)
class TimerManager {
  constructor() {
    this.activeTimers = new Map(); // Map of taskId -> startTime
  }

  startTimer(taskId, startedAt) {
    if (!taskId || !startedAt) {
      console.error('Invalid taskId or startedAt provided');
      return;
    }
    this.activeTimers.set(taskId, startedAt);
  }

  stopTimer(taskId) {
    if (!this.activeTimers.has(taskId)) return 0;
    const startedAt = this.activeTimers.get(taskId);
    const elapsedTime = Date.now() - startedAt;
    this.activeTimers.delete(taskId);
    return elapsedTime;
  }

  getElapsedTime(taskId) {
    if (!this.activeTimers.has(taskId)) return 0;
    const startedAt = this.activeTimers.get(taskId);
    return Date.now() - startedAt;
  }

  isTimerActive(taskId) {
    return this.activeTimers.has(taskId);
  }

  getActiveTimerIds() {
    return Array.from(this.activeTimers.keys());
  }

  clearAllTimers() {
    this.activeTimers.clear();
  }
}

export async function initKanban(user) {
  console.log('Initializing Kanban module with Kanby logic');
  currentUser = user;
  timerManager = new TimerManager();
  
  const kanbanContent = document.getElementById('kanbanContent');
  if (!kanbanContent) return;
  
  // Render Kanban UI
  kanbanContent.innerHTML = `
    <!-- Add Task Form -->
    <div class=\"card bg-base-200 shadow-md mb-6\" data-testid=\"add-task-form\">
      <div class=\"card-body\">
        <div class=\"flex flex-col md:flex-row gap-4\">
          <form id=\"addTaskForm\" class=\"flex flex-col md:flex-row gap-4 flex-1\">
            <input type=\"text\" placeholder=\"Task name...\" class=\"input input-bordered flex-1\" 
              id=\"taskNameInput\" data-testid=\"task-name-input\" required>
            <select class=\"select select-bordered\" id=\"taskPriority\" data-testid=\"task-priority-select\">
              <option value=\"high\">High Priority</option>
              <option value=\"medium\" selected>Medium Priority</option>
              <option value=\"low\">Low Priority</option>
            </select>
            <select class=\"select select-bordered\" id=\"taskColumn\" data-testid=\"task-column-select\">
              <option value=\"todo\">To Do</option>
              <option value=\"inprogress\">In Progress</option>
              <option value=\"done\">Done</option>
            </select>
            <button type=\"submit\" class=\"btn btn-primary\" data-testid=\"add-task-button\">
              <i class=\"fas fa-plus\"></i> Quick Add
            </button>
          </form>
          <button type=\"button\" class=\"btn btn-secondary\" id=\"addTaskModalBtn\" data-testid=\"add-task-modal-button\">
            <i class=\"fas fa-plus-circle\"></i> Add with Details
          </button>
        </div>
      </div>
    </div>
    
    <!-- Kanban Board -->
    <div class=\"grid grid-cols-1 lg:grid-cols-3 gap-6\">
      <!-- To Do Column -->
      <div class=\"kanban-column\" data-column=\"todo\" data-testid=\"kanban-column-todo\">
        <h3 class=\"text-lg font-bold mb-4 flex items-center gap-2\">
          <i class=\"fas fa-clipboard-list text-info\"></i>
          TO DO
          <span class=\"badge badge-info\" id=\"todoCount\">0</span>
        </h3>
        <div id=\"todoContainer\" class=\"space-y-3 min-h-[200px] custom-scrollbar\" style=\"max-height: calc(100vh - 400px); overflow-y: auto;\">
          <!-- Tasks will be rendered here -->
        </div>
      </div>
      
      <!-- In Progress Column -->
      <div class=\"kanban-column\" data-column=\"inprogress\" data-testid=\"kanban-column-inprogress\">
        <h3 class=\"text-lg font-bold mb-4 flex items-center gap-2\">
          <i class=\"fas fa-spinner text-warning\"></i>
          IN PROGRESS
          <span class=\"badge badge-warning\" id=\"inprogressCount\">0</span>
        </h3>
        <div id=\"inprogressContainer\" class=\"space-y-3 min-h-[200px] custom-scrollbar\" style=\"max-height: calc(100vh - 400px); overflow-y: auto;\">
          <!-- Tasks will be rendered here -->
        </div>
      </div>
      
      <!-- Done Column -->
      <div class=\"kanban-column\" data-column=\"done\" data-testid=\"kanban-column-done\">
        <h3 class=\"text-lg font-bold mb-4 flex items-center gap-2\">
          <i class=\"fas fa-check-circle text-success\"></i>
          DONE
          <span class=\"badge badge-success\" id=\"doneCount\">0</span>
        </h3>
        <div id=\"doneContainer\" class=\"space-y-3 min-h-[200px] custom-scrollbar\" style=\"max-height: calc(100vh - 400px); overflow-y: auto;\">
          <!-- Tasks will be rendered here -->
        </div>
      </div>
    </div>
  `;
  
  // Load tasks
  await loadTasks();
  
  // Initialize timers for In Progress tasks BEFORE rendering
  initializeTimers();
  
  // Start timer update loop
  startTimerUpdateLoop();
  
  // Now render
  renderTasks();
  
  // Set up event listeners
  document.getElementById('addTaskForm')?.addEventListener('submit', handleAddTask);
  setupDragAndDrop();
}

async function loadTasks() {
  const result = await getKanbanTasks(currentUser.uid);
  if (result.success) {
    tasks = result.tasks;
  }
}

// Initialize timers for tasks in progress (Kanby logic)
function initializeTimers() {
  timerManager.clearAllTimers();
  
  tasks.forEach(task => {
    if (task.column === 'inprogress') {
      // Calculate total elapsed time including time when browser was closed
      let totalElapsedTime = task.timeSpent || 0;
      
      if (task.inProgressSince) {
        // Add time since task entered In Progress
        const currentSessionTime = Date.now() - task.inProgressSince;
        totalElapsedTime += currentSessionTime;
      }
      
      // Set adjusted start time for timer display
      const adjustedStartTime = Date.now() - totalElapsedTime;
      task.timerStartTime = adjustedStartTime;
      
      // Set first started timestamp if not set
      if (!task.startedAt) {
        task.startedAt = task.inProgressSince || Date.now();
      }
      
      // Ensure inProgressSince is set
      if (!task.inProgressSince) {
        task.inProgressSince = Date.now();
      }
      
      timerManager.startTimer(task.id, adjustedStartTime);
    }
  });
}

// Start timer update loop (updates every second)
function startTimerUpdateLoop() {
  if (timerUpdateInterval) return;
  
  timerUpdateInterval = setInterval(() => {
    updateTimerDisplays();
  }, 1000);
}

// Update timer displays
function updateTimerDisplays() {
  const activeTimerIds = timerManager.getActiveTimerIds();
  
  activeTimerIds.forEach(taskId => {
    const taskCard = document.querySelector(`[data-task-id=\"${taskId}\"]`);
    if (taskCard) {
      const timerDisplay = taskCard.querySelector('.timer-display');
      if (timerDisplay) {
        const elapsedTime = timerManager.getElapsedTime(taskId);
        timerDisplay.textContent = `⏱ ${formatElapsedTime(elapsedTime)}`;
      }
    }
  });
}

// Format time as HH:MM:SS
function formatElapsedTime(milliseconds) {
  if (milliseconds < 0) return '00:00:00';
  
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Format completed time
function formatCompletedTime(milliseconds) {
  if (!milliseconds || milliseconds <= 0) return 'No time tracked';
  
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  const parts = [];
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
  
  return parts.join(' ');
}

function renderTasks() {
  const todoContainer = document.getElementById('todoContainer');
  const inprogressContainer = document.getElementById('inprogressContainer');
  const doneContainer = document.getElementById('doneContainer');
  
  if (!todoContainer || !inprogressContainer || !doneContainer) return;
  
  // Clear containers
  todoContainer.innerHTML = '';
  inprogressContainer.innerHTML = '';
  doneContainer.innerHTML = '';
  
  // Sort by priority (high > medium > low)
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  const sortedTasks = [...tasks].sort((a, b) => 
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );
  
  // Render tasks
  let todoCount = 0;
  let inprogressCount = 0;
  let doneCount = 0;
  
  sortedTasks.forEach(task => {
    const taskCard = createTaskCard(task);
    
    if (task.column === 'todo') {
      todoContainer.appendChild(taskCard);
      todoCount++;
    } else if (task.column === 'inprogress') {
      inprogressContainer.appendChild(taskCard);
      inprogressCount++;
    } else if (task.column === 'done') {
      doneContainer.appendChild(taskCard);
      doneCount++;
    }
  });
  
  // Update counts
  document.getElementById('todoCount').textContent = todoCount;
  document.getElementById('inprogressCount').textContent = inprogressCount;
  document.getElementById('doneCount').textContent = doneCount;
  
  // Re-enable drag and drop
  setupDragAndDrop();
}

function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = 'kanban-card';
  card.setAttribute('draggable', 'true');
  card.setAttribute('data-task-id', task.id);
  card.setAttribute('data-testid', 'kanban-card');
  
  const priorityClasses = {
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low'
  };
  
  let content = `
    <div class=\"flex items-start justify-between mb-2\">
      <span class=\"${priorityClasses[task.priority]} text-xs\" data-testid=\"task-priority-badge\">${task.priority.toUpperCase()}</span>
      <div class=\"flex gap-1\">
        <button class=\"btn btn-ghost btn-xs\" onclick=\"window.viewKanbanTaskDetails('${task.id}')\" data-testid=\"view-task-button\" title=\"View Details\">
          <i class=\"fas fa-eye\"></i>
        </button>
        <button class=\"btn btn-ghost btn-xs\" onclick=\"window.editKanbanTask('${task.id}')\" data-testid=\"edit-task-button\" title=\"Edit Task\">
          <i class=\"fas fa-edit\"></i>
        </button>
        <button class=\"btn btn-ghost btn-xs text-error\" onclick=\"window.deleteKanbanTask('${task.id}')\" data-testid=\"delete-task-button\" title=\"Delete Task\">
          <i class=\"fas fa-trash\"></i>
        </button>
      </div>
    </div>
    <div class=\"task-content cursor-pointer\" onclick=\"window.viewKanbanTaskDetails('${task.id}')\">
      <p class=\"font-medium mb-2\" data-testid=\"task-text\">${task.text}</p>
    </div>
  `;
  
  // Show creation timestamp for To Do
  if (task.column === 'todo' && task.createdAt) {
    const createdDate = task.createdAt.toDate ? task.createdAt.toDate() : new Date(task.createdAt);
    content += `<p class=\"text-xs text-base-content/50\">Created: ${createdDate.toLocaleDateString()}</p>`;
  }
  
  // Show live timer for In Progress
  if (task.column === 'inprogress') {
    let elapsedTime = 0;
    if (timerManager && timerManager.isTimerActive(task.id)) {
      elapsedTime = timerManager.getElapsedTime(task.id);
    } else {
      elapsedTime = task.timeSpent || 0;
    }
    content += `<div class=\"timer-display text-sm font-mono text-success\">⏱ ${formatElapsedTime(elapsedTime)}</div>`;
    
    if (task.createdAt) {
      const createdDate = task.createdAt.toDate ? task.createdAt.toDate() : new Date(task.createdAt);
      content += `<p class=\"text-xs text-base-content/50 mt-1\">Created: ${createdDate.toLocaleDateString()}</p>`;
    }
  }
  
  // Show completion info for Done
  if (task.column === 'done') {
    if (task.timeSpent && task.timeSpent > 0) {
      content += `<div class=\"text-sm text-success\">Completed in ${formatCompletedTime(task.timeSpent)}</div>`;
    } else {
      content += `<div class=\"text-sm text-base-content/50\">Completed [Time Not Tracked]</div>`;
    }
    
    if (task.completedAt) {
      const completedDate = task.completedAt.toDate ? task.completedAt.toDate() : new Date(task.completedAt);
      content += `<p class=\"text-xs text-base-content/50 mt-1\">on ${completedDate.toLocaleDateString()}</p>`;
    }
  }
  
  card.innerHTML = content;
  return card;
}

async function handleAddTask(e) {
  e.preventDefault();
  
  const nameInput = document.getElementById('taskNameInput');
  const prioritySelect = document.getElementById('taskPriority');
  const columnSelect = document.getElementById('taskColumn');
  
  const text = nameInput.value.trim();
  if (text.length === 0) {
    nameInput.classList.add('border-error');
    setTimeout(() => nameInput.classList.remove('border-error'), 500);
    return;
  }
  
  const now = Date.now();
  const column = columnSelect.value;
  
  const taskData = {
    text: text,
    description: '',
    priority: prioritySelect.value,
    column: column,
    dueDate: null,
    createdAt: now,
    lastEditedAt: null,
    startedAt: column === 'inprogress' ? now : null,
    completedAt: column === 'done' ? now : null,
    timeSpent: 0,
    timerStartTime: column === 'inprogress' ? now : null,
    inProgressSince: column === 'inprogress' ? now : null
  };
  
  const result = await createKanbanTask(currentUser.uid, taskData);
  
  if (result.success) {
    nameInput.value = '';
    
    // If added to In Progress, start timer
    if (column === 'inprogress') {
      const newTask = { id: result.id, ...taskData };
      tasks.push(newTask);
      timerManager.startTimer(result.id, now);
    }
    
    await loadTasks();
    initializeTimers();
    renderTasks();
  }
}

// View task details modal
window.viewKanbanTaskDetails = function(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  
  openTaskDetailsModal(task, timerManager);
};

// Edit task modal
window.editKanbanTask = async function(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  
  openTaskEditorModal(task, async (updatedData) => {
    const updates = {
      text: updatedData.text,
      description: updatedData.description,
      priority: updatedData.priority,
      dueDate: updatedData.dueDate,
      lastEditedAt: Date.now()
    };
    
    // Handle column/status change
    const oldColumn = task.column;
    const newColumn = updatedData.column;
    
    if (oldColumn !== newColumn) {
      updates.column = newColumn;
      
      // Stop timer when leaving In Progress
      if (oldColumn === 'inprogress' && newColumn !== 'inprogress') {
        if (task.inProgressSince) {
          const sessionTime = Date.now() - task.inProgressSince;
          updates.timeSpent = (task.timeSpent || 0) + sessionTime;
        }
        updates.timerStartTime = null;
        updates.inProgressSince = null;
        timerManager.stopTimer(taskId);
        
        if (newColumn === 'done') {
          updates.completedAt = Date.now();
        }
      }
      
      // Start timer when moving to In Progress
      if (newColumn === 'inprogress' && oldColumn !== 'inprogress') {
        if (!task.startedAt) {
          updates.startedAt = Date.now();
        }
        updates.inProgressSince = Date.now();
        const previousTimeSpent = task.timeSpent || 0;
        const adjustedStartTime = Date.now() - previousTimeSpent;
        updates.timerStartTime = adjustedStartTime;
        timerManager.startTimer(taskId, adjustedStartTime);
      }
    }
    
    await updateKanbanTask(taskId, updates);
    await loadTasks();
    initializeTimers();
    renderTasks();
  });
};

window.deleteKanbanTask = async function(taskId) {
  if (confirm('Delete this task? This action cannot be undone.')) {
    timerManager.stopTimer(taskId);
    await deleteKanbanTask(taskId);
    await loadTasks();
    initializeTimers();
    renderTasks();
  }
};

function setupDragAndDrop() {
  const cards = document.querySelectorAll('.kanban-card');
  const columns = document.querySelectorAll('[data-column]');
  
  cards.forEach(card => {
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
  });
  
  columns.forEach(column => {
    column.addEventListener('dragover', handleDragOver);
    column.addEventListener('drop', handleDrop);
    column.addEventListener('dragleave', handleDragLeave);
  });
}

let draggedTaskId = null;

function handleDragStart(e) {
  draggedTaskId = e.target.getAttribute('data-task-id');
  e.target.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
  e.target.classList.remove('dragging');
  document.querySelectorAll('.drop-target').forEach(col => col.classList.remove('drop-target'));
}

function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drop-target');
}

function handleDragLeave(e) {
  if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget)) {
    e.currentTarget.classList.remove('drop-target');
  }
}

async function handleDrop(e) {
  e.preventDefault();
  
  const column = e.target.closest('[data-column]');
  if (!column) return;
  
  const newColumn = column.getAttribute('data-column');
  column.classList.remove('drop-target');
  
  if (!draggedTaskId) return;
  
  const task = tasks.find(t => t.id === draggedTaskId);
  if (!task) return;
  
  const oldColumn = task.column;
  if (oldColumn === newColumn) return;
  
  // Handle timer state changes (Kanby logic)
  const updates = { column: newColumn };
  
  // Stop timer when leaving In Progress
  if (oldColumn === 'inprogress' && newColumn !== 'inprogress') {
    if (task.inProgressSince) {
      const sessionTime = Date.now() - task.inProgressSince;
      updates.timeSpent = (task.timeSpent || 0) + sessionTime;
    }
    updates.timerStartTime = null;
    updates.inProgressSince = null;
    timerManager.stopTimer(task.id);
    
    // Mark as completed if moving to Done
    if (newColumn === 'done') {
      updates.completedAt = Date.now();
    }
  }
  
  // Start timer when moving to In Progress
  if (newColumn === 'inprogress' && oldColumn !== 'inprogress') {
    if (!task.startedAt) {
      updates.startedAt = Date.now();
    }
    updates.inProgressSince = Date.now();
    const previousTimeSpent = task.timeSpent || 0;
    const adjustedStartTime = Date.now() - previousTimeSpent;
    updates.timerStartTime = adjustedStartTime;
    timerManager.startTimer(task.id, adjustedStartTime);
  }
  
  await updateKanbanTask(draggedTaskId, updates);
  await loadTasks();
  initializeTimers();
  renderTasks();
  
  draggedTaskId = null;
}
