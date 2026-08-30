import os
import urllib.request
import json
from urllib.error import HTTPError
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.environ.get("VITE_FORTYGUARD_API_KEY") or os.environ.get("FORTYGUARD_API_KEY")
URL = "https://api.fortyguard.com/v1/heat_intelligence"

data = json.dumps({"latitude": 25.2048, "longitude": 55.2708, "temperature": 35, "date": "2026-08-26", "analysis": ["urban"]}).encode("utf-8")
headers = {
    "api-key": API_KEY,
    "Content-Type": "application/json"
}

req = urllib.request.Request(URL, data=data, headers=headers, method="POST")

try:
    with urllib.request.urlopen(req) as response:
        print(f"HTTP Status: {response.status}")
        print("Response Body:")
        print(response.read().decode("utf-8"))
except HTTPError as e:
    print(f"HTTP Status: {e.code}")
    print("Response Body:")
    print(e.read().decode("utf-8"))
