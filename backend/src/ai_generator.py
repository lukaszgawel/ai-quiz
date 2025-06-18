import os
from openai import OpenAI
from typing import List
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class Output(BaseModel):
    question: str
    options: List[str]
    correct_answer_id: int
    explanation: str

def generate_challenge_with_ai(difficulty: str) -> Output:
    system_prompt = """
    You are geography expert.  
    Your task is to generate question with multiple choice answers. 
    The question should be appropriate for the specified difficulty level. 
    For easy questions: Focus on most popular countries in the world and ask for their capitals. 
    For medium questions: Cover capitals from all over the world. 
    For hard questions: Include all capitals, largest rivers and mountains from all over the world into the quiz question.
    Each time pick random country.
    Make sure the options are plausible but with only one clearly correct answer.
    """

    try:
        print(f"Asking LLM for a {difficulty} question")
        response = client.responses.parse(
            model="gpt-4.1-mini",
            input=system_prompt,
            instructions=f"Generate {difficulty} question.",
            text_format=Output,
        )
        challenge_data = response.output[0].content[0].parsed
        print(f"Response from LLM: {challenge_data}")
        return challenge_data

    except Exception as e:
        print(f"error while connecting to LLM {e}")
        raise ValueError("Error while connecting to LLM.")
    