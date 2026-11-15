import os
import re
import urllib.parse
from urllib.parse import urljoin, urlparse
import requests
from bs4 import BeautifulSoup
from PIL import Image
from collections import Counter

PAGES_DIR = "_crawled_data/pages"
IMAGES_DIR = "_crawled_data/images"
os.makedirs(IMAGES_DIR, exist_ok=True)

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

image_urls = set()

# Collect image URLs from all crawled pages
for fname in os.listdir(PAGES_DIR):
    if not fname.endswith(".html"):
        continue
    filepath = os.path.join(PAGES_DIR, fname)
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        html = f.read()

    soup = BeautifulSoup(html, "html.parser")
    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src")
        if src:
            image_urls.add(src)
        srcset = img.get("srcset")
        if srcset:
            for part in srcset.split(","):
                u = part.strip().split(" ")[0]
                if u:
                    image_urls.add(u)

    # find styles
    styles = soup.find_all(style=True)
    for s in styles:
        bgs = re.findall(r'url\([\'"]?(.*?)[\'"]?\)', s['style'])
        for bg in bgs:
            image_urls.add(bg)

    # find all wp-content/uploads links
    raw_matches = re.findall(r'https?://[^\s"\'\<\>\)]+wp-content/uploads[^\s"\'\<\>\)]+\.(?:png|jpg|jpeg|webp|svg|gif)', html)
    for rm in raw_matches:
        image_urls.add(rm)

print(f"Total unique images found across all pages: {len(image_urls)}")

downloaded = {}
logo_candidates = []

for u in sorted(image_urls):
    parsed = urlparse(u)
    fname = os.path.basename(parsed.path)
    if not fname:
        continue
    # Clean fname
    clean_name = re.sub(r'[^a-zA-Z0-9_\.-]', '_', fname)
    local_path = os.path.join(IMAGES_DIR, clean_name)

    if "WhatsApp_Image_2025-06-27_at_19.50.06" in u:
        logo_candidates.append(u)

    if not os.path.exists(local_path):
        try:
            r = requests.get(u, headers=headers, timeout=15)
            if r.status_code == 200:
                with open(local_path, "wb") as f:
                    f.write(r.content)
                downloaded[u] = clean_name
                print(f"Saved: {clean_name} ({len(r.content)} bytes)")
            else:
                print(f"Failed ({r.status_code}): {u}")
        except Exception as e:
            print(f"Error {u}: {e}")
    else:
        downloaded[u] = clean_name

print(f"Finished downloading. {len(os.listdir(IMAGES_DIR))} images in {IMAGES_DIR}")

# Analyze logo
print("\n--- LOGO IDENTIFICATION & COLOR EXTRACTION ---")
print("Logo candidates:", logo_candidates)

# Check if logo exists
best_logo = None
for fname in os.listdir(IMAGES_DIR):
    if "WhatsApp_Image_2025-06-27_at_19.50.06" in fname or "removebg" in fname:
        best_logo = os.path.join(IMAGES_DIR, fname)
        break

if not best_logo and os.path.exists(os.path.join(IMAGES_DIR, "apsca-1.webp")):
    best_logo = os.path.join(IMAGES_DIR, "apsca-1.webp")

print(f"Selected Logo File: {best_logo}")

if best_logo and os.path.exists(best_logo):
    img = Image.open(best_logo).convert("RGBA")
    w, h = img.size
    print(f"Logo dimensions: {w}x{h}")
    # Extract dominant non-transparent colors
    pixels = list(img.getdata())
    non_transparent = [p for p in pixels if p[3] > 50]
    
    # Quantize/sample to group similar colors
    color_counts = Counter()
    for r, g, b, a in non_transparent:
        # group by buckets of 16
        qr, qg, qb = (r // 16) * 16, (g // 16) * 16, (b // 16) * 16
        color_counts[(qr, qg, qb)] += 1

    top_colors = color_counts.most_common(12)
    print("\nTop Grouped Colors in Logo:")
    for (qr, qg, qb), count in top_colors:
        hex_code = f"#{qr:02x}{qg:02x}{qb:02x}"
        pct = (count / len(non_transparent)) * 100
        print(f"  {hex_code} (RGB: {qr}, {qg}, {qb}) - {pct:.2f}% ({count} px)")
