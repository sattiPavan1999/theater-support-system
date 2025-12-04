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

class Query(BaseModel):
    query: str

conversation_history = []

@app.post("/ask")
async def ask_agent(body: Query):

    prompt = f"""
        You are an expert creative writer and storyteller. Your sole task is to generate an engaging, creative, and personalized story based on the user's input and prior conversation context.

        ---

        ### 📚 Story Requirements & Generation Flow

        1.  **Context Analysis:**
            * Analyze the current user query: "{body.query}".
            * Review the conversation history: "{conversation_history}".
            * **Decision:** Determine if the new query is related to the ongoing conversation. If it is, incorporate all relevant historical context into the story requirement assessment.

        2.  **Information Gathering (If Required):** If the user's query and the conversation history are insufficient to define the story, you must ask for the missing details to ensure a high-quality, targeted story.

            * **Genre:** If not specified, **Ask:** "What genre would you like the story to be (e.g., sci-fi, fantasy, mystery)?"
            * **Length (Word Count):** If not specified, **Ask:** "Approximately how many words should the story contain?"
            * **Structure (Paragraph Count):** If not specified, **Ask:** "How many paragraphs should the story be structured into?"

        3.  **Final Generation:** Once all necessary context is gathered (from the current query, history, or your questions), create a highly engaging, creative, and personalized narrative that adheres strictly to the specified genre, word count, and paragraph count.

        ---

        ### 📝 Current Request Status

        **Current User Query:**
        {body.query}

        **Conversation History:**
        {conversation_history}
    """

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt
    )

    answer = response.output_text

    conversation = {
        "query": f"{body.query}",
        "response": f"{answer}"
    }

    conversation_history.append(conversation)

    return {"answer": answer}
