# server/test_openai_image.py

import base64
import json
import os

from openai import OpenAI
from config import settings


def encode_image(path: str) -> str:
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def main():
    # 1) PUT A REAL FILE HERE
    path = os.path.join(os.path.dirname(__file__), "..", "uploaded_receipts", "IMG_3385.jpeg")
   
    path: str = os.path.abspath(path)

    if not os.path.exists(path):
        print("File not found:", path)
        return

    print("Using file:", path)

    base64_img = encode_image(path)
    client = OpenAI(api_key=settings.openai_api_key)

    system_prompt = """
    You are a strict receipt parser.

    Look at the image of a shopping receipt and extract ONLY the following information,
    formatted as a single JSON object with this exact structure:

    {
      "store": {
        "name": string | null,
        "location": string | null
      },
      "receipt": {
        "post_date": string | null,         // date of purchase in YYYY-MM-DD format
      },
      "items": [
        {
          "name": string,                   // product name as printed (or best guess)
          "price": number | null,           // line total price for that item
        }
      ]
    }

    Rules:
    - Use null when a value is missing or unclear.
    - For post_date, try to parse the date printed on the receipt into YYYY-MM-DD.
    - Do NOT include any extra fields.
    - Do NOT include comments or explanations.
    - Return ONLY valid JSON.
    """

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=[
            {
                "role": "system",
                "content": [
                    {"type": "input_text", "text": system_prompt},
                ],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_image",
                        "image_url": f"data:image/jpeg;base64,{base64_img}",
                    },
                ],
            },
        ],
        max_output_tokens=800,
    )

    # Take first output chunk
    chunk = response.output[0].content[0]

        # What the model actually returned as text
    raw_text = getattr(chunk, "text", "")

    print("=== RAW MODEL TEXT ===")
    print(repr(raw_text))

    if not raw_text or not raw_text.strip():
        print("Model returned empty or whitespace-only text; cannot parse JSON.")
        return

    # --- Strip ```json ... ``` if present ---
    cleaned = raw_text.strip()

    # Remove starting fence
    if cleaned.startswith("```json"):
        cleaned = cleaned[len("```json"):].lstrip()
    elif cleaned.startswith("```"):
        cleaned = cleaned[len("```"):].lstrip()

    # Remove trailing fence
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3].rstrip()

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError as e:
        print("Failed to parse JSON:")
        print(e)
        print("CLEANED TEXT WAS:")
        print(cleaned)
        return

    print("=== CLEAN JSON RESULT ===")
    print(json.dumps(result, indent=2, ensure_ascii=False))



if __name__ == "__main__":
    main()
