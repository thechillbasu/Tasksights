# TaskSights - Complete Productivity Platform

**Version 1.0.0 - Fully Functional**

A comprehensive productivity platform combining Kanban board management, time tracking, AI-powered insights, and daily journaling. Built with Vanilla JavaScript, Tailwind CSS, DaisyUI, Firebase, and Google Gemini AI.

## 🎯 Features (All Implemented & Functional)

### ✅ Authentication
- **Google OAuth** - Sign in with your Google account
- **Email/Password** - Create account with email
- **Password Reset** - Secure password recovery
- **Protected Routes** - Automatic redirect for unauthenticated users

### ✅ Profile Management
- View user account information
- Create and manage daily time goals
- Set preferences and notifications
- Track account activity

### ✅ Kanban Board
- **Visual Task Management** with drag-and-drop
- **Three Columns**: To Do, In Progress, Done
- **Priority Levels**: High, Medium, Low with color-coded badges
- **Task Operations**: Create, Edit, Delete, Move
- **Real-time Sync** with Firebase Firestore
- **Task Counts** displayed on each column

### ✅ Time Tracker
- **Live Timer** with start/pause/stop controls
- **Activity Management** - Create activities with categories and goals
- **Category System**: Work, Study, Exercise, Hobby, Other
- **Goal Tracking** - Set daily time goals for activities
- **Time Logs** - Automatic logging of all tracked time
- **Duration Display** - HH:MM:SS format

### ✅ AI-Powered Insights (Gemini Integration)
- **Productivity Analysis** - Evaluate work patterns and completion rates
- **Improvement Suggestions** - Personalized, actionable tips
- **Environmental Impact** - Digital carbon footprint analysis
- **Ethical Considerations** - Work-life balance and burnout prevention
- **Goal Progress** - Track progress toward your goals
- **Time Period Selection**: Daily, Weekly, Monthly
- **Interactive Charts**:
  - Time Distribution (Doughnut Chart)
  - Tasks Status (Bar Chart)
- **Statistics Dashboard**: Total tasks, completed tasks, total time, activities

### ✅ Daily Journal
- **Daily Reflections** - Write journal entries with mood tracking
- **Mood Selection**: Great 😊, Good 🙂, Okay 😐, Not Great 😔
- **Tags System** - Organize entries with custom tags
- **Past Entries** - Browse and edit previous entries
- **Date Display** - Beautiful date formatting

## 📁 Project Structure

```
/app/
├── index.html                    # Landing page
├── login.html                    # Authentication page
├── dashboard.html                # Main application
├── assets/
│   ├── css/
│   │   ├── main.css             # Source CSS with Tailwind
│   │   └── output.css           # Compiled Tailwind CSS
│   └── js/
│       ├── firebase-config.js    # Firebase initialization
│       ├── auth.js               # Authentication logic
│       ├── login.js              # Login page script
│       ├── dashboard.js          # Dashboard navigation
│       ├── firestore-helpers.js  # Database CRUD operations
│       └── modules/              # Feature modules
│           ├── profile.js        # Profile management ✅
│           ├── kanban.js         # Kanban board ✅
│           ├── tracker.js        # Time tracker ✅
│           ├── insights.js       # Analytics & AI ✅
│           └── journal.js        # Daily journal ✅
├── backend/
│   ├── server.py                # FastAPI server with AI
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # Environment variables
├── frontend/
│   └── package.json             # Frontend service config
├── firebase.json                 # Firebase hosting config
├── firestore.rules              # Security rules
├── firestore.indexes.json       # Database indexes
└── kanby_backup/                # Original Kanban app backup
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser
- Firebase account (already configured)
- Internet connection

### Access the Application

**Preview URL**: https://380f5c5e-a435-455c-85c8-8fe55049f1aa.preview.emergentagent.com

**Note**: Open in a **new tab** (not in iframe) for full Google OAuth functionality.

### First Time Setup

1. **Visit the landing page** - Click "Get Started"
2. **Create an account**:
   - Option 1: Click "Continue with Google"
   - Option 2: Use email/password signup
3. **Complete your profile**:
   - Navigate to Profile section
   - Set your daily goals
4. **Start using the app**!

## 📱 How to Use Each Feature

### 1. Profile
- **View Account**: See your email, creation date, last sign-in
- **Set Goals**:
  1. Click "Add Goal"
  2. Enter goal name (e.g., "Exercise")
  3. Enter target time in minutes per day
  4. Click OK
- **Toggle Preferences**: Enable/disable notifications, dark mode

### 2. Kanban Board
- **Add Task**:
  1. Enter task name
  2. Select priority (High/Medium/Low)
  3. Select column (To Do/In Progress/Done)
  4. Click "Add Task"
- **Move Task**: Drag and drop between columns
- **Edit Task**: Click edit icon (pencil)
- **Delete Task**: Click delete icon (trash)

### 3. Time Tracker
- **Create Activity**:
  1. Enter activity name
  2. Select category
  3. Set daily goal (optional)
  4. Click "Create Activity"
- **Track Time**:
  1. Select an activity from the list
  2. Click "Start" to begin timer
  3. Click "Pause" to pause
  4. Click "Stop" to finish and log time
- **View Activities**: See all your activities with goals

### 4. Insights
- **Generate AI Insights**:
  1. Select time period (Today/This Week/This Month)
  2. Click "Generate Insights"
  3. Wait for AI analysis (takes 5-10 seconds)
  4. Read personalized insights:
     - Productivity analysis
     - Improvement suggestions
     - Environmental impact
     - Ethical considerations
     - Goal progress
- **View Charts**: Automatic visualization of your data
- **Check Stats**: See total tasks, completed tasks, time tracked

### 5. Daily Journal
- **Write Entry**:
  1. Select your mood
  2. Write your reflections
  3. Add tags (optional)
  4. Click "Save Entry"
- **View Past Entries**: Scroll through previous entries
- **Edit Entry**: Click edit icon on any entry
- **Delete Entry**: Click delete icon

## 🤖 AI Features

### Gemini AI Integration

The app uses **Google Gemini 2.0 Flash** for AI-powered insights:

**System Prompt Philosophy:**
```
"You are a compassionate productivity and wellness advisor.
Follow the principle: One shall not harm any other living being unless it's for survival.
Focus on sustainable productivity, not just efficiency."
```

**AI Capabilities:**
- ✅ Analyzes productivity patterns
- ✅ Provides empathetic suggestions
- ✅ Calculates environmental impact
- ✅ Assesses work-life balance
- ✅ Tracks goal progress
- ✅ Fact-based and supportive

**Environmental Impact Analysis:**
- Digital carbon footprint from screen time
- Device usage energy consumption
- Eco-friendly practice suggestions
- Based on real data and ethical principles

## 🔒 Security & Privacy

### Firebase Security Rules
- ✅ User-based authentication required
- ✅ Users can only access their own data
- ✅ All database operations are validated
- ✅ No public read/write access

### Data Storage
- **Tasks**: Stored in `kanban_tasks` collection
- **Activities**: Stored in `activities` collection
- **Time Logs**: Stored in `time_logs` collection
- **Journal**: Stored in `journal_entries` collection
- **Profile**: Stored in `users` collection
- **AI Insights**: Cached in `ai_insights` collection

## 🎨 Tech Stack

### Frontend
- **Framework**: Vanilla JavaScript (ES6+ modules)
- **UI**: Tailwind CSS + DaisyUI
- **Charts**: Chart.js
- **Icons**: Font Awesome
- **Module System**: ES6 imports

### Backend
- **Server**: FastAPI (Python)
- **AI**: Google Gemini 2.0 Flash (via emergentintegrations)
- **API Key**: Emergent LLM Key (universal key)
- **Runtime**: Uvicorn

### Database & Auth
- **Authentication**: Firebase Auth (Google OAuth + Email/Password)
- **Database**: Cloud Firestore
- **Real-time**: Firestore listeners
- **Hosting**: Firebase Hosting (configured)

## 🛠️ Development

### Build CSS
```bash
npx tailwindcss -i ./assets/css/main.css -o ./assets/css/output.css --watch
```

### Start Development Server
```bash
npm run dev
```

### Backend Service
The backend runs automatically via supervisor on port 8001.

### Frontend Service
The frontend runs automatically via supervisor on port 3000.

## 🔑 API Endpoints

### Backend API
- `GET /` - Health check
- `GET /api/health` - Service health with AI status
- `POST /api/ai/insights` - Generate AI insights
- `POST /api/ai/quick-tip` - Get quick productivity tip

### Example AI Request
```javascript
const response = await fetch('/api/ai/insights', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_name: "John Doe",
    tasks: {
      tasks_completed: 10,
      tasks_in_progress: 3,
      tasks_todo: 5,
      total_time_spent: 7200, // seconds
      categories: ["work", "study"]
    },
    activities: [...],
    time_period: "weekly",
    goals: [...]
  })
});
```

## 📊 Database Schema

### Kanban Tasks
```javascript
{
  userId: string,
  text: string,
  description: string,
  priority: "high" | "medium" | "low",
  column: "todo" | "inprogress" | "done",
  dueDate: timestamp | null,
  timeSpent: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Activities
```javascript
{
  userId: string,
  name: string,
  category: "work" | "study" | "exercise" | "hobby" | "other",
  goal: number | null,
  createdAt: timestamp
}
```

### Time Logs
```javascript
{
  userId: string,
  activityId: string,
  activityName: string,
  category: string,
  startTime: timestamp,
  endTime: timestamp,
  duration: number,
  createdAt: timestamp
}
```

### Journal Entries
```javascript
{
  userId: string,
  date: timestamp,
  mood: "great" | "good" | "okay" | "bad",
  content: string,
  tags: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🎯 Usage Tips

1. **Start with Goals**: Set daily time goals in Profile section
2. **Create Activities**: Add activities you want to track
3. **Use Kanban**: Organize your tasks visually
4. **Track Time**: Log time for activities as you work
5. **Generate Insights**: Get AI analysis weekly
6. **Write Journal**: Reflect daily on your progress

## 🌟 Key Features Highlights

### Real-time Synchronization
- All data syncs instantly with Firebase
- Changes appear immediately across all sections
- No manual refresh needed

### Drag and Drop
- Intuitive task movement
- Visual feedback during drag
- Automatic status updates

### Live Timer
- Real-time counting
- Pause/resume capability
- Automatic logging on stop

### AI Ethics
- Compassionate analysis
- Environmental awareness
- Work-life balance focus
- No harm principle

## 🐛 Known Limitations

- ✅ All core features are functional
- ⚠️ Google OAuth works best in new tab (not iframe)
- ⚠️ AI insights take 5-10 seconds to generate
- ⚠️ Charts require at least 1 data point

## 📞 Support

For issues:
1. Check browser console (F12) for errors
2. Verify you're logged in
3. Check Firebase authorized domains
4. Ensure services are running (supervisor status)

## 🎓 Credits

- **Original Kanban**: Migrated from Kanby backup
- **AI**: Google Gemini via emergentintegrations
- **UI**: Tailwind CSS + DaisyUI
- **Charts**: Chart.js
- **Backend**: FastAPI

## 📄 License

MIT License

---

## ✅ Completion Status

**All Features Implemented and Tested:**
- ✅ Authentication (Google OAuth + Email/Password)
- ✅ Profile Management (Goals, Preferences)
- ✅ Kanban Board (Drag-drop, CRUD operations)
- ✅ Time Tracker (Live timer, Activity management)
- ✅ AI Insights (Gemini integration with ethical framework)
- ✅ Daily Journal (Mood tracking, Tags)
- ✅ Charts & Analytics (Real-time visualization)
- ✅ Firebase Integration (Auth + Firestore)
- ✅ Responsive Design (Mobile-friendly)

**Version**: 1.0.0 - Production Ready ✨

**Preview URL**: https://380f5c5e-a435-455c-85c8-8fe55049f1aa.preview.emergentagent.com

---

Built with ❤️ using Vanilla JavaScript, Firebase, and Gemini AI
