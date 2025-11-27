function initDragAndDrop() {
  const allNotes = document.querySelectorAll('.stickyNote');
  
  allNotes.forEach(note => {
    note.setAttribute('draggable', 'true');
    note.addEventListener('dragstart', handleDragStart);
    note.addEventListener('dragend', handleDragEnd);
  });
  
  const columns = document.querySelectorAll('.boardColumn');
  columns.forEach(column => {
    column.addEventListener('dragover', handleDragOver);
    column.addEventListener('drop', handleDrop);
    column.addEventListener('dragleave', handleDragLeave);
  });
}

function handleDragStart(event) {
  const noteId = event.currentTarget.getAttribute('data-note-id');
  // store note id for drop event
  event.dataTransfer.setData('text/plain', noteId);
  event.currentTarget.classList.add('dragging');
}

function handleDragOver(event) {
  event.preventDefault(); // allow drop
  event.currentTarget.classList.add('dropTarget');
}

function handleDragLeave(event) {
  if (event.currentTarget === event.target || !event.currentTarget.contains(event.relatedTarget)) {
    event.currentTarget.classList.remove('dropTarget');
  }
}

function handleDrop(event) {
  event.preventDefault();
  
  const column = event.currentTarget;
  const newColumn = column.id;
  const noteId = parseInt(event.dataTransfer.getData('text/plain'));
  
  const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
  const notesContainer = column.querySelector('.notesContainer');
  
  // move note to new column
  notesContainer.appendChild(noteElement);
  
  // update note data
  const noteIndex = notes.findIndex(note => note.id === noteId);
  if (noteIndex !== -1) {
    notes[noteIndex].column = newColumn;
    saveNotes(notes);
  }
  
  column.classList.remove('dropTarget');
}

function handleDragEnd(event) {
  event.currentTarget.classList.remove('dragging');
  
  const columns = document.querySelectorAll('.boardColumn');
  columns.forEach(column => column.classList.remove('dropTarget'));
}
