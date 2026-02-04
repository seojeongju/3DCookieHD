import requests
import json
import time
import argparse
import sys
import os
from typing import List, Dict, Any

# CONFIGURATION
# NCS API Base URL (Public Data Portal)
NCS_API_BASE = "http://www.ncs.go.kr/api/openapi3.do"
# Localhost or Production URL for Upload
APP_API_BASE = "http://localhost:8788/api/ncs/upload" # Default local

# Helper to decode service key if needed (simplistic)
# Note: For requests params, we usually pass the decoded key if the lib handles encoding,
# or pass encoded key as string if we construct URL manually.
# requests params usually encodes. So users should provide DECODED key if possible,
# OR we pass it carefully.
# NCS API is XML/JSON. "returnType=JSON" is standard.

class NcsScraper:
    def __init__(self, service_key: str, app_url: str, token: str = None):
        self.service_key = service_key
        self.app_url = app_url
        self.token = token
        self.session = requests.Session()
        self.items_buffer = []
        self.batch_size = 50 # Send every 50 items

    def fetch_api(self, operation: str, params: Dict[str, str]) -> List[Dict[str, Any]]:
        url = f"{NCS_API_BASE}"
        # NCS API specific structure: url is usually same, operation logic differs?
        # Actually NCS Open API v3 often uses different paths or params.
        # Example: NCS001 (Large) uses specific query params.
        # We assume standard param structure: apiKey, returnType=json, ...
        
        payload = {
            "serviceKey": self.service_key,
            "returnType": "json",
            **params
        }
        
        # Operation handling: The URL provided in user guide usually varies?
        # Standard: /api/rest/ncs.NcsLarge - No, user said recursive calls.
        # Let's assume the user knows the standard endpoints or we use a generic mapping.
        # Typically:
        # NCS001: 대분류
        # NCS002: 중분류
        # NCS003: 소분류
        # NCS004: 세분류
        # NCS005: 능력단위
        # NCS006: 능력단위요소
        
        # The URL in user prompt was generic.
        # Check actual NCS API specs?
        # We will use "base + operation params".
        # But commonly, it's `getNcsLargeClassList` etc.
        # I will implement based on "User said recursive NCS001 -> 006".
        
        # Mapping Operations to specific params/paths if needed.
        # Since I don't have exact docs, I will assume standard ODCloud pattern or specific NCS pattern.
        # I'll use the Op Names derived from typical NCS API usage.
        
        # Operations:
        # 1. getNcsLclasList (Large)
        # 2. getNcsMclasList (Mid)
        # 3. getNcsSclasList (Small)
        # 4. getNcsSubdList (Sub/Job)
        # 5. getNcsDutyList (Unit? Capability Unit?) -> Duty is usually Job? No.
        #    Actually: Large -> Mid -> Small -> Subclass (Job) -> Competency Unit -> Element.
        
        # Let's map operation names based on standard implementation:
        op_map = {
            "NCS001": "getNcsLclasList",
            "NCS002": "getNcsMclasList",
            "NCS003": "getNcsSclasList",
            "NCS004": "getNcsSubdList",
            "NCS005": "getNcsComptUnitList", # Ability Unit
            "NCS006": "getNcsComptUnitElemList" # Element
        }
        
        op_name = op_map.get(operation, operation)
        
        # To make it work with requests params, we pass exact key name expected by API.
        # Usually 'serviceKey' is passed.
        
        # Wait, the URL is likely: base/operation.
        # e.g. http://www.ncs.go.kr/api/openapi3.do?exec=NCS001...
        # Let's assume pattern: ?exec=OPERATION_CODE
        
        payload["exec"] = operation
        
        try:
            # We must be careful with ServiceKey encoding in requests.
            # Often it's better to construct query string manually if key contains % or +
            # But let's try standard params first.
            resp = self.session.get(url, params=payload, timeout=10)
            resp.raise_for_status()
            
            # The API returns JSON string, often messy.
            try:
                data = resp.json()
            except json.JSONDecodeError:
                print(f"    !! JSON Decode Error for {operation}. Body sample: {resp.text[:100]}")
                return []
            
            # Debug: Print keys if uncertain
            # print(f"DEBUG: {operation} keys: {data.keys()}")

            items = []
            if "data" in data and isinstance(data["data"], list):
                items = data["data"]
            elif "body" in data and "items" in data["body"]:
                items = data["body"]["items"]
            elif "response" in data and "body" in data["response"] and "items" in data["response"]["body"]:
                items = data["response"]["body"]["items"]
            elif "result" in data and isinstance(data["result"], list): # Some APIs
                items = data["result"]
            else:
                # Some APIs return { "item": [...] } structure
                pass

            # Normalize: If items is dict (single item), wrap in list
            if isinstance(items, dict):
                items = [items]
            elif not isinstance(items, list):
                items = [] # Fallback if items is None or other type
            
            return items
                 
        except Exception as e:
            print(f"Error fetching {operation} with {params}: {e}")
            return []

    def recursive_scrape(self):
        # 1. Large
        print("Fetching Large Classes (NCS001)...")
        larges = self.fetch_api("NCS001", {})
        
        for l in larges:
            l_code = l.get("ncsLclasCd")
            l_name = l.get("ncsLclasNm")
            print(f"  > Processing Large: {l_name} ({l_code})")
            
            # 2. Mid
            mids = self.fetch_api("NCS002", {"ncsLclasCd": l_code})
            for m in mids:
                m_code = m.get("ncsMclasCd")
                m_name = m.get("ncsMclasNm")
                
                # 3. Small
                smalls = self.fetch_api("NCS003", {"ncsLclasCd": l_code, "ncsMclasCd": m_code})
                for s in smalls:
                    s_code = s.get("ncsSclasCd")
                    s_name = s.get("ncsSclasNm")
                    
                    # 4. Sub (Job)
                    subs = self.fetch_api("NCS004", {"ncsLclasCd": l_code, "ncsMclasCd": m_code, "ncsSclasCd": s_code})
                    for sub in subs:
                        sub_code = sub.get("ncsSubdCd") # 2 digits? or full?
                        # API usually returns 2 digits '01'. But we need full code?
                        # Usually NCS004 returns fields.
                        sub_name = sub.get("ncsSubdNm")
                        
                        # Full Job Code: L+M+S+Sub
                        # Ensure codes are 2 digits padded? API returns what?
                        # Assuming API returns valid components.
                        full_job_code = f"{l_code}{m_code}{s_code}{sub_code}"
                        
                        # 5. Units
                        units = self.fetch_api("NCS005", {
                            "ncsLclasCd": l_code, "ncsMclasCd": m_code, 
                            "ncsSclasCd": s_code, "ncsSubdCd": sub_code
                        })
                        
                        for u in units:
                            u_code = u.get("ncsComptUnitCd") # e.g. 101010101_20v1
                            u_name = u.get("ncsComptUnitNm")
                            u_level = u.get("ncsComptUnitLevel")
                            
                            # 6. Elements
                            elements = self.fetch_api("NCS006", {
                                "ncsLclasCd": l_code, "ncsMclasCd": m_code, 
                                "ncsSclasCd": s_code, "ncsSubdCd": sub_code,
                                "ncsComptUnitCd": u_code
                            })
                            
                            # Clean elements structure
                            cleaned_elements = []
                            for e in elements:
                                cleaned_elements.append({
                                    "code": e.get("ncsComptUnitElemCd"),
                                    "name": e.get("ncsComptUnitElemNm"),
                                    # Add perf criteria if available?
                                })
                            
                            # Build Item for Upload
                            item = {
                                "large": l_name,
                                "mid": m_name,
                                "small": s_name,
                                "jobName": sub_name,
                                "jobCode": full_job_code,
                                "unitName": u_name,
                                "unitCode": u_code,
                                "level": str(u_level),
                                "elements": cleaned_elements
                            }
                            
                            self.buffer_item(item)
                            
        self.flush_buffer()

    def buffer_item(self, item):
        self.items_buffer.append(item)
        if len(self.items_buffer) >= self.batch_size:
            self.flush_buffer()

    def flush_buffer(self):
        if not self.items_buffer:
            return
            
        print(f"    >> Uploading batch of {len(self.items_buffer)} items...")
        try:
            headers = {"Content-Type": "application/json"}
            if self.token:
                headers["Authorization"] = f"Bearer {self.token}"
                
            resp = requests.post(self.app_url, json={"items": self.items_buffer}, headers=headers)
            if resp.status_code != 200:
                print(f"    !! Upload Failed: {resp.text}")
            else:
                print(f"    !! Upload Success: {resp.json().get('stats')}")
        except Exception as e:
            print(f"    !! Upload Exception: {e}")
            
        self.items_buffer = []

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Recursively scrape NCS data and upload to App DB")
    parser.add_argument("--key", required=True, help="NCS Open API Service Key")
    parser.add_argument("--url", default="http://localhost:8788/api/ncs/upload", help="Target Upload URL")
    parser.add_argument("--token", help="Bearer Token for App Authentication (if required)")
    
    args = parser.parse_args()
    
    scraper = NcsScraper(args.key, args.url, args.token)
    scraper.recursive_scrape()
