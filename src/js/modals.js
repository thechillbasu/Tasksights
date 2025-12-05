// Modal Management - Task Editor and Details Viewer
// 
// Handles all modal dialogs for task creation, editing, and viewing details.
// Manages the task editor modal with date/time picker and the task details
// viewer modal. Coordinates with notes and rendering modules.

import { formatTimestamp, formatDateTimeLocal, formatDueDateDisplay } from './formatters.js';
import { formatElapsedTime, formatCompletedTime } from './timer.js';

// Open modal for adding or editing a task
export function openTaskModal(note, taskText, taskColumn, taskPriority, taskDueDate, saveCallback) {
  // Format due date for datetime-local input
  const dueDateValue = note?.dueDate ? formatDateTimeLocal(note.dueDate) : (taskDueDate ? formatDateTimeLocal(taskDueDate) : '');
  
  // Create modal element with form
  const modal = document.createElement('div');
  modal.className = 'taskModal';
  modal.innerHTML = `
    <div class="modalContent">
      <div class="modalHeader">
        <h2>${note ? 'Edit Task' : 'Add Task Details'}</h2>
        <button class="modalClose">&times;</button>
      </div>
      <div class="modalBody">
        <div class="formGroup">
          <label for="modalTaskName">Task Name *</label>
          <input type="text" id="modalTaskName" value="${note ? note.text : taskText}" required>
        </div>
        <div class="formGroup">
          <label for="modalTaskDescription">Description</label>
          <textarea id="modalTaskDescription" rows="4" placeholder="Add task description...">${note ? (note.description || '') : ''}</textarea>
        </div>
        <div class="formGroup">
          <label for="modalTaskPriority">Priority</label>
          <select id="modalTaskPriority">
            <option value="high" ${(note ? note.priority : taskPriority) === 'high' ? 'selected' : ''}>High</option>
            <option value="medium" ${(note ? note.priority : taskPriority) === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="low" ${(note ? note.priority : taskPriority) === 'low' ? 'selected' : ''}>Low</option>
          </select>
        </div>
        <div class="formGroup dueDateGroup">
          <label for="modalTaskDueDate">
            <i class="fas fa-calendar-check"></i> Due Date & Time
          </label>
          <div class="dueDateInputWrapper">
            <input type="datetime-local" id="modalTaskDueDate" value="${dueDateValue}" style="display: none;">
            <input type="text" id="dueDateDisplay" class="dueDateDisplay" placeholder="Due Date and Time not set" readonly>
            <button type="button" class="btnSelectDateTime" id="btnSelectDateTime">
              <i class="fas fa-calendar-alt"></i> Select Due Date & Time
            </button>
            <div class="dateTimePickerPopup" id="dateTimePickerPopup" style="display: none;">
              <div class="dateTimePicker">
                <div class="pickerLabel">Date:</div>
                <input type="date" id="datePickerInput" class="dateInput">
                <div class="pickerLabel">Time:</div>
                <input type="time" id="timePickerInput" class="timeInput">
                <button type="button" class="btnDonePicker" id="btnDonePicker">
                  <i class="fas fa-check"></i> Done
                </button>
              </div>
            </div>
            <span class="dueDateHint">
              <i class="fas fa-info-circle"></i>
              Set when this task needs to be completed
            </span>
          </div>
          ${note?.dueDate ? '<button type="button" class="btnClearDueDate" title="Clear due date"><i class="fas fa-times-circle"></i> Clear Due Date</button>' : ''}
        </div>
        ${note && note.lastEditedAt ? `
          <div class="lastEdited">
            Last edited: ${formatTimestamp(note.lastEditedAt)}
          </div>
        ` : ''}
      </div>
      <div class="modalFooter">
        <button class="btnCancel">Cancel</button>
        <button class="btnSave">${note ? 'Save Changes' : 'Add Task'}</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  // Initialize custom date/time picker
  initializeDateTimePicker(modal, dueDateValue);
  
  // Focus on task name input
  const taskNameInput = modal.querySelector('#modalTaskName');
  taskNameInput.focus();
  taskNameInput.select();
  
  // Get modal buttons
  const closeBtn = modal.querySelector('.modalClose');
  const cancelBtn = modal.querySelector('.btnCancel');
  const saveBtn = modal.querySelector('.btnSave');
  
  // Close modal function
  const closeModal = () => {
    modal.remove();
  };
  
  // Save task function
  const saveTask = () => {
    // Get form values
    const newText = taskNameInput.value.trim();
    const newDescription = modal.querySelector('#modalTaskDescription').value.trim();
    const newPriority = modal.querySelector('#modalTaskPriority').value;
    const dueDateInput = modal.querySelector('#modalTaskDueDate').value;
    const newDueDate = dueDateInput ? new Date(dueDateInput).getTime() : null;
    
    // Validate task name
    if (newText.length === 0) {
      taskNameInput.classList.add('invalidInput');
      setTimeout(() => taskNameInput.classList.remove('invalidInput'), 500);
      return;
    }
    
    if (saveCallback) {
      saveCallback(note, newText, newDescription, newPriority, newDueDate, taskColumn);
    }
    
    closeModal();
  };
  
  // Attach event listeners
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  saveBtn.addEventListener('click', saveTask);
  
  // Clear due date button
  const clearDueDateBtn = modal.querySelector('.btnClearDueDate');
  if (clearDueDateBtn) {
    clearDueDateBtn.addEventListener('click', () => {
      modal.querySelector('#modalTaskDueDate').value = '';
      const displayInput = modal.querySelector('#dueDateDisplay');
      displayInput.value = '';
      displayInput.classList.remove('hasValue');
      clearDueDateBtn.remove();
    });
  }
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', function escapeHandler(e) {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escapeHandler);
    }
  });
  
  // Save on Enter key in task name field
  taskNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveTask();
    }
  });
}

// Initialize custom date/time picker in modal
function initializeDateTimePicker(modal, initialValue) {
  const btnSelectDateTime = modal.querySelector('#btnSelectDateTime');
  const dateTimePickerPopup = modal.querySelector('#dateTimePickerPopup');
  const datePickerInput = modal.querySelector('#datePickerInput');
  const timePickerInput = modal.querySelector('#timePickerInput');
  const btnDonePicker = modal.querySelector('#btnDonePicker');
  const hiddenInput = modal.querySelector('#modalTaskDueDate');
  const displayInput = modal.querySelector('#dueDateDisplay');
  
  // Set initial values if provided
  if (initialValue) {
    datePickerInput.value = initialValue.split('T')[0];
    timePickerInput.value = initialValue.split('T')[1];
    const date = new Date(initialValue);
    displayInput.value = formatDueDateDisplay(date);
    displayInput.classList.add('hasValue');
  }
  
  // Toggle picker visibility
  btnSelectDateTime.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = dateTimePickerPopup.style.display === 'block';
    
    if (isVisible) {
      dateTimePickerPopup.style.display = 'none';
      dateTimePickerPopup.classList.remove('active');
    } else {
      // Set current date/time if empty
      if (!datePickerInput.value) {
        const now = new Date();
        datePickerInput.value = formatDateTimeLocal(now.getTime()).split('T')[0];
        timePickerInput.value = formatDateTimeLocal(now.getTime()).split('T')[1];
      }
      dateTimePickerPopup.style.display = 'block';
      dateTimePickerPopup.classList.add('active');
      
      // Scroll picker into view
      setTimeout(() => {
        dateTimePickerPopup.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  });
  
  // Open native date picker on click
  datePickerInput.addEventListener('click', (e) => {
    e.stopPropagation();
    datePickerInput.showPicker();
  });
  
  // Open native time picker on click
  timePickerInput.addEventListener('click', (e) => {
    e.stopPropagation();
    timePickerInput.showPicker();
  });
  
  // Save selected date/time
  btnDonePicker.addEventListener('click', () => {
    if (datePickerInput.value && timePickerInput.value) {
      const dateTimeValue = `${datePickerInput.value}T${timePickerInput.value}`;
      hiddenInput.value = dateTimeValue;
      const date = new Date(dateTimeValue);
      displayInput.value = formatDueDateDisplay(date);
      displayInput.classList.add('hasValue');
      dateTimePickerPopup.style.display = 'none';
      dateTimePickerPopup.classList.remove('active');
    }
  });
  
  // Close picker when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dueDateInputWrapper')) {
      dateTimePickerPopup.style.display = 'none';
      dateTimePickerPopup.classList.remove('active');
    }
  });
}

// Open modal to view task details
export function openTaskDetailsModal(note, getTimerManagerCallback, openTaskModalCallback, deleteNoteCallback) {
  const modal = document.createElement('div');
  modal.className = 'taskModal taskDetailsModal';
  
  const priorityLabels = { high: 'High', medium: 'Medium', low: 'Low' };
  const columnLabels = { todo: 'To Do', inprogress: 'In Progress', done: 'Done' };
  const priorityClasses = { high: 'priorityHigh', medium: 'priorityMedium', low: 'priorityLow' };
  const statusClasses = { todo: 'statusTodo', inprogress: 'statusInprogress', done: 'statusDone' };
  
  // Calculate time spent for display
  let timeSpentDisplay = '';
  if (note.startedAt && (note.timeSpent > 0 || note.column === 'inprogress')) {
    if (note.column === 'inprogress' && getTimerManagerCallback) {
      const timerManager = getTimerManagerCallback();
      const elapsedTime = timerManager.getElapsedTime(note.id);
      timeSpentDisplay = formatCompletedTime(elapsedTime);
    } else {
      timeSpentDisplay = formatCompletedTime(note.timeSpent);
    }
  }
  
  modal.innerHTML = `
    <div class="modalContent">
      <div class="modalHeader">
        <h2><i class="fas fa-info-circle"></i> Task Details</h2>
        <button class="modalClose">&times;</button>
      </div>
      <div class="modalBody">
        <div class="detailsView">
          <div class="detailSection">
            <div class="detailLabel"><i class="fas fa-tasks"></i> Task Name</div>
            <div class="detailValue taskName">${note.text}</div>
          </div>
          ${note.description ? `
            <div class="detailSection">
              <div class="detailLabel"><i class="fas fa-align-left"></i> Description</div>
              <div class="detailValue description">${note.description}</div>
            </div>
          ` : ''}
          <div class="detailRow">
            <div class="detailSection">
              <div class="detailLabel"><i class="fas fa-flag"></i> Priority</div>
              <div class="detailValue">
                <span class="priorityBadge ${priorityClasses[note.priority]}">${priorityLabels[note.priority]}</span>
              </div>
            </div>
            <div class="detailSection">
              <div class="detailLabel"><i class="fas fa-columns"></i> Status</div>
              <div class="detailValue statusBadge ${statusClasses[note.column]}">${columnLabels[note.column]}</div>
            </div>
          </div>
          ${note.dueDate ? `
            <div class="detailSection highlight">
              <div class="detailLabel"><i class="fas fa-calendar-check"></i> Due Date & Time</div>
              <div class="detailValue dueDate">${formatDueDateDisplay(new Date(note.dueDate))}</div>
            </div>
          ` : ''}
          <div class="detailSection">
            <div class="detailLabel"><i class="fas fa-calendar-plus"></i> Created</div>
            <div class="detailValue">${formatTimestamp(note.createdAt)}</div>
          </div>
          ${note.lastEditedAt ? `
            <div class="detailSection">
              <div class="detailLabel"><i class="fas fa-edit"></i> Last Edited</div>
              <div class="detailValue">${formatTimestamp(note.lastEditedAt)}</div>
            </div>
          ` : ''}
          ${note.startedAt ? `
            <div class="detailSection">
              <div class="detailLabel"><i class="fas fa-play-circle"></i> First Started</div>
              <div class="detailValue">${formatTimestamp(note.startedAt)}</div>
            </div>
          ` : ''}
          ${timeSpentDisplay && note.column !== 'done' ? `
            <div class="detailSection">
              <div class="detailLabel"><i class="fas fa-hourglass-half"></i> Time Spent On Task</div>
              <div class="detailValue">${timeSpentDisplay}</div>
            </div>
          ` : ''}
          ${note.completedAt && note.column === 'done' ? `
            <div class="detailSection">
              <div class="detailLabel"><i class="fas fa-check-circle"></i> Completed</div>
              <div class="detailValue">${formatTimestamp(note.completedAt)}</div>
            </div>
            <div class="detailSection">
              <div class="detailLabel"><i class="fas fa-clock"></i> Total Time Spent On Task</div>
              <div class="detailValue">${formatCompletedTime(note.timeSpent)}</div>
            </div>
          ` : ''}
        </div>
      </div>
      <div class="modalFooter">
        <button class="btnDelete" data-note-id="${note.id}">
          <i class="fas fa-trash"></i> Delete Task
        </button>
        <button class="btnEdit" data-note-id="${note.id}">
          <i class="fas fa-edit"></i> Edit Task
        </button>
        <button class="btnClose">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  // Get modal buttons
  const closeBtn = modal.querySelector('.modalClose');
  const closeFooterBtn = modal.querySelector('.btnClose');
  const editBtn = modal.querySelector('.btnEdit');
  const deleteBtn = modal.querySelector('.btnDelete');
  
  const closeModal = () => {
    modal.remove();
  };
  
  // Attach event listeners
  closeBtn.addEventListener('click', closeModal);
  closeFooterBtn.addEventListener('click', closeModal);
  
  if (editBtn && openTaskModalCallback) {
    editBtn.addEventListener('click', () => {
      closeModal();
      openTaskModalCallback(note);
    });
  }
  
  if (deleteBtn && deleteNoteCallback) {
    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this task?')) {
        deleteNoteCallback(note.id);
        closeModal();
      }
    });
  }
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', function escapeHandler(e) {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escapeHandler);
    }
  });
}











