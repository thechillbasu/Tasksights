// Firestore Helper Functions for TaskSights
import { db } from './firebase-config.js';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// ===== KANBAN TASKS =====

// Create a new Kanban task
export async function createKanbanTask(userId, taskData) {
  try {
    const tasksRef = collection(db, 'kanban_tasks');
    const taskWithUserId = {
      ...taskData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    const docRef = await addDoc(tasksRef, taskWithUserId);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating Kanban task:', error);
    return { success: false, error: error.message };
  }
}

// Get all Kanban tasks for a user
export async function getKanbanTasks(userId) {
  try {
    const tasksRef = collection(db, 'kanban_tasks');
    const q = query(tasksRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const tasks = [];
    snapshot.forEach(doc => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, tasks };
  } catch (error) {
    console.error('Error getting Kanban tasks:', error);
    return { success: false, error: error.message, tasks: [] };
  }
}

// Update a Kanban task
export async function updateKanbanTask(taskId, updates) {
  try {
    const taskRef = doc(db, 'kanban_tasks', taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating Kanban task:', error);
    return { success: false, error: error.message };
  }
}

// Delete a Kanban task
export async function deleteKanbanTask(taskId) {
  try {
    const taskRef = doc(db, 'kanban_tasks', taskId);
    await deleteDoc(taskRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting Kanban task:', error);
    return { success: false, error: error.message };
  }
}

// ===== ACTIVITIES (Time Tracker) =====

// Create a new activity
export async function createActivity(userId, activityData) {
  try {
    const activitiesRef = collection(db, 'activities');
    const activityWithUserId = {
      ...activityData,
      userId,
      createdAt: serverTimestamp()
    };
    const docRef = await addDoc(activitiesRef, activityWithUserId);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating activity:', error);
    return { success: false, error: error.message };
  }
}

// Get all activities for a user
export async function getActivities(userId) {
  try {
    const activitiesRef = collection(db, 'activities');
    const q = query(activitiesRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const activities = [];
    snapshot.forEach(doc => {
      activities.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, activities };
  } catch (error) {
    console.error('Error getting activities:', error);
    return { success: false, error: error.message, activities: [] };
  }
}

// Update an activity
export async function updateActivity(activityId, updates) {
  try {
    const activityRef = doc(db, 'activities', activityId);
    await updateDoc(activityRef, updates);
    return { success: true };
  } catch (error) {
    console.error('Error updating activity:', error);
    return { success: false, error: error.message };
  }
}

// Delete an activity
export async function deleteActivity(activityId) {
  try {
    const activityRef = doc(db, 'activities', activityId);
    await deleteDoc(activityRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting activity:', error);
    return { success: false, error: error.message };
  }
}

// ===== TIME LOGS =====

// Create a time log
export async function createTimeLog(userId, logData) {
  try {
    const logsRef = collection(db, 'time_logs');
    const logWithUserId = {
      ...logData,
      userId,
      createdAt: serverTimestamp()
    };
    const docRef = await addDoc(logsRef, logWithUserId);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating time log:', error);
    return { success: false, error: error.message };
  }
}

// Get time logs for a user (with optional date range)
export async function getTimeLogs(userId, startDate = null, endDate = null) {
  try {
    const logsRef = collection(db, 'time_logs');
    let q = query(logsRef, where('userId', '==', userId), orderBy('startTime', 'desc'));
    
    const snapshot = await getDocs(q);
    let logs = [];
    snapshot.forEach(doc => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    
    // Filter by date range if provided
    if (startDate && endDate) {
      logs = logs.filter(log => {
        const logTime = log.startTime?.toMillis ? log.startTime.toMillis() : log.startTime;
        return logTime >= startDate && logTime <= endDate;
      });
    }
    
    return { success: true, logs };
  } catch (error) {
    console.error('Error getting time logs:', error);
    return { success: false, error: error.message, logs: [] };
  }
}

// ===== JOURNAL ENTRIES =====

// Create a journal entry
export async function createJournalEntry(userId, entryData) {
  try {
    const entriesRef = collection(db, 'journal_entries');
    const entryWithUserId = {
      ...entryData,
      userId,
      createdAt: serverTimestamp()
    };
    const docRef = await addDoc(entriesRef, entryWithUserId);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating journal entry:', error);
    return { success: false, error: error.message };
  }
}

// Get journal entries for a user
export async function getJournalEntries(userId) {
  try {
    const entriesRef = collection(db, 'journal_entries');
    const q = query(entriesRef, where('userId', '==', userId), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    const entries = [];
    snapshot.forEach(doc => {
      entries.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, entries };
  } catch (error) {
    console.error('Error getting journal entries:', error);
    return { success: false, error: error.message, entries: [] };
  }
}

// Update a journal entry
export async function updateJournalEntry(entryId, updates) {
  try {
    const entryRef = doc(db, 'journal_entries', entryId);
    await updateDoc(entryRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating journal entry:', error);
    return { success: false, error: error.message };
  }
}

// Delete a journal entry
export async function deleteJournalEntry(entryId) {
  try {
    const entryRef = doc(db, 'journal_entries', entryId);
    await deleteDoc(entryRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    return { success: false, error: error.message };
  }
}

// ===== USER PROFILE & GOALS =====

// Get or create user profile
export async function getUserProfile(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return { success: true, profile: docSnap.data() };
    } else {
      // Create default profile
      const defaultProfile = {
        createdAt: serverTimestamp(),
        goals: [],
        preferences: {
          theme: 'light',
          notifications: true
        }
      };
      await setDoc(userRef, defaultProfile);
      return { success: true, profile: defaultProfile };
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error: error.message };
  }
}

// Update user profile
export async function updateUserProfile(userId, updates) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
}

// ===== AI INSIGHTS =====

// Save AI insights
export async function saveAIInsight(userId, insightData) {
  try {
    const insightsRef = collection(db, 'ai_insights');
    const insightWithUserId = {
      ...insightData,
      userId,
      createdAt: serverTimestamp()
    };
    const docRef = await addDoc(insightsRef, insightWithUserId);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving AI insight:', error);
    return { success: false, error: error.message };
  }
}

// Get recent AI insights
export async function getRecentAIInsights(userId, limitCount = 10) {
  try {
    const insightsRef = collection(db, 'ai_insights');
    const q = query(
      insightsRef, 
      where('userId', '==', userId), 
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    const insights = [];
    snapshot.forEach(doc => {
      insights.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, insights };
  } catch (error) {
    console.error('Error getting AI insights:', error);
    return { success: false, error: error.message, insights: [] };
  }
}
