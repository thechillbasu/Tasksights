# Kanban Sticky Notes Board

A straightforward task management app built with vanilla HTML, CSS, and JavaScript. It lets you organize tasks across three columns using drag-and-drop sticky notes that save automatically in your browser.

## What It Does

The app gives you a simple kanban board with three columns: To Do, In Progress, and Done. You can create sticky notes, drag them between columns as your work progresses, and delete them when you're finished. Everything saves to your browser's local storage, so your notes are there when you come back.

The interface is responsive and works on desktop, tablet, and mobile. There are smooth animations and visual feedback to make interactions feel natural.

## Getting Started

The easiest way to run this is to just open `index.html` in your browser. That's it. No build process, no dependencies to install.

If you want to run it through a local server (which can be helpful for testing), you have a few options:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server
```

Then navigate to `http://localhost:8000` in your browser.

## Project Structure

```
kanban-board/
├── index.html          # Main HTML structure
├── css/
│   └── style.css       # All styling and responsive design
├── js/
│   ├── main.js         # Core app logic and event handling
│   ├── storage.js      # localStorage management
│   └── dragDrop.js     # Drag and drop functionality
└── README.md
```

The code is split into separate files to keep things organized. `main.js` handles note creation and deletion, `storage.js` manages saving and loading from localStorage, and `dragDrop.js` implements the drag-and-drop behavior.

## How to Use It

To add a note, type your text in the input field, pick a column from the dropdown, and click "Add Note" or press Enter. The note appears in your chosen column.

Moving notes between columns is just drag and drop. Click and hold a note, drag it to another column, and release. The change saves automatically.

To delete a note, click the trash icon on it. It's removed immediately.

When the board is empty, you'll see a message explaining how to get started.

## Browser Support

This works in all modern browsers that support HTML5 drag and drop, localStorage, CSS Flexbox, and ES6 JavaScript. That includes recent versions of Chrome, Firefox, Safari, and Edge.

On mobile, it works with iOS Safari, Chrome for Android, and Samsung Internet. Touch-based drag and drop is supported.

## Common Issues

**Notes aren't saving**: This usually happens in private/incognito mode, where localStorage doesn't persist. Check if you're in private browsing, or verify that localStorage is enabled in your browser settings.

**Drag and drop not working**: Make sure you're clicking on the note itself, not the delete button. On mobile, use a long press to start dragging. Try refreshing if it's still not working.

**Page looks broken**: Check that `style.css` is in the `css/` folder and that all JavaScript files are in the `js/` folder. Open the browser console (F12) to see if there are any errors. Font Awesome icons load from a CDN, so you'll need an internet connection for those.

**Storage quota exceeded**: This happens if you've created a lot of notes. Delete some old ones or clear your localStorage for the site. Most browsers give you at least 5MB, which is enough for thousands of notes.

**Corrupted data**: If the app won't load, open the browser console, go to Application → Local Storage, find the entry for this site, and delete it. Refresh the page to start fresh.

## Technical Notes

Notes are stored as a JSON array in localStorage. Each note has an ID (timestamp-based), the text content, and which column it belongs to.

All data stays in your browser. Nothing gets sent to a server. Your notes are completely private.

## Learning Goals

This project demonstrates several core web development concepts: DOM manipulation, event handling, the HTML5 Drag and Drop API, localStorage, responsive CSS with Flexbox, and modular JavaScript organization. It's designed to be readable and educational.

## License

Open source and available for educational use.
