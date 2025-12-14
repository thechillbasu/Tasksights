# Kanby

**Version 3.1.0**

A modern, feature-rich Kanban task management application with 7-tier responsive design, viewport auto-scroll drag-and-drop, time tracking, and Google Calendar integration. Built with vanilla JavaScript, HTML, and CSS.

## Live Demo

**[https://thechillbasu.github.io/Kanby/](https://thechillbasu.github.io/Kanby/)**

## Documentation

**[PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)** - Comprehensive technical documentation covering architecture, modules, data flow, development guidelines, and complete version history.

## Features

### Core Functionality
- **Drag and Drop Interface** - Move tasks seamlessly between To Do, In Progress, and Done columns
- **Priority Management** - Organize tasks with High, Medium, and Low priority levels with color-coded badges
- **Time Tracking** - Automatic timer for tasks in progress with persistent tracking across sessions
- **Task Details** - Add descriptions, due dates, and track completion times
- **Local Storage** - All data persists in your browser with automatic saving

### Advanced Features
- **Google Calendar Integration** - View holiday calendar and connect your personal calendar via OAuth 2.0
- **Dark/Light Theme** - Toggle between cyberpunk neon dark mode and clean professional light mode
- **Live Clock Widget** - Real-time display with clickable access to calendar
- **Responsive Design** - Fully optimized for desktop, tablet, and mobile devices
- **Smart Sorting** - Tasks automatically sorted by priority within each column

### Time Tracking Details
- Automatic start when task moves to In Progress
- Real-world time tracking (continues even when browser is closed)
- Accumulative tracking across multiple sessions
- Live timer display in HH:MM:SS format
- Completion time summary for finished tasks

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3 (optional, for local development server)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/thechillbasu/Kanby.git
cd Kanby
```

2. Open in browser:

**Option 1: Direct file access**
```bash
# Simply open index.html in your browser
open index.html
```

**Option 2: Local server (recommended)**
```bash
# Start a local server
python3 -m http.server 8000

# Navigate to http://localhost:8000
```

### Usage

#### Creating Tasks
1. Enter task name in the input field
2. Select priority level (High, Medium, Low)
3. Choose initial column (To Do, In Progress, Done)
4. Click "Add Note" to open the editor
5. Add optional description and due date
6. Click "Add Task" to create

#### Managing Tasks
- **Move Tasks** - Drag and drop cards between columns
- **Edit Task** - Click the pencil icon on any card
- **View Details** - Click anywhere on a card to see full information
- **Delete Task** - Click the trash icon on any card

#### Time Tracking
- Timer starts automatically when task moves to In Progress
- Time accumulates across multiple sessions
- Timer continues even when browser is closed
- Completed tasks show total time spent

#### Google Calendar
1. Click the live clock widget to view holiday calendar
2. Click "My Events" to connect your personal calendar
3. Authorize the application (OAuth 2.0)
4. View upcoming events with details

#### Theme Switching
- Click the theme toggle button in the header
- Preference is saved automatically

## Project Structure

```
Kanby/
├── index.html                      # Main HTML structure
├── src/
│   ├── css/                        # Modular CSS files
│   │   ├── variables.css           # Design tokens and CSS variables
│   │   ├── base.css                # Global styles and resets
│   │   ├── headerBase.css          # Header structure
│   │   ├── headerCalendar.css      # Calendar integration styles
│   │   ├── headerThemes.css        # Light mode overrides
│   │   ├── headerResponsive.css    # Header responsive breakpoints
│   │   ├── form.css                # Task creation form
│   │   ├── board.css               # Kanban board layout
│   │   ├── cards.css               # Task card styles
│   │   ├── priority.css            # Priority badge styles
│   │   ├── modalBase.css           # Base modal styles
│   │   ├── detailsViewerModal.css  # Task details viewer
│   │   ├── detailsEditorModal.css  # Task editor with date picker
│   │   ├── utilities.css           # Utility classes
│   │   └── responsive.css          # Additional responsive styles
│   └── js/                         # JavaScript modules
│       ├── main.js                 # Application orchestration
│       ├── notes.js                # Task CRUD operations
│       ├── rendering.js            # DOM manipulation
│       ├── dragDrop.js             # Drag and drop functionality
│       ├── storage.js              # localStorage management
│       ├── timer.js                # Time tracking system
│       ├── modals.js               # Modal dialogs
│       ├── formatters.js           # Date/time formatting
│       ├── theme.js                # Theme switching
│       ├── headerWidgets.js        # Live clock widget
│       └── googleCalendar.js       # Google Calendar OAuth
├── CODING_PREFERENCES.md           # Development guidelines
├── PROJECT_DOCUMENTATION.md        # Comprehensive technical docs
├── LICENSE                         # MIT License
└── README.md                       # This file
```

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Modular CSS with custom properties
- **Storage**: Browser localStorage
- **APIs**: Google Calendar API, Google Identity Services
- **Architecture**: Event-driven with modular design

## Browser Compatibility

- Chrome/Edge 88+
- Firefox 75+
- Safari 13.1+
- iOS Safari 13.4+
- Android Chrome 88+

## Responsive Breakpoints

- **Desktop** (> 1280px): Full 3-column layout with wider spacing
- **Large Laptop** (1024px - 1280px): 2-column layout, proportional scaling
- **Tablet Landscape** (768px - 1024px): Single column, stacked layout
- **Mobile Landscape** (640px - 890px): Compact spacing, optimized heights
- **Mobile Portrait** (430px - 768px): Touch-optimized layout
- **Small Mobile** (375px - 430px): Compact padding and spacing
- **Extra Small** (≤ 375px): Minimal spacing, ultra-compact

## Development

### Code Style
- JavaScript: camelCase for variables/functions, PascalCase for classes
- CSS: camelCase for class names (e.g., `.appHeader`, `.taskCard`)
- Comments: File headers and concise single-line comments
- ES6+ features (arrow functions, template literals, destructuring)

### Key Principles
- Modular architecture with clear separation of concerns
- Event-driven communication between modules
- Mobile-first responsive design
- Accessibility compliance
- Clean, professional code without decorative elements

## Contributing

Contributions are welcome! Please ensure your code follows the existing style guidelines in CODING_PREFERENCES.md.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Font Awesome for icons
- Google for Calendar API and Identity Services
- Modern CSS techniques for glassmorphism and neon effects

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.
