"""
TaskSights Backend - FastAPI server with Gemini AI integration
Provides AI-powered insights for productivity, environmental impact, and recommendations
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
import asyncio

# Load environment variables
load_dotenv()

# Import emergentintegrations for Gemini
try:
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    print("Warning: emergentintegrations not available. AI features will be disabled.")

app = FastAPI(title="TaskSights API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get Emergent LLM Key
EMERGENT_LLM_KEY = os.getenv("EMERGENT_LLM_KEY", "sk-emergent-aBa07E05131441590E")

# Pydantic models
class TaskData(BaseModel):
    tasks_completed: int
    tasks_in_progress: int
    tasks_todo: int
    total_time_spent: int  # in seconds
    categories: List[str]

class ActivityData(BaseModel):
    activity_name: str
    duration: int  # in seconds
    category: str
    timestamp: str

class InsightRequest(BaseModel):
    user_name: str
    tasks: TaskData
    activities: List[ActivityData]
    time_period: str  # "daily", "weekly", "monthly"
    goals: Optional[List[Dict[str, Any]]] = []

class InsightResponse(BaseModel):
    productivity_analysis: str
    improvement_suggestions: str
    environmental_impact: str
    ethical_considerations: str
    goal_progress: str
    summary: str

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "TaskSights API is running",
        "status": "ok",
        "ai_available": GEMINI_AVAILABLE
    }

@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "service": "tasksights-backend",
        "ai_enabled": GEMINI_AVAILABLE
    }

@app.post("/api/ai/insights", response_model=InsightResponse)
async def generate_insights(request: InsightRequest):
    """
    Generate AI-powered insights using Gemini
    Includes productivity analysis, environmental impact, and ethical considerations
    """
    if not GEMINI_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="AI service is not available. Please check server configuration."
        )
    
    try:
        # Initialize Gemini chat
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"tasksights_{request.user_name}_{request.time_period}",
            system_message="""You are a compassionate productivity and wellness advisor for TaskSights.
            
Your role is to:
1. Analyze productivity patterns with empathy and understanding
2. Provide improvement suggestions that respect work-life balance
3. Calculate environmental impact with facts and ethical considerations
4. Follow the principle: "One shall not harm any other living being unless it's for survival"
5. Offer holistic advice that considers mental health, physical wellbeing, and sustainability

Always be supportive, fact-based, and empathetic. Focus on sustainable productivity, not just efficiency."""
        )
        
        # Configure Gemini model
        chat.with_model("gemini", "gemini-2.0-flash")
        
        # Prepare analysis prompt
        total_minutes = request.tasks.total_time_spent // 60
        hours = total_minutes // 60
        minutes = total_minutes % 60
        
        activities_summary = "\n".join([
            f"- {act.activity_name} ({act.category}): {act.duration // 60} minutes"
            for act in request.activities
        ])
        
        goals_summary = "\n".join([
            f"- {goal.get('name', 'Unknown')}: Target {goal.get('target', 'N/A')} minutes"
            for goal in request.goals
        ]) if request.goals else "No goals set"
        
        prompt = f"""Analyze this {request.time_period} productivity data for {request.user_name}:

**Tasks Summary:**
- Completed: {request.tasks.tasks_completed}
- In Progress: {request.tasks.tasks_in_progress}
- To Do: {request.tasks.tasks_todo}
- Total Time Tracked: {hours}h {minutes}m
- Categories: {', '.join(request.tasks.categories)}

**Activities:**
{activities_summary}

**Goals:**
{goals_summary}

Please provide:

1. **Productivity Analysis** (2-3 sentences): Evaluate their work patterns, completion rate, and time management.

2. **Improvement Suggestions** (3-4 actionable tips): Provide specific, empathetic recommendations for sustainable productivity.

3. **Environmental Impact** (2-3 sentences): Calculate the digital carbon footprint (screen time, device usage) and suggest eco-friendly practices. Be fact-based and consider the harm principle.

4. **Ethical Considerations** (2-3 sentences): Assess work-life balance, potential burnout signs, and impact on relationships. Encourage practices that don't harm wellbeing.

5. **Goal Progress** (2-3 sentences): Evaluate progress toward goals and provide motivation.

6. **Summary** (1-2 sentences): Provide an encouraging overall assessment.

Format your response as JSON with these exact keys:
{{
    "productivity_analysis": "...",
    "improvement_suggestions": "...",
    "environmental_impact": "...",
    "ethical_considerations": "...",
    "goal_progress": "...",
    "summary": "..."
}}"""
        
        # Get AI response
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Parse response (expecting JSON)
        import json
        try:
            # Try to extract JSON from response
            response_text = response.strip()
            if "```json" in response_text:
                json_start = response_text.find("```json") + 7
                json_end = response_text.find("```", json_start)
                response_text = response_text[json_start:json_end].strip()
            elif "```" in response_text:
                json_start = response_text.find("```") + 3
                json_end = response_text.find("```", json_start)
                response_text = response_text[json_start:json_end].strip()
            
            insights = json.loads(response_text)
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            insights = {
                "productivity_analysis": response[:200],
                "improvement_suggestions": "Focus on consistent progress and sustainable work habits.",
                "environmental_impact": "Digital activities have a carbon footprint. Consider reducing unnecessary screen time.",
                "ethical_considerations": "Remember to balance productivity with rest and relationships.",
                "goal_progress": "Keep working toward your goals with patience and self-compassion.",
                "summary": "You're making progress! Stay focused and take care of yourself."
            }
        
        return InsightResponse(**insights)
        
    except Exception as e:
        print(f"AI Insight Error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate insights: {str(e)}"
        )

@app.post("/api/ai/quick-tip")
async def quick_tip(activity: str):
    """
    Get a quick productivity tip for a specific activity
    """
    if not GEMINI_AVAILABLE:
        raise HTTPException(status_code=503, detail="AI service not available")
    
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"tasksights_tip_{activity}",
            system_message="You are a helpful productivity advisor. Provide brief, actionable tips."
        )
        chat.with_model("gemini", "gemini-2.0-flash")
        
        message = UserMessage(text=f"Give me one quick productivity tip for: {activity}. Keep it under 50 words.")
        response = await chat.send_message(message)
        
        return {"tip": response.strip()}
        
    except Exception as e:
        return {"tip": "Break your work into focused sessions with short breaks in between."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
