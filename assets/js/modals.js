// Modal Management for TaskSights
// Task Editor and Details Viewer Modals

// Open task editor modal (for creating or editing)
export function openTaskEditorModal(task, onSave) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-50 fade-in';
  modal.id = 'taskEditorModal';
  
  modal.innerHTML = `
    <div class="bg-base-200 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-base-300">
        <h2 class="text-2xl font-bold">${task ? 'Edit Task' : 'Add Task'}</h2>
        <button class="btn btn-ghost btn-sm btn-circle" id="closeModalBtn" data-testid="close-modal-button">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      
      <!-- Body -->
      <div class="p-6 space-y-6">
        <!-- Task Name -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Task Name *</span>
          </label>
          <input 
            type="text" 
            class="input input-bordered w-full" 
            id="modalTaskName"
            placeholder="Enter task name..."
            value="${task ? task.text : ''}"
            data-testid="modal-task-name"
            required
          >
        </div>
        
        <!-- Description -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Description</span>
          </label>
          <textarea 
            class="textarea textarea-bordered h-24" 
            id="modalTaskDescription"
            placeholder="Add task description..."
            data-testid="modal-task-description"
          >${task ? (task.description || '') : ''}</textarea>
        </div>
        
        <!-- Priority -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Priority</span>
          </label>
          <select class="select select-bordered w-full" id="modalTaskPriority" data-testid="modal-task-priority">
            <option value="high" ${task && task.priority === 'high' ? 'selected' : ''}>High</option>
            <option value="medium" ${!task || task.priority === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="low" ${task && task.priority === 'low' ? 'selected' : ''}>Low</option>
          </select>
        </div>
        
        <!-- Status/Column -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Status</span>
          </label>
          <select class="select select-bordered w-full" id="modalTaskStatus" data-testid="modal-task-status">
            <option value="todo" ${!task || task.column === 'todo' ? 'selected' : ''}>To Do</option>
            <option value="inprogress" ${task && task.column === 'inprogress' ? 'selected' : ''}>In Progress</option>
            <option value="done" ${task && task.column === 'done' ? 'selected' : ''}>Done</option>
          </select>
        </div>
        
        <!-- Due Date -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">
              <i class="fas fa-calendar-check"></i> Due Date & Time
            </span>
          </label>
          <input 
            type="datetime-local" 
            class="input input-bordered w-full" 
            id="modalTaskDueDate"
            data-testid="modal-task-due-date"
            value="${task && task.dueDate ? formatDateTimeLocal(task.dueDate) : ''}"
          >
          <label class="label">
            <span class="label-text-alt">
              <i class="fas fa-info-circle"></i> Set when this task needs to be completed
            </span>
          </label>
        </div>
        
        ${task && task.lastEditedAt ? `
          <div class="text-sm text-base-content/50">
            Last edited: ${formatTimestamp(task.lastEditedAt)}
          </div>
        ` : ''}
      </div>
      
      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 p-6 border-t border-base-300">
        <button class="btn btn-ghost" id="cancelModalBtn" data-testid="cancel-modal-button">
          Cancel
        </button>
        <button class="btn btn-primary" id="saveModalBtn" data-testid="save-modal-button">
          <i class="fas fa-save"></i>
          ${task ? 'Save Changes' : 'Add Task'}
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Focus on task name
  const taskNameInput = modal.querySelector('#modalTaskName');
  setTimeout(() => {
    taskNameInput.focus();
    taskNameInput.select();
  }, 100);
  
  // Event listeners
  const closeModal = () => modal.remove();
  
  modal.querySelector('#closeModalBtn').addEventListener('click', closeModal);
  modal.querySelector('#cancelModalBtn').addEventListener('click', closeModal);
  
  modal.querySelector('#saveModalBtn').addEventListener('click', () => {
    const taskName = modal.querySelector('#modalTaskName').value.trim();
    const description = modal.querySelector('#modalTaskDescription').value.trim();
    const priority = modal.querySelector('#modalTaskPriority').value;
    const status = modal.querySelector('#modalTaskStatus').value;
    const dueDate = modal.querySelector('#modalTaskDueDate').value;
    
    if (taskName.length === 0) {
      taskNameInput.classList.add('input-error');
      setTimeout(() => taskNameInput.classList.remove('input-error'), 500);
      return;
    }
    
    if (onSave) {
      onSave({
        text: taskName,
        description,
        priority,
        column: status,
        dueDate: dueDate ? new Date(dueDate).getTime() : null
      });
    }
    
    closeModal();
  });
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  // Close on Escape
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  });
  
  // Save on Enter in name field
  taskNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      modal.querySelector('#saveModalBtn').click();
    }
  });
}

// Open task details viewer modal
export function openTaskDetailsModal(task, timerManager) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-50 fade-in';
  modal.id = 'taskDetailsModal';
  
  // Calculate time info
  let timeInfo = '';
  if (task.column === 'inprogress') {
    const elapsedTime = timerManager && timerManager.isTimerActive(task.id) 
      ? timerManager.getElapsedTime(task.id) 
      : (task.timeSpent || 0);
    timeInfo = `<div class="stat">
      <div class="stat-title">Time Tracking</div>
      <div class="stat-value text-success">⏱ ${formatElapsedTime(elapsedTime)}</div>
      <div class="stat-desc">Currently in progress</div>
    </div>`;
  } else if (task.column === 'done' && task.timeSpent) {
    timeInfo = `<div class="stat">
      <div class="stat-title">Completion Time</div>
      <div class="stat-value text-success">${formatCompletedTime(task.timeSpent)}</div>
      <div class="stat-desc">Total time tracked</div>
    </div>`;
  }
  
  const priorityColors = {
    high: 'badge-error',
    medium: 'badge-warning',
    low: 'badge-info'
  };
  
  const statusColors = {
    todo: 'badge-info',
    inprogress: 'badge-warning',
    done: 'badge-success'
  };
  
  const statusLabels = {
    todo: 'To Do',
    inprogress: 'In Progress',
    done: 'Done'
  };
  
  modal.innerHTML = `
    <div class="bg-base-200 rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-base-300">
        <h2 class="text-2xl font-bold">Task Details</h2>
        <button class="btn btn-ghost btn-sm btn-circle" id="closeDetailsBtn" data-testid="close-details-button">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      
      <!-- Body -->
      <div class="p-6 space-y-6">
        <!-- Task Name -->
        <div>
          <h3 class="text-xl font-bold mb-2">${task.text}</h3>
          <div class="flex gap-2">
            <span class="badge ${priorityColors[task.priority]}">${task.priority.toUpperCase()}</span>
            <span class="badge ${statusColors[task.column]}">${statusLabels[task.column]}</span>
          </div>
        </div>
        
        <!-- Description -->
        ${task.description ? `
          <div>
            <h4 class="font-semibold mb-2"><i class="fas fa-align-left"></i> Description</h4>
            <p class="text-base-content/80 whitespace-pre-wrap">${task.description}</p>
          </div>
        ` : ''}
        
        <!-- Due Date -->
        ${task.dueDate ? `
          <div>
            <h4 class="font-semibold mb-2"><i class="fas fa-calendar-check"></i> Due Date</h4>
            <p class="text-base-content/80">${formatDueDateDisplay(task.dueDate)}</p>
          </div>
        ` : ''}
        
        <!-- Stats -->
        <div class="stats stats-vertical lg:stats-horizontal shadow w-full">
          <div class="stat">
            <div class="stat-title">Created</div>
            <div class="stat-value text-sm">${task.createdAt ? formatTimestamp(task.createdAt) : 'Unknown'}</div>
            <div class="stat-desc">Task creation date</div>
          </div>
          
          ${task.startedAt ? `
            <div class="stat">
              <div class="stat-title">Started</div>
              <div class="stat-value text-sm">${formatTimestamp(task.startedAt)}</div>
              <div class="stat-desc">First time in progress</div>
            </div>
          ` : ''}
          
          ${task.completedAt ? `
            <div class="stat">
              <div class="stat-title">Completed</div>
              <div class="stat-value text-sm">${formatTimestamp(task.completedAt)}</div>
              <div class="stat-desc">Task completion date</div>
            </div>
          ` : ''}
          
          ${timeInfo}
        </div>
      </div>
      
      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 p-6 border-t border-base-300">
        <button class="btn btn-ghost" id="closeDetailsFooterBtn">
          Close
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  const closeModal = () => modal.remove();
  
  modal.querySelector('#closeDetailsBtn').addEventListener('click', closeModal);
  modal.querySelector('#closeDetailsFooterBtn').addEventListener('click', closeModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  });
}

// Helper functions
function formatDateTimeLocal(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatTimestamp(timestamp) {
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDueDateDisplay(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatElapsedTime(milliseconds) {
  if (milliseconds < 0) return '00:00:00';
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

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
