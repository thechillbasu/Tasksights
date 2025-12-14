// Firebase Configuration for TaskSights
// Initializes Firebase services: Authentication and Firestore

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDruw9-JiZVnzYq0oPQS71ALMvKNqBXMi0",
  authDomain: "tasksights.firebaseapp.com",
  projectId: "tasksights",
  storageBucket: "tasksights.firebasestorage.app",
  messagingSenderId: "230490705146",
  appId: "1:230490705146:web:9eb0068d9b897ffc7ecd43",
  measurementId: "G-9XSQ06VXVH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export the app instance
export default app;
