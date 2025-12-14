"""
TaskSights Backend - Minimal FastAPI server for AI integration
Since we're using Firebase for auth and database, this is primarily for AI calls
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="TaskSights API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "TaskSights API is running", "status": "ok"}

@app.get("/api/health")
async def health():
    return {"status": "healthy", "service": "tasksights-backend"}
