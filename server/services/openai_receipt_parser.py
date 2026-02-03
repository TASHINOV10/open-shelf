import base64
import json
import os
from typing import Any, Dict, Optional, List

from openai import OpenAI
from server.config import settings


def encode_image(path: str) -> str:
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


ALLOWED_STORES_BG = [
    "Кам Маркет",
    "Билла",
    "ЦБА",
    "Фантастико",
    "БулМаг",
    "Хит Макс",
    "Кауфланд",
    "Лидл",
    "Метро",
    "ПроМаркет",
    "Т Маркет",
    "Триумф",
    "Карфур",
    "Бурлекс",
    "345 Магазинъ",
    "Дар",
    "Мандарин",
    "Смокиня",
    "Бакалия",
    "АБЦ Маркет",
    "Мини Март",
]


def build_system_prompt(allowed_stores: List[str]) -> str:
    # Embed canonical store list in Cyrillic
    stores = ", ".join([f'"{s}"' for s in allowed_stores])

    return f"""
You are a strict receipt parser for Bulgarian grocery receipts.

You MUST output ONLY a single valid JSON object with this exact structure:

{{
  "code": 0 | 6969,
  "store": {{
    "name": string | null,
    "location": string | null
  }},
  "receipt": {{
    "post_date": string | null
  }},
  "items": [
    {{
      "name": string,
      "price": number | null
    }}
  ]
}}

CANONICAL_ALLOWED_STORES (Cyrillic only):
[{stores}]

CRITICAL RULES (STRICT ENFORCEMENT):
1) If the image is NOT a Bulgarian grocery receipt OR you cannot confidently identify the store from the allowed list,
   output code=6969 and set:
   - store.name = null
   - store.location = null
   - receipt.post_date = null
   - items = []

2) If the receipt store IS in the allowed list:
   - code MUST be 0
   - store.name MUST be EXACTLY one of CANONICAL_ALLOWED_STORES (exact spelling).
   - The receipt may show legal entity forms like "ООД", "ЕООД", "АД", "ЕТ" etc.
     Example: "Триумф ООД" -> output store.name = "Триумф" (canonical).
   - If the store name in the receipt is in Latin letters (e.g., "Lidl") but corresponds to a canonical Cyrillic store
     in the list, output the canonical Cyrillic one (e.g., "Лидл").

3) store.location must be the PHYSICAL STORE LOCATION address (конкретния обект/магазин where purchase occurred),
   NOT the firm registered address near EIK/BULSTAT.
   If store.location cannot be confidently found, use null.

4) receipt.post_date must be the purchase date in YYYY-MM-DD format, else null.

5) Use null when missing/unclear (except items: if code=6969 then items must be []).
6) Do NOT include extra fields. Do NOT include markdown. Return ONLY JSON.

7) Do NOT include comments or explanations.
8) Return ONLY valid JSON.


""".strip()


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

    system_prompt = build_system_prompt(ALLOWED_STORES_BG)

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=[
            {
                "role": "system",
                "content": [{"type": "input_text", "text": system_prompt}],
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
        temperature=0,
        max_output_tokens=900,
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
