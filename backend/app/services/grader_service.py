from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

from groq import Groq
from app.core.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)


# -------------------------------
# Prompt Template
# -------------------------------
prompt = PromptTemplate(
    input_variables=["text", "rubric"],
    template="""
You are a strict exam grader.

Use the following rubric:
{rubric}

Grade the answer out of 10.

Answer:
{text}

Output EXACTLY in this format:
Score: X/10
Reason: one short sentence
"""
)

# Output parser
parser = StrOutputParser()


# -------------------------------
# LangChain-style pipeline
# -------------------------------
def grade_answer(text, rubric):
    if text == "NO_TEXT_DETECTED":
        return {"score": 0, "max_score": 10, "reason": "No readable text detected"}

    try:
        # Step 1: Format prompt
        final_prompt = prompt.format(text=text, rubric=rubric)

        # Step 2: Call LLM
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": final_prompt}]
        )

        output = response.choices[0].message.content

        # Step 3: Parse output
        score = 0
        reason = "Parsing failed"

        if "Score:" in output:
            try:
                score_part = output.split("Score:")[1].split("/")[0].strip()
                score = int(score_part)
            except:
                score = 0

        if "Reason:" in output:
            reason = output.split("Reason:")[1].strip()

        return {
            "score": score,
            "max_score": 10,
            "reason": reason
        }

    except Exception as e:
        return {
            "score": 0,
            "max_score": 10,
            "reason": f"LLM error: {str(e)}"
        }