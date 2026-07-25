import json

from app.ai.groq_client import llm
from app.ai.prompts import SYSTEM_PROMPT


def analyze_complaint(state):
    description = state["description"]

    prompt = f"""
{SYSTEM_PROMPT}

ComplaintRequest:

{description}
"""

    response = llm.invoke(prompt)

    print("========== GROQ RESPONSE ==========")
    print(response.content)
    print("===================================")

    content = response.content.strip()

    content = content.replace("```json", "")
    content = content.replace("```", "")
    content = content.strip()

    try:
        result = json.loads(content)

        state["summary"] = result.get("summary", "")
        state["category"] = result.get("category", "")
        state["priority"] = result.get("priority", "")
        state["severity"] = result.get("severity", "")
        state["recommended_action"] = result.get("recommended_action", "")

    except Exception as e:
        print("JSON ERROR:", e)

    return state