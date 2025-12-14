// Date and Time Formatting Utilities
// 
// Provides functions for formatting timestamps, dates, and due dates in various
// formats for display in the UI. Handles urgency calculations for due dates.

// Format timestamp to readable date string
export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  
  const dayOfWeek = date.toLocaleDateString('en-US', { 
    weekday: 'long'
  });
  
  const dateStr = date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  const timeStr = date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  return `${dayOfWeek}, ${dateStr} at ${timeStr}`;
}

// Format timestamp for datetime-local input
export function formatDateTimeLocal(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Format due date with urgency indicators
export function formatDueDate(timestamp) {
  const dueDate = new Date(timestamp);
  const now = new Date();
  
  // Normalize to midnight for accurate day comparison
  const dueDateMidnight = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowMidnight = new Date(todayMidnight);
  tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);
  
  const diffMs = dueDate - now;
  const diffDays = Math.floor((dueDateMidnight - todayMidnight) / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  const dateStr = dueDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  // Check if overdue
  if (diffMs < 0) {
    return { text: `Overdue: ${dateStr}`, isOverdue: true, isUrgent: false };
  }
  
  // Check if due today
  if (diffDays === 0) {
    return { text: `Due today: ${dateStr}`, isOverdue: false, isUrgent: true };
  }
  
  // Check if due tomorrow
  if (diffDays === 1) {
    return { text: `Due tomorrow: ${dateStr}`, isOverdue: false, isUrgent: true };
  }
  
  // Check if within 48 hours
  if (diffHours < 48 && diffHours >= 0) {
    return { text: `Due in ${diffHours}h: ${dateStr}`, isOverdue: false, isUrgent: true };
  }
  
  return { text: `Due: ${dateStr}`, isOverdue: false, isUrgent: false };
}

// Format date for display in picker
export function formatDueDateDisplay(date) {
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}








