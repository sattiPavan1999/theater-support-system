from dotenv import load_dotenv
from openai import OpenAI
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
app = FastAPI()

# Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Allow all origins (or specify "http://localhost:5173")
    allow_credentials=True,
    allow_methods=["*"],      # Allow POST, GET, OPTIONS, etc.
    allow_headers=["*"],      # Allow all headers
)

# Load theater data
def load_theater_data():
    with open("data/theaters_hyderabad.txt", "r") as file:
        return file.read()

theater_data = load_theater_data()

class Query(BaseModel):
    query: str

@app.post("/ask")
async def ask_agent(body: Query):

    prompt = f"""
        ### 🎭 Customer Support Agent Persona ###
        You are a helpful customer support agent for theaters in Hyderabad.

        ---

        ### 📝 Available Data (Theater List) ###
        Use this data exclusively to answer the user's question:
        {theater_data}

        ---

        ### 💬 User Inquiry ###
        User Question: {body.query}

        ---

        ### 🛑 Response Guidelines ###
        1. Answer using **only** the information provided in the 'Available Data (Theater List)' section.
        2. **Do NOT** create or generate fake data, theater names, or movie times.
        3. If the answer to the User Question is **not found** in the given list, you must return a polite response stating that the information is unavailable.
    """

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt
    )

    answer = response.output_text

    return {"answer": answer}