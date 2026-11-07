import os
import json
import requests
import feedparser

# 1. API URL
API_URL = "https://campus-board-zeta-beige.vercel.app/api/events/auto-add"

# 2. Service Role Key (იკითხება .env.local-იდან ან Environment-იდან)
SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

# 3. RSS წყაროები
RSS_SOURCES = [
    "https://news.google.com/rss/search?q=hackathon+georgia&hl=ka&gl=GE&ceid=GE:ka",
]

def fetch_and_push_events():
    if not SERVICE_KEY:
        print("❌ შეცდომა: SUPABASE_SERVICE_ROLE_KEY არ არის მითითებული!")
        return

    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": f"Bearer {SERVICE_KEY.strip()}"
    }

    for source in RSS_SOURCES:
        feed = feedparser.parse(source)
        print(f"📡 მუშავდება წყარო: {source}")

        for entry in feed.entries[:5]:
            title = str(entry.get("title", ""))
            description = str(entry.get("summary", title))

            event_data = {
                "title": title,
                "description": description,
                "link": str(entry.get("link", "")),
                "date": str(entry.get("published", "")),
                "location": "Georgia",
                "category": "Hackathon",
                "organizer": "Auto Aggregator"
            }

            try:
                payload = json.dumps(event_data, ensure_ascii=False).encode('utf-8')
                response = requests.post(API_URL, data=payload, headers=headers)

                if response.status_code in [200, 201]:
                    print(f"✅ წარმატებით დაემატა: {title[:30]}...")
                else:
                    print(f"⚠️ სერვერის პასუხი ({response.status_code}): {response.text}")

            except Exception as e:
                print(f"❌ მოთხოვნის შეცდომა: {e}")

if __name__ == "__main__":
    fetch_and_push_events()