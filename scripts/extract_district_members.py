import os
import json
from bs4 import BeautifulSoup

PAGES_DIR = "_crawled_data/pages"
districts_data = {}

district_slugs = [
    'srikakulam', 'parvathipuram-manyam', 'vizianagaram', 'visakhapatnam',
    'anakapalli', 'alluri-sitharama-raju', 'kurnool', 'nandyal',
    'sri-potti-sriramulu-nellore-srikakulam', 'kakinada',
    'dr-b-r-ambedkar-konaseema', 'east-godavari', 'eluru', 'krishna',
    'west-godavari', 'ysr-kadapa', 'anantapuramu', 'sri-sathya-sai',
    'ntr', 'guntur', 'bapatla', 'palnadu', 'prakasam', 'tirupati',
    'chittoor', 'annamayya'
]

total_district_members = 0

for slug in district_slugs:
    fname = f"{slug}.html"
    fpath = os.path.join(PAGES_DIR, fname)
    if not os.path.exists(fpath):
        continue

    with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
        soup = BeautifulSoup(f.read(), "html.parser")

    # Get page title or h1
    h_title = soup.find(['h1', 'h2'])
    dist_name = h_title.get_text(strip=True) if h_title else slug.replace("-", " ").title()

    members = []
    # Find all member blocks
    for heading in soup.find_all(['h2', 'h3', 'h4']):
        text = heading.get_text(strip=True)
        if text.lower() in [dist_name.lower(), 'explore us', 'contact info', 'newsletter', 'copyright © 2022 rights reserved@drushyanth digital marketing services']:
            continue
        if len(text) < 2:
            continue

        parent = heading.find_parent(['div', 'section'])
        p_texts = [p.get_text(strip=True) for p in parent.find_all('p') if p.get_text(strip=True)] if parent else []
        img = parent.find('img') if parent else None

        # Check if it has member-like details (ID, DOB, City, District)
        member_info = {
            "name": text,
            "id": "",
            "dob": "",
            "city": "",
            "district": dist_name,
            "img": os.path.basename(img.get('src')) if img and img.get('src') else "",
            "raw_details": p_texts
        }
        for p in p_texts:
            if "ID:" in p or "ID-" in p:
                member_info["id"] = p.replace("ID:", "").replace("ID-", "").strip()
            elif "DOB:" in p:
                member_info["dob"] = p.replace("DOB:", "").strip()
            elif "City:" in p:
                member_info["city"] = p.replace("City:", "").strip()
            elif "District:" in p:
                member_info["district"] = p.replace("District:", "").strip()

        members.append(member_info)

    districts_data[slug] = {
        "slug": slug,
        "district_name": dist_name,
        "member_count": len(members),
        "members": members
    }
    total_district_members += len(members)

with open("_crawled_data/district_members.json", "w", encoding="utf-8") as f:
    json.dump(districts_data, f, indent=2, ensure_ascii=False)

print(f"Extracted all 26 districts! Total district members: {total_district_members}")
for slug, d in districts_data.items():
    print(f"  {d['district_name']:35s} : {d['member_count']} members")
