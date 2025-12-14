# Kanby - Technical Documentation

**Version:** 3.1.0  
**Last Updated:** December 10, 2025

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [File Structure](#file-structure)
4. [Core Features](#core-features)
5. [Module Documentation](#module-documentation)
6. [Data Flow](#data-flow)
7. [Styling System](#styling-system)
8. [Time Tracking System](#time-tracking-system)
9. [Google Calendar Integration](#google-calendar-integration)
10. [Storage System](#storage-system)
11. [Responsive Design](#responsive-design)
12. [Development Guidelines](#development-guidelines)

## Project Overview

Kanby is a modern Kanban task management application built with vanilla JavaScript, HTML, and CSS. It provides a feature-rich kanban board interface with drag-and-drop functionality, comprehensive time tracking, Google Calendar integration, and a sleek dark/light theme system.

### Technology Stack
- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Modular CSS with custom properties
- **Storage**: Browser localStorage
- **External APIs**: Google Calendar API, Google Identity Services

### Design Philosophy
- Clean, professional code without decorative elements
- Modular architecture with clear separation of concerns
- Event-driven communication between modules
- Mobile-first responsive design
- Accessibility compliance

## Architecture

### Design Pattern
The application follows a modular architecture with:
- **State Management**: Centralized notes state in notes.js
- **Rendering**: DOM manipulation isolated in rendering.js
- **Event-Driven**: Custom events for cross-module communication
- **Component-Based CSS**: Modular CSS files for different UI components

### Module Organization
```
Application Entry (main.js)
    ├── Notes Management (notes.js)
    ├── Rendering (rendering.js)
    ├── Drag & Drop (dragDrop.js)
    ├── Storage (storage.js)
    ├── Timer (timer.js)
    ├── Modals (modals.js)
    ├── Formatters (formatters.js)
    ├── Theme (theme.js)
    ├── Header Widgets (headerWidgets.js)
    └── Google Calendar (googleCalendar.js)
```

## File Structure

### HTML
- **index.html**: Main HTML structure with semantic markup

### CSS Modules (15 files)
- **variables.css**: Design tokens (colors, spacing, shadows)
- **base.css**: Global styles and resets
- **headerBase.css**: Header structure and components
- **headerCalendar.css**: Google Calendar integration styles
- **headerThemes.css**: Light mode theme overrides
- **headerResponsive.css**: Header responsive breakpoints
- **form.css**: Task creation form styles
- **board.css**: Kanban board layout with custom scrollbars
- **cards.css**: Task card styles and interactions
- **priority.css**: Priority badge styles
- **modalBase.css**: Base modal styles with custom scrollbars
- **detailsViewerModal.css**: Task details viewer modal
- **detailsEditorModal.css**: Task editor modal with date picker
- **utilities.css**: Utility classes and helpers
- **responsive.css**: Additional responsive improvements

### JavaScript Modules (11 files)
- **main.js**: Application orchestration and initialization
- **notes.js**: Task CRUD operations and state management
- **rendering.js**: DOM element creation and rendering
- **dragDrop.js**: HTML5 drag and drop implementation
- **storage.js**: localStorage operations and data migration
- **timer.js**: Time tracking with TimerManager class
- **modals.js**: Modal dialog management
- **formatters.js**: Date and time formatting utilities
- **theme.js**: Dark/light theme switching
- **headerWidgets.js**: Live clock widget
- **googleCalendar.js**: Google OAuth and Calendar API integration

## Core Features

### 1. Kanban Board
- **Three Columns**: To Do, In Progress, Done
- **Drag and Drop**: HTML5 drag and drop API
- **Priority Levels**: High (red), Medium (orange), Low (turquoise)
- **Color-Coded Columns**:
  - To Do: Cyan (#00f0ff)
  - In Progress: Lime (#ccff00)
  - Done: Violet (#9d00ff)

### 2. Task Management
- **Create**: Quick add form with priority and column selection
- **Edit**: Full modal editor with description and due date
- **Delete**: Confirmation before deletion
- **View Details**: Read-only modal showing all task information
- **Due Dates**: Date/time picker with urgency indicators
- **Descriptions**: Optional detailed task descriptions

### 3. Time Tracking
- **Automatic Start**: Timer starts when task moves to In Progress
- **Real-World Tracking**: Continues even when browser is closed
- **Accumulative**: Tracks total time across multiple sessions
- **Live Display**: Real-time HH:MM:SS format
- **Session Continuity**: Timer resumes from previous time
- **Completion Summary**: Shows total time for completed tasks

### 4. Theme System
- **Dark Mode**: Default cyberpunk neon theme
- **Light Mode**: Clean, professional light theme
- **System Detection**: Auto-detects OS theme preference
- **Manual Toggle**: Button to switch themes
- **Persistent**: Saves preference to localStorage

### 5. Google Calendar Integration
- **Holiday Calendar**: Embedded iframe showing Indian holidays
- **Personal Events**: OAuth integration for user's calendar
- **Event Display**: Shows upcoming events with time and location
- **Dual View**: Switch between iframe and events list

### 6. Live Clock
- **Real-Time Display**: Shows current time and date
- **Clickable**: Opens Google Calendar iframe
- **Formatted**: Day, date, and time in readable format

## Module Documentation

### main.js - Application Orchestration

**Purpose**: Central hub that initializes and coordinates all modules

**Key Functions**:
```javascript
init()                    // Initializes the application
initializeTimers()        // Starts timers for in-progress tasks
updateTimerDisplays()     // Updates timer displays every second
handleTaskSave()          // Processes task creation/editing
handleDeleteNote()        // Handles task deletion
getTimerManager()         // Returns timer manager instance
```

**Responsibilities**:
- Load notes from storage
- Initialize timer manager
- Set up event listeners
- Coordinate between modules
- Handle Google Calendar panel

### notes.js - Task CRUD Operations

**Purpose**: Manages task state and operations

**Key Functions**:
```javascript
getNotes()                // Returns notes array
setNotes(newNotes)        // Updates notes array
addNote()                 // Creates new task
deleteNote()              // Removes task
updateNote()              // Modifies existing task
handleFormSubmit()        // Processes form submission
handleButtonClick()       // Routes button clicks
```

**Data Structure**:
```javascript
{
  id: timestamp,              // Unique identifier
  text: string,               // Task name
  description: string,        // Optional details
  column: 'todo|inprogress|done',
  priority: 'high|medium|low',
  dueDate: timestamp|null,
  createdAt: timestamp,
  lastEditedAt: timestamp|null,
  startedAt: timestamp|null,  // First time in progress
  completedAt: timestamp|null,
  timeSpent: number,          // Milliseconds in progress
  timerStartTime: number|null,
  inProgressSince: timestamp|null
}
```

### rendering.js - DOM Manipulation

**Purpose**: Creates and updates DOM elements

**Key Functions**:
```javascript
createNoteElement()       // Builds task card HTML
createPriorityBadge()     // Creates priority badge
renderNotes()             // Renders all tasks to board
sortNotesByPriority()     // Sorts tasks by priority
updateEmptyState()        // Shows/hides empty state message
```

**Rendering Logic**:
- Creates task cards with appropriate classes
- Adds priority badges, buttons, timestamps
- Shows different info based on column
- Applies color-coded styling

### dragDrop.js - Drag and Drop

**Purpose**: Implements HTML5 drag and drop

**Key Functions**:
```javascript
initDragAndDrop()         // Sets up drag listeners
handleDragStart()         // Stores dragged task ID
handleDrop()              // Processes task drop
handleDragOver()          // Allows drop
handleDragEnd()           // Cleans up after drag
```

**Drop Logic**:
1. Get task and new column
2. Update task column
3. Start/stop timer if needed
4. Save to storage
5. Trigger re-render

### timer.js - Time Tracking

**Purpose**: Manages time tracking for tasks

**TimerManager Class**:
```javascript
startTimer(noteId, startTime)    // Starts tracking
stopTimer(noteId)                 // Stops and returns elapsed time
getElapsedTime(noteId)            // Gets current elapsed time
isTimerActive(noteId)             // Checks if timer running
getActiveTimerIds()               // Returns all active timer IDs
clearAllTimers()                  // Resets all timers
startUpdateLoop(callback)         // Starts update loop
stopUpdateLoop()                  // Stops update loop
```

**Time Calculation**:
- Adjusted start time: `Date.now() - previousTimeSpent`
- Elapsed time: `Date.now() - adjustedStartTime`
- Allows timer to continue from previous sessions

**Formatting Functions**:
```javascript
formatElapsedTime(ms)     // Formats to HH:MM:SS
formatCompletedTime(ms)   // Human-readable format
```

### storage.js - Data Persistence

**Purpose**: Handles localStorage operations

**Key Functions**:
```javascript
loadNotes()               // Retrieves tasks from storage
saveNotes()               // Persists tasks to storage
migrateNote()             // Adds missing fields to old tasks
isStorageAvailable()      // Checks localStorage support
```

**Migration Logic**:
- Ensures backward compatibility
- Adds default values for new fields
- Sets completedAt for done tasks without it

### modals.js - Modal Dialogs

**Purpose**: Manages task editor and details modals

**Key Functions**:
```javascript
openTaskModal()           // Opens editor modal
openTaskDetailsModal()    // Opens details viewer
initializeDateTimePicker() // Sets up date picker
```

**Modal Types**:
1. **Editor Modal**: Create/edit tasks with form
2. **Details Modal**: Read-only view of task info

### formatters.js - Date/Time Formatting

**Purpose**: Formats timestamps for display

**Key Functions**:
```javascript
formatTimestamp()         // Full date/time string
formatDateTimeLocal()     // For datetime-local input
formatDueDate()           // Due date with urgency
formatDueDateDisplay()    // Readable date/time
```

### theme.js - Theme Management

**Purpose**: Handles dark/light mode switching

**Key Functions**:
```javascript
getPreferredTheme()       // Gets saved or system theme
applyTheme()              // Applies theme to page
setTheme()                // Saves and applies theme
toggleTheme()             // Switches between themes
```

**Theme Application**:
- Toggles darkMode class on body
- Updates theme toggle button icon/text
- Saves preference to localStorage

### headerWidgets.js - Header Components

**Purpose**: Manages header widgets

**Key Functions**:
```javascript
updateClock()             // Updates live clock display
openGooglePanel()         // Opens calendar panel
closeGooglePanel()        // Closes calendar panel
```

### googleCalendar.js - Google Integration

**Purpose**: OAuth and Calendar API integration

**Key Functions**:
```javascript
gapiLoaded()              // Initializes Google API client
gisLoaded()               // Initializes OAuth client
ensureGoogleAuth()        // Handles authentication
fetchAndDisplayEvents()   // Gets and displays events
renderGoogleEvents()      // Renders event list
```

**OAuth Flow**:
1. User clicks "My Events"
2. Request OAuth token
3. Fetch calendar events
4. Display in panel

## Data Flow

### Task Creation Flow
```
User fills form
    ↓
handleFormSubmit()
    ↓
openTaskModal() - Add details
    ↓
handleTaskSave()
    ↓
addNote() - Create task object
    ↓
saveNotes() - Persist to storage
    ↓
renderNotes() - Update UI
    ↓
initDragAndDrop() - Enable dragging
```

### Drag and Drop Flow
```
User drags task
    ↓
handleDragStart() - Store task ID
    ↓
handleDragOver() - Allow drop
    ↓
handleDrop() - Process drop
    ↓
Update task column
    ↓
Start/stop timer if needed
    ↓
saveNotes() - Persist changes
    ↓
Dispatch 'notesUpdated' event
    ↓
Re-render board
```

### Timer Flow
```
Task moved to In Progress
    ↓
Calculate adjusted start time
    ↓
timerManager.startTimer()
    ↓
Update loop runs every second
    ↓
updateTimerDisplays() - Update UI
    ↓
Task moved out of In Progress
    ↓
timerManager.stopTimer()
    ↓
Save elapsed time to task
```

## Styling System

### CSS Custom Properties (variables.css)

Defines all colors, spacing, shadows, and design tokens:

```css
:root {
  /* Colors */
  --bg-page: #050810;
  --accent-neon-cyan: #00f0ff;
  --status-todo: #00f0ff;
  
  /* Spacing */
  --space-sm: 8px;
  --space-md: 16px;
  
  /* Shadows */
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.6);
}
```

### Light Mode Overrides

Light mode redefines variables for a clean, professional look:
- Softer colors
- Lighter backgrounds
- Reduced glow effects
- Better contrast

### Modular CSS Architecture

Each CSS file handles a specific UI component:
- **variables.css**: Design tokens
- **base.css**: Global styles
- **board.css**: Column layout
- **cards.css**: Task card styles
- **modals.css**: Modal dialogs

### Responsive Design

Breakpoints:
- **Desktop**: > 1024px (3 columns)
- **Tablet**: 768px - 1024px (stacked columns)
- **Mobile**: < 768px (compact layout)

## Time Tracking System

### How It Works

1. **Task Enters In Progress**:
   - Calculate adjusted start time: `Date.now() - previousTimeSpent`
   - Start timer with adjusted time
   - Timer shows accumulated time + current session

2. **Timer Display**:
   - Updates every second via `updateTimerDisplays()`
   - Shows in HH:MM:SS format
   - Continues from previous sessions

3. **Task Leaves In Progress**:
   - Stop timer and get elapsed time
   - Save elapsed time to `task.timeSpent`
   - Timer pauses until task returns

4. **Task Completed**:
   - Final time saved to `task.timeSpent`
   - Set `task.completedAt` timestamp
   - Display total time in human-readable format

### Time Formats

**Timer Display** (In Progress):
```
⏱ 00:15:32
```

**Completed Time** (Done):
```
Completed in 15 minutes 32 seconds
```

**Details Modal**:
```
Time Spent On Task: 15 minutes 32 seconds
```

## Google Calendar Integration

### Components

1. **Holiday Calendar Iframe**:
   - Embedded Google Calendar
   - Shows Indian holidays
   - Always available (no auth needed)

2. **Personal Events**:
   - Requires OAuth authentication
   - Fetches user's upcoming events
   - Shows next 15 events

### OAuth Flow

1. User clicks "My Events"
2. `ensureGoogleAuth()` checks for token
3. If no token, request via `tokenClient.requestAccessToken()`
4. User authorizes in popup
5. Token stored in gapi client
6. `fetchAndDisplayEvents()` called
7. Events displayed in panel

### Event Display

Each event shows:
- Event title
- Date and time
- Location (if available)

## Storage System

### localStorage Structure

**Key**: `kanbanNotes`

**Value**: JSON array of task objects

```json
[
  {
    "id": 1733456789123,
    "text": "Task 1",
    "description": "Details here",
    "column": "todo",
    "priority": "high",
    "dueDate": 1733543189123,
    "createdAt": 1733456789123,
    "lastEditedAt": null,
    "startedAt": null,
    "completedAt": null,
    "timeSpent": 0
  }
]
```

### Migration System

When loading notes, `migrateNote()` ensures all fields exist:
- Adds missing fields with defaults
- Sets `completedAt` for done tasks
- Maintains backward compatibility

## Responsive Design

### Breakpoints

- **1280px**: Desktop to laptop transition
- **1024px**: Tablet landscape
- **890px**: Mobile landscape
- **768px**: Tablet portrait
- **640px**: Large phone
- **430px**: Standard phone
- **375px**: Small phone

### Key Responsive Features

1. **Header**:
   - Proportional scaling of elements
   - Icon-only buttons on mobile
   - Compact layout below 430px

2. **Board**:
   - 3 columns on desktop
   - 2 columns on large tablet
   - 1 column on mobile

3. **Cards**:
   - Adaptive padding and spacing
   - Touch-friendly button sizes
   - Readable text at all sizes

4. **Modals**:
   - Full-width on mobile
   - Scrollable content
   - Touch-optimized controls

## Development Guidelines

### Code Style

**JavaScript**:
- camelCase for variables and functions
- PascalCase for classes
- ES6+ features (arrow functions, template literals, destructuring)
- Prefer `const` over `let`, avoid `var`

**CSS**:
- camelCase for class names (e.g., `.appHeader`, `.taskCard`)
- CSS custom properties for colors, spacing
- Modular files for different components

**Comments**:
- File header comments describing purpose
- Concise single-line comments for complex logic
- No decorative comments or emojis

### Key Principles

1. **Modular Architecture**: Clear separation of concerns
2. **Event-Driven**: Custom events for cross-module communication
3. **Mobile-First**: Responsive design for all devices
4. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
5. **Performance**: Efficient rendering, minimal reflows

### Testing Checklist

- [ ] Create task in each column
- [ ] Edit task details
- [ ] Delete task
- [ ] Drag task between columns
- [ ] Timer starts/stops correctly
- [ ] Time accumulates across sessions
- [ ] Due dates display correctly
- [ ] Theme toggle works
- [ ] Google Calendar loads
- [ ] Responsive on mobile
- [ ] localStorage persists data

## Troubleshooting

### Timer Issues
- **Timer shows wrong time**: Clear timers with `clearAllTimers()` before re-initializing
- **Timer doesn't start**: Check `startedAt` is set when task enters In Progress
- **Time not accumulating**: Verify `timeSpent` is saved when leaving In Progress

### Storage Issues
- **Data not persisting**: Check localStorage is available
- **Old data format**: Migration should handle automatically
- **Storage full**: Clear old data or increase quota

### Google Calendar Issues
- **OAuth fails**: Check CLIENT_ID is correct
- **Events not loading**: Verify API is enabled in Google Console
- **Iframe blocked**: Check CSP headers

## Future Enhancements

- Task search and filtering
- Multiple boards/projects
- Task tags/categories
- Recurring tasks
- Task dependencies
- Export/import functionality
- Collaboration features
- Mobile app version
- Keyboard shortcuts
- Task templates

## Conclusion

Kanby is a fully-featured Kanban task management system with modern UI, comprehensive time tracking, and Google Calendar integration. The modular architecture makes it easy to maintain and extend. Follow the coding preferences and patterns established in the codebase for consistency.
