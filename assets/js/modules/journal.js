// Daily Journal Module for TaskSights
import { getJournalEntries, createJournalEntry, updateJournalEntry, deleteJournalEntry } from '../firestore-helpers.js';

let entries = [];
let currentUser = null;

export async function initJournal(user) {
  console.log('Initializing Journal module');
  currentUser = user;
  
  const journalContent = document.getElementById('journalContent');
  if (!journalContent) return;
  
  journalContent.innerHTML = `
    <!-- New Entry Card -->
    <div class="card bg-base-200 shadow-md mb-6" data-testid="new-entry-card">
      <div class="card-body">
        <h3 class="card-title">
          <i class="fas fa-pen"></i>
          Today's Journal Entry
        </h3>
        <p class="text-sm text-base-content/70 mb-4">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <form id="journalEntryForm">
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">How was your day?</span>
            </label>
            <select class="select select-bordered" id="moodSelect" data-testid="mood-select">
              <option value="great">😊 Great</option>
              <option value="good" selected>🙂 Good</option>
              <option value="okay">😐 Okay</option>
              <option value="bad">😔 Not Great</option>
            </select>
          </div>
          
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Reflect on your day</span>
            </label>
            <textarea 
              class="textarea textarea-bordered h-32" 
              placeholder="What did you accomplish today? What are you grateful for? What could be improved?"
              id="entryContent"
              data-testid="entry-content-textarea"
              required
            ></textarea>
          </div>
          
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Tags (optional)</span>
            </label>
            <input 
              type="text" 
              placeholder="productivity, health, goals (comma separated)" 
              class="input input-bordered" 
              id="entryTags"
              data-testid="entry-tags-input"
            >
          </div>
          
          <button type="submit" class="btn btn-primary" data-testid="save-entry-button">
            <i class="fas fa-save"></i> Save Entry
          </button>
        </form>
      </div>
    </div>
    
    <!-- Past Entries -->
    <div class="card bg-base-200 shadow-md" data-testid="past-entries-card">
      <div class="card-body">
        <h3 class="card-title mb-4">Past Entries</h3>
        <div id="entriesList" class="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
          <!-- Entries will be rendered here -->
        </div>
      </div>
    </div>
  `;
  
  // Load entries
  await loadEntries();
  
  // Set up event listeners
  document.getElementById('journalEntryForm')?.addEventListener('submit', handleSaveEntry);
}

async function loadEntries() {
  const result = await getJournalEntries(currentUser.uid);
  if (result.success) {
    entries = result.entries;
    renderEntries();
  }
}

function renderEntries() {
  const entriesList = document.getElementById('entriesList');
  if (!entriesList) return;
  
  if (entries.length === 0) {
    entriesList.innerHTML = '<p class="text-sm text-base-content/50">No journal entries yet. Start writing your first entry!</p>';
    return;
  }
  
  const moodEmojis = {
    great: '😊',
    good: '🙂',
    okay: '😐',
    bad: '😔'
  };
  
  entriesList.innerHTML = entries.map(entry => {
    const date = entry.date?.toDate ? entry.date.toDate() : new Date(entry.date);
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    return `
      <div class="journal-entry" data-testid="journal-entry">
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-2xl">${moodEmojis[entry.mood] || '🙂'}</span>
            <div>
              <p class="font-semibold">${dateStr}</p>
              ${entry.tags ? `<div class="flex gap-1 mt-1">${entry.tags.split(',').map(tag => `<span class="badge badge-sm">${tag.trim()}</span>`).join('')}</div>` : ''}
            </div>
          </div>
          <div class="flex gap-1">
            <button class="btn btn-ghost btn-xs" onclick="window.editJournalEntry('${entry.id}')" data-testid="edit-entry-button">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-ghost btn-xs text-error" onclick="window.deleteJournalEntry('${entry.id}')" data-testid="delete-entry-button">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <p class="text-sm text-base-content/80 whitespace-pre-wrap">${entry.content}</p>
      </div>
    `;
  }).join('');
}

async function handleSaveEntry(e) {
  e.preventDefault();
  
  const mood = document.getElementById('moodSelect').value;
  const content = document.getElementById('entryContent').value.trim();
  const tags = document.getElementById('entryTags').value.trim();
  
  const entryData = {
    mood,
    content,
    tags,
    date: new Date().toISOString()
  };
  
  const result = await createJournalEntry(currentUser.uid, entryData);
  
  if (result.success) {
    document.getElementById('journalEntryForm').reset();
    await loadEntries();
    alert('Journal entry saved!');
  }
}

window.editJournalEntry = async function(entryId) {
  const entry = entries.find(e => e.id === entryId);
  if (!entry) return;
  
  const newContent = prompt('Edit entry:', entry.content);
  if (newContent) {
    await updateJournalEntry(entryId, { content: newContent });
    await loadEntries();
  }
};

window.deleteJournalEntry = async function(entryId) {
  if (confirm('Delete this journal entry?')) {
    await deleteJournalEntry(entryId);
    await loadEntries();
  }
};
