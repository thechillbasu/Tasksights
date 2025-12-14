// Kanban Board Module for TaskSights
import { getKanbanTasks, createKanbanTask, updateKanbanTask, deleteKanbanTask } from '../firestore-helpers.js';

let tasks = [];
let currentUser = null;

export async function initKanban(user) {
  console.log('Initializing Kanban module');
  currentUser = user;
  
  const kanbanContent = document.getElementById('kanbanContent');
  if (!kanbanContent) return;
  
  // Render Kanban UI
  kanbanContent.innerHTML = `
    <!-- Add Task Form -->
    <div class="card bg-base-200 shadow-md mb-6" data-testid="add-task-form">
      <div class="card-body">
        <form id="addTaskForm" class="flex flex-col md:flex-row gap-4">
          <input type="text" placeholder="Task name..." class="input input-bordered flex-1" 
            id="taskNameInput" data-testid="task-name-input" required>
          <select class="select select-bordered" id="taskPriority" data-testid="task-priority-select">
            <option value="high">High Priority</option>
            <option value="medium" selected>Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <select class="select select-bordered" id="taskColumn" data-testid="task-column-select">
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button type="submit" class="btn btn-primary" data-testid="add-task-button">
            <i class="fas fa-plus"></i> Add Task
          </button>
        </form>
      </div>
    </div>
    
    <!-- Kanban Board -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- To Do Column -->
      <div class="kanban-column" data-column="todo" data-testid="kanban-column-todo">
        <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
          <i class="fas fa-clipboard-list text-info"></i>
          To Do
          <span class="badge badge-info" id="todoCount">0</span>
        </h3>
        <div id="todoContainer" class="space-y-3 min-h-[200px]">
          <!-- Tasks will be rendered here -->
        </div>
      </div>
      
      <!-- In Progress Column -->
      <div class="kanban-column" data-column="inprogress" data-testid="kanban-column-inprogress">
        <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
          <i class="fas fa-spinner text-warning"></i>
          In Progress
          <span class="badge badge-warning" id="inprogressCount">0</span>
        </h3>
        <div id="inprogressContainer" class="space-y-3 min-h-[200px]">
          <!-- Tasks will be rendered here -->
        </div>
      </div>
      
      <!-- Done Column -->
      <div class="kanban-column" data-column="done" data-testid="kanban-column-done">
        <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
          <i class="fas fa-check-circle text-success"></i>
          Done
          <span class="badge badge-success" id="doneCount">0</span>
        </h3>
        <div id="doneContainer" class="space-y-3 min-h-[200px]">
          <!-- Tasks will be rendered here -->
        </div>
      </div>
    </div>
  `;
  
  // Load tasks
  await loadTasks();
  
  // Set up event listeners
  document.getElementById('addTaskForm')?.addEventListener('submit', handleAddTask);
  setupDragAndDrop();
}

async function loadTasks() {
  const result = await getKanbanTasks(currentUser.uid);
  if (result.success) {
    tasks = result.tasks;
    renderTasks();
  }
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
  
  // Sort by priority
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
}

function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = 'kanban-card';
  card.setAttribute('draggable', 'true');
  card.setAttribute('data-task-id', task.id);
  card.setAttribute('data-testid', 'kanban-card');
  
  const priorityClasses = {
    high: 'badge-error',
    medium: 'badge-warning',
    low: 'badge-info'
  };
  
  card.innerHTML = `
    <div class="flex items-start justify-between mb-2">
      <span class="badge ${priorityClasses[task.priority]} badge-sm" data-testid="task-priority-badge">${task.priority.toUpperCase()}</span>
      <div class="flex gap-1">
        <button class="btn btn-ghost btn-xs" onclick="window.editKanbanTask('${task.id}')" data-testid="edit-task-button">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-ghost btn-xs text-error" onclick="window.deleteKanbanTask('${task.id}')" data-testid="delete-task-button">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
    <p class="font-medium mb-2" data-testid="task-text">${task.text}</p>
    ${task.description ? `<p class="text-sm text-base-content/70 mb-2">${task.description}</p>` : ''}
    ${task.dueDate ? `<p class="text-xs text-base-content/50"><i class="fas fa-calendar"></i> Due: ${new Date(task.dueDate).toLocaleDateString()}</p>` : ''}
  `;
  
  return card;
}

async function handleAddTask(e) {
  e.preventDefault();
  
  const nameInput = document.getElementById('taskNameInput');
  const prioritySelect = document.getElementById('taskPriority');
  const columnSelect = document.getElementById('taskColumn');
  
  const taskData = {
    text: nameInput.value.trim(),
    description: '',
    priority: prioritySelect.value,
    column: columnSelect.value,
    dueDate: null,
    timeSpent: 0
  };
  
  const result = await createKanbanTask(currentUser.uid, taskData);
  
  if (result.success) {
    nameInput.value = '';
    await loadTasks();
  }
}

window.editKanbanTask = async function(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  
  const newText = prompt('Task name:', task.text);
  if (newText) {
    await updateKanbanTask(taskId, { text: newText });
    await loadTasks();
  }
};

window.deleteKanbanTask = async function(taskId) {
  if (confirm('Delete this task?')) {
    await deleteKanbanTask(taskId);
    await loadTasks();
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
  });
}

let draggedTaskId = null;

function handleDragStart(e) {
  draggedTaskId = e.target.getAttribute('data-task-id');
  e.target.classList.add('opacity-50');
}

function handleDragEnd(e) {
  e.target.classList.remove('opacity-50');
}

function handleDragOver(e) {
  e.preventDefault();
}

async function handleDrop(e) {
  e.preventDefault();
  
  const column = e.target.closest('[data-column]');
  if (!column) return;
  
  const newColumn = column.getAttribute('data-column');
  
  if (draggedTaskId) {
    await updateKanbanTask(draggedTaskId, { column: newColumn });
    await loadTasks();
    draggedTaskId = null;
  }
}