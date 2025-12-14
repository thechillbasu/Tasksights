# TaskSights

**Version 1.0.0**

A unified productivity platform combining Kanban board, time tracking, AI-powered insights, and daily journaling. Built with vanilla JavaScript, Tailwind CSS, DaisyUI, Firebase, and Gemini AI.

## 🎯 Features

- **Kanban Board** - Visual task management with drag-and-drop
- **Time Tracker** - Track activities with live timer and goals
- **AI Insights** - Gemini-powered productivity analysis with environmental impact
- **Daily Journal** - Reflect on your day and track progress
- **Profile Management** - Set goals and manage preferences

## 📁 Project Structure

```
/app/
├── index.html              # Landing page
├── login.html              # Authentication page
├── dashboard.html          # Main application dashboard
├── assets/                 # All application assets
│   ├── css/
│   │   ├── main.css       # Source CSS with Tailwind directives
│   │   └── output.css     # Compiled Tailwind CSS
│   └── js/
│       ├── firebase-config.js    # Firebase initialization
│       ├── auth.js               # Authentication logic
│       ├── login.js              # Login page script
│       ├── dashboard.js          # Dashboard navigation
│       ├── firestore-helpers.js  # Database operations
│       └── modules/              # Feature modules
│           ├── profile.js        # Profile management
│           ├── kanban.js         # Kanban board
│           ├── tracker.js        # Time tracker
│           ├── insights.js       # Analytics & AI
│           └── journal.js        # Daily journal
├── firebase.json           # Firebase hosting config
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Database indexes
├── tailwind.config.js      # Tailwind configuration
├── package.json            # Dependencies
└── kanby_backup/           # Original Kanban app backup
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3 (for local development server)
- Node.js (for building Tailwind CSS)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Build Tailwind CSS:
```bash
npx tailwindcss -i ./assets/css/main.css -o ./assets/css/output.css --watch
```

3. Start development server:
```bash
npm run dev
# or
python3 -m http.server 8000
```

4. Open browser:
```
http://localhost:8000
```

## 🔐 Authentication

TaskSights uses Firebase Authentication with two methods:
- **Google OAuth** - Sign in with your Google account
- **Email/Password** - Create account with email

## 🗄️ Database Structure

### Collections:
- `users` - User profiles and preferences
- `kanban_tasks` - Kanban board tasks
- `activities` - Time tracker activities
- `time_logs` - Time tracking logs
- `journal_entries` - Daily journal entries
- `user_goals` - User-defined goals
- `ai_insights` - Cached AI-generated insights

## 🎨 Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+ modules)
- **UI Framework**: Tailwind CSS + DaisyUI
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Charts**: Chart.js
- **AI**: Google Gemini (via Emergent LLM Key)
- **Icons**: Font Awesome

## 🔧 Development

### Build CSS:
```bash
npx tailwindcss -i ./assets/css/main.css -o ./assets/css/output.css --minify
```

### Start Dev Server:
```bash
npm run dev
```

### Deploy to Firebase:
```bash
firebase deploy
```

## 📱 Features Status

- ✅ Authentication (Google OAuth + Email/Password)
- ✅ Landing Page
- ✅ Login/Signup Pages
- ✅ Dashboard Structure
- ✅ Navigation System
- ✅ Firebase Integration
- ✅ Firestore Security Rules
- ⏳ Profile Module (in progress)
- ⏳ Kanban Board Module (in progress)
- ⏳ Time Tracker Module (in progress)
- ⏳ Insights Module (in progress)
- ⏳ Daily Journal Module (in progress)
- ⏳ AI Integration (Gemini)

## 🔑 Environment Variables

The Emergent LLM Key is already configured for AI features:
```
EMERGENT_LLM_KEY=sk-emergent-aBa07E05131441590E
```

## 📖 Documentation

- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [DaisyUI Components](https://daisyui.com/components/)
- [Chart.js](https://www.chartjs.org/docs/latest/)

## 🤝 Contributing

This is a personal productivity platform. The original Kanban board code is preserved in `/app/kanby_backup/`.

## 📄 License

MIT License

## 🎯 Next Steps

1. Complete Profile module
2. Migrate Kanban board from backup
3. Build Time Tracker with live timer
4. Create Insights dashboard with charts
5. Implement AI analysis with Gemini
6. Build Daily Journal feature
7. Add environmental impact calculations
8. Implement goal tracking and progress visualization

## 🐛 Known Issues

- Feature modules are currently placeholders
- AI integration requires backend Python service (emergentintegrations)

## 📞 Support

For issues or questions, please refer to the Firebase and Tailwind documentation linked above.
