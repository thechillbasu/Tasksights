let notes = [];

function init() {
  notes = loadNotes();
  renderNotes(notes);
  updateEmptyState();
  
  if (!isStorageAvailable()) {
    showStorageWarning();
  }
  
  document.getElementById('addNoteForm').addEventListener('submit', handleFormSubmit);
  // event delegation for delete buttons
  document.querySelector('.board').addEventListener('click', handleDeleteClick);
}

function handleFormSubmit(event) {
  event.preventDefault();
  
  const noteInput = document.getElementById('noteText');
  const columnSelect = document.getElementById('columnSelect');
  
  const text = noteInput.value.trim();
  const column = columnSelect.value;
  
  if (text.length === 0) {
    noteInput.classList.add('invalidInput');
    setTimeout(() => noteInput.classList.remove('invalidInput'), 500);
    return;
  }
  
  addNote(text, column);
  noteInput.value = '';
}

function addNote(text, column) {
  const newNote = {
    id: Date.now(), // timestamp as unique id
    text: text,
    column: column
  };
  
  notes.push(newNote);
  saveNotes(notes);
  renderNotes(notes);
  updateEmptyState();
}

function handleDeleteClick(event) {
  const deleteBtn = event.target.closest('.deleteBtn');
  
  if (deleteBtn) {
    const noteElement = deleteBtn.closest('.stickyNote');
    const noteId = parseInt(noteElement.getAttribute('data-note-id'));
    deleteNote(noteId);
  }
}

function deleteNote(noteId) {
  notes = notes.filter(note => note.id !== noteId);
  saveNotes(notes);
  renderNotes(notes);
  updateEmptyState();
}

function createNoteElement(note) {
  const noteDiv = document.createElement('div');
  noteDiv.className = 'stickyNote';
  noteDiv.setAttribute('data-note-id', note.id);
  
  const textP = document.createElement('p');
  textP.className = 'noteText';
  textP.textContent = note.text;
  
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'deleteBtn';
  deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
  
  noteDiv.appendChild(textP);
  noteDiv.appendChild(deleteBtn);
  
  return noteDiv;
}

function renderNotes(notesToRender) {
  const todoContainer = document.querySelector('#todo .notesContainer');
  const inprogressContainer = document.querySelector('#inprogress .notesContainer');
  const doneContainer = document.querySelector('#done .notesContainer');
  
  // clear all columns
  todoContainer.innerHTML = '';
  inprogressContainer.innerHTML = '';
  doneContainer.innerHTML = '';
  
  notesToRender.forEach(note => {
    const noteElement = createNoteElement(note);
    
    if (note.column === 'todo') {
      todoContainer.appendChild(noteElement);
    } else if (note.column === 'inprogress') {
      inprogressContainer.appendChild(noteElement);
    } else if (note.column === 'done') {
      doneContainer.appendChild(noteElement);
    }
  });
  
  initDragAndDrop();
}

function updateEmptyState() {
  const emptyState = document.getElementById('emptyState');
  
  if (notes.length > 0) {
    emptyState.style.display = 'none';
  } else {
    emptyState.style.display = 'block';
  }
}

function showStorageWarning() {
  const warning = document.createElement('div');
  warning.className = 'storageWarning';
  warning.innerHTML = '<p><i class="fas fa-exclamation-triangle"></i> Warning: Your notes will not be saved.</p>';
  
  const container = document.querySelector('.container');
  container.insertBefore(warning, container.firstChild);
}

document.addEventListener('DOMContentLoaded', init);
