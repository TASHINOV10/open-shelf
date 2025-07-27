import time
import os
import cv2
import pytesseract
import requests
import pickle
import json

# === CONFIGURATION ===
WATCH_DIR = "../uploaded_receipts"
PROCESSED_DIR = "../processed_receipts"

SLICE_RATIO = 0.04       # Slice height ~1.6% of image height
STRIDE_RATIO = 0.012      # Move down by ~1.2% → 25% overlap

# Tesseract OCR config
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
OCR_LANG = "bul+eng"
OCR_CONFIG = "--psm 6"

# Ensure output directory exists
os.makedirs(PROCESSED_DIR, exist_ok=True)

# === PROCESSING FUNCTION ===

def process_file(filepath):
    print(f"\n📄 Processing: {filepath}")

    url = "http://ocr.aspire.com/api/v1/receipt"
    image = filepath

    r = requests.post(url, data = { \
    'api_key': 'TEST',        # Use 'TEST' for testing purpose \
    'recognizer': 'auto',       # can be 'US', 'CA', 'JP', 'SG' or 'auto' \
    'ref_no': 'ocr_python_123', # optional caller provided ref code \
    }, \
    files = {"file": open(image, "rb")})

    print(r.text) # result in JSON



    # Move original image
    dest_image_path = os.path.join(PROCESSED_DIR, os.path.basename(filepath))
    os.rename(filepath, dest_image_path)
    print(f"✅ Saved OCR output to: {output_text_file}")
    print(f"📦 Moved original image to: {dest_image_path}")

# === FOLDER WATCH LOOP ===

def watch_folder():
    seen = set()
    print(f"🔍 Watching '{WATCH_DIR}' for new files...")

    while True:
        for filename in os.listdir(WATCH_DIR):
            full_path = os.path.join(WATCH_DIR, filename)
            if filename not in seen and os.path.isfile(full_path):
                seen.add(filename)
                process_file(full_path)
        time.sleep(2)

# === ENTRY POINT ===

if __name__ == "__main__":
    watch_folder()
