/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./login.html",
    "./dashboard.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        'kanban-todo': '#00f0ff',
        'kanban-progress': '#ccff00',
        'kanban-done': '#9d00ff',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        tasksights: {
          "primary": "#3b82f6",
          "secondary": "#8b5cf6",
          "accent": "#06b6d4",
          "neutral": "#1f2937",
          "base-100": "#ffffff",
          "info": "#0ea5e9",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      "dark",
      "light",
    ],
  },
}
