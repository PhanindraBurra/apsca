import os
import re
import json
from bs4 import BeautifulSoup

PAGES_DIR = "_crawled_data/pages"
all_page_details = {}

def clean_text(t):
    if not t:
        return ""
    return re.sub(r'\s+', ' ', t).strip()

for fname in os.listdir(PAGES_DIR):
    if not fname.endswith(".html"):
        continue
    if fname in ["carpenters.html", "welcome_carpenter.html"] or fname.startswith("wp-content"):
        continue

    slug = fname.replace(".html", "")
    fpath = os.path.join(PAGES_DIR, fname)
    with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
        html = f.read()

    soup = BeautifulSoup(html, "html.parser")
    title = soup.title.string.strip() if soup.title and soup.title.string else slug

    # Remove unwanted tags
    for tag in soup(["script", "style", "noscript", "svg"]):
        tag.extract()

    # Meta description
    meta_desc = ""
    m_tag = soup.find("meta", attrs={"name": "description"})
    if m_tag:
        meta_desc = m_tag.get("content", "").strip()

    # Main content / entry content
    content_div = soup.find(class_=lambda c: c and ("entry-content" in c or "elementor-page" in c or "site-main" in c)) or soup.body

    # Extract all headings
    headings = []
    if content_div:
        for h in content_div.find_all(["h1", "h2", "h3", "h4", "h5", "h6"]):
            t = clean_text(h.get_text())
            if t:
                headings.append({"tag": h.name, "text": t})

    # Extract all paragraphs
    paragraphs = []
    if content_div:
        for p in content_div.find_all("p"):
            t = clean_text(p.get_text())
            if t and len(t) > 3:
                paragraphs.append(t)

    # Extract list items
    lists = []
    if content_div:
        for ul in content_div.find_all(["ul", "ol"]):
            items = [clean_text(li.get_text()) for li in ul.find_all("li")]
            items = [i for i in items if i and len(i) > 2]
            if items:
                lists.append(items)

    # Extract tables
    tables = []
    if content_div:
        for tbl in content_div.find_all("table"):
            rows = []
            for tr in tbl.find_all("tr"):
                r = [clean_text(td.get_text()) for td in tr.find_all(["th", "td"])]
                if any(r):
                    rows.append(r)
            if rows:
                tables.append(rows)

    # Extract all images within content
    images = []
    if content_div:
        for img in content_div.find_all("img"):
            src = img.get("src") or img.get("data-src") or ""
            alt = img.get("alt", "").strip()
            if src and "gravatar" not in src:
                images.append({"src": os.path.basename(src), "alt": alt, "url": src})

    all_page_details[slug] = {
        "slug": slug,
        "title": title,
        "meta_description": meta_desc,
        "headings": headings,
        "paragraphs": paragraphs,
        "lists": lists,
        "tables": tables,
        "images": images
    }

with open("_crawled_data/all_pages_content.json", "w", encoding="utf-8") as f:
    json.dump(all_page_details, f, indent=2, ensure_ascii=False)

print(f"Extracted {len(all_page_details)} pages successfully!")
for slug, data in all_page_details.items():
    print(f"  Page: {slug:35s} | Headings: {len(data['headings']):2d} | Paragraphs: {len(data['paragraphs']):2d} | Images: {len(data['images']):2d}")
