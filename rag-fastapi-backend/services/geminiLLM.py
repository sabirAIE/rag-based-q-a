import requests
import os
from utils.prompt_engineering import create_rag_prompt


def query_gemini_flash(user_query: str, context: str) -> str:
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": os.getenv("GEMINI_API_KEY")
    }

    # Improved prompt for better RAG output
    prompt = create_rag_prompt(user_query=user_query, context=context, include_citations=True)

    data = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt.strip()
                    }
                ]
            }
        ]
    }
    print(f"Sending request to Gemini API with prompt: {prompt.strip()}")

    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        content = response.json()
        try:
            return content['candidates'][0]['content']['parts'][0]['text']
        except (KeyError, IndexError):
            return "No response text found in API result."
    else:
        return f"Request failed with status {response.status_code}: {response.text}"
