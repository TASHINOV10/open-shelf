import time
import os
import requests
import pickle
import json
import requests
import time
import random

# === CONFIGURATION ===
WATCH_DIR = "uploaded_receipts"
PROCESSED_DIR = "processed_receipts"

def fetch_https_proxies():
    url = "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=https&timeout=3000&country=all&ssl=all&anonymity=all"
    try:
        res = requests.get(url, timeout=10)
        raw_list = res.text.strip().split('\n')
        proxies = [f"http://{ip.strip()}" for ip in raw_list if ip.strip()]
        print(f"🌐 Got {len(proxies)} proxies.")
        return proxies
    except Exception as e:
        print("Failed to fetch proxies:", e)
        return []
    

def is_proxy_working(proxy_url):
    test_proxies = {
        'http': proxy_url,
        'https': proxy_url
    }
    try:
        res = requests.get("https://api.ipify.org", proxies=test_proxies, timeout=5)
        return res.status_code == 200
    except:
        return False
    
def get_working_proxy(proxy_list):
    random.shuffle(proxy_list)
    for proxy in proxy_list:
        print("🔍 Testing proxy:", proxy)
        if is_proxy_working(proxy):
            print("✅ Working proxy:", proxy)
            return proxy
        else:
            print("Dead proxy:", proxy)
    print("❗ No working proxy found.")
    return None


# === PROCESSING FUNCTION ===

def process_file(filepath):
    print(f"\n📄 Processing: {filepath}")


    receiptOcrEndpoint = 'https://ocr.asprise.com/api/v1/receipt'
    imageFile = filepath  # 👈 Change to your receipt image path

    payload = {
        'client_id': 'TEST',
        'recognizer': 'auto',
        'ref_no': f'req_{random.randint(1000, 9999)}'
    }

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'  # Optional
    }



        # 🔄 Fetch and test proxies
    proxy_list = fetch_https_proxies()
    working_proxy = get_working_proxy(proxy_list)

    if working_proxy:
        proxies = {
            'http': working_proxy,
            'https': working_proxy,
        }

        try:
            with open(imageFile, 'rb') as f:
                response = requests.post(
                    receiptOcrEndpoint,
                    data=payload,
                    files={"file": f},
                    headers=headers,
                    proxies=proxies,
                    timeout=20
                )

            print("Status:", response.status_code)
            print("OCR Result:\n", response.text)

        except requests.exceptions.RequestException as e:
            print("OCR request failed:", e)
    else:
        print("Skipping OCR — no proxy available.")


# === FOLDER WATCH LOOP ===

def watch_folder():
    seen = set()
    print(f" Watching '{WATCH_DIR}' for new files...")

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
