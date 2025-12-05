import base64
import json
import os
from typing import Any, Dict, Optional

from openai import OpenAI
from server.config import settings


def encode_image(path: str) -> str:
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


SYSTEM_PROMPT = """
You are a strict receipt parser.

Look at the image of a shopping receipt and extract ONLY the following information,
formatted as a single JSON object with this exact structure:

{
  "store": {
    "name": string | null,
    "location": string | null
  },
  "receipt": {
    "post_date": string | null         // date of purchase in YYYY-MM-DD format
  },
  "items": [
    {
      "name": string,                  // product name as printed (or best guess)
      "price": number | null           // line total price for that item
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


def parse_receipt_image(path: str) -> Optional[Dict[str, Any]]:
    """
    Takes a local image path, sends it to OpenAI, and returns a Python dict
    with the parsed receipt JSON. Returns None if something goes wrong.
    """
    if not os.path.exists(path):
        print(f"[OpenAI parser] File not found: {path}")
        return None

    base64_img = encode_image(path)
    client = OpenAI(api_key=settings.openai_api_key)

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=[
            {
                "role": "system",
                "content": [
                    {"type": "input_text", "text": SYSTEM_PROMPT},
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

    try:
        chunk = response.output[0].content[0]
    except Exception as e:
        print("[OpenAI parser] Unexpected response structure:", e)
        print(response)
        return None

    raw_text = getattr(chunk, "text", "")
    print("=== RAW MODEL TEXT (from OpenAI) ===")
    print(repr(raw_text))

    if not raw_text or not raw_text.strip():
        print("[OpenAI parser] Model returned empty or whitespace-only text.")
        return None

    cleaned = raw_text.strip()

    if cleaned.startswith("```json"):
        cleaned = cleaned[len("```json"):].lstrip()
    elif cleaned.startswith("```"):
        cleaned = cleaned[len("```"):].lstrip()

    if cleaned.endswith("```"):
        cleaned = cleaned[:-3].rstrip()

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError as e:
        print("[OpenAI parser] Failed to parse JSON:")
        print(e)
        print("CLEANED TEXT WAS:")
        print(cleaned)
        return None

    return result
