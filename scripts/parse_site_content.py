import os
import re
import json
from bs4 import BeautifulSoup

PAGES_DIR = "_crawled_data/pages"
OUTPUT_FILE = "_crawled_data/parsed_site_content.json"

parsed_pages = {}

def clean_text(t):
    if not t:
        return ""
    return re.sub(r'\s+', ' ', t).strip()

for fname in os.listdir(PAGES_DIR):
    if not fname.endswith(".html"):
        continue
    # skip raw media attachment pages
    if fname.startswith("wp-content_uploads"):
        continue

    slug = fname.replace(".html", "")
    filepath = os.path.join(PAGES_DIR, fname)
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        html = f.read()

    soup = BeautifulSoup(html, "html.parser")

    title = soup.title.string.strip() if soup.title and soup.title.string else slug

    # Remove script and style
    for s in soup(["script", "style", "noscript", "svg"]):
        s.extract()

    # Get meta description
    meta_desc = ""
    desc_el = soup.find("meta", attrs={"name": "description"})
    if desc_el:
        meta_desc = desc_el.get("content", "").strip()

    # Extract headings
    headings = []
    for h in soup.find_all(["h1", "h2", "h3", "h4", "h5", "h6"]):
        htext = clean_text(h.get_text())
        if htext:
            headings.append({"tag": h.name, "text": htext})

    # Extract paragraphs and text blocks
    paragraphs = []
    for p in soup.find_all("p"):
        ptext = clean_text(p.get_text())
        if ptext and len(ptext) > 3:
            paragraphs.append(ptext)

    # Extract tables (e.g. member lists, committee tables)
    tables = []
    for table in soup.find_all("table"):
        table_rows = []
        for tr in table.find_all("tr"):
            row = [clean_text(td.get_text()) for td in tr.find_all(["th", "td"])]
            if any(row):
                table_rows.append(row)
        if table_rows:
            tables.append(table_rows)

    # Extract pricing / membership tables if any
    price_boxes = []
    for box in soup.find_all(class_=lambda c: c and ("price" in c or "pricing" in c or "ihc-level" in c)):
        btext = clean_text(box.get_text())
        if btext:
            price_boxes.append(btext)

    # Extract images referenced in page
    images = []
    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src") or ""
        alt = img.get("alt", "").strip()
        if src and "gravatar" not in src:
            images.append({"src": os.path.basename(src), "alt": alt, "full_url": src})

    parsed_pages[slug] = {
        "slug": slug,
        "title": title,
        "meta_description": meta_desc,
        "headings": headings,
        "paragraphs": paragraphs,
        "tables": tables,
        "price_boxes": price_boxes,
        "images": images
    }

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(parsed_pages, f, indent=2, ensure_ascii=False)

print(f"Parsed {len(parsed_pages)} pages into {OUTPUT_FILE}")
