import os
import re
from urllib.parse import urlparse
import requests
from PIL import Image
from collections import Counter

PAGES_DIR = "_crawled_data/pages"
IMAGES_DIR = "_crawled_data/images"
os.makedirs(IMAGES_DIR, exist_ok=True)

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

image_urls = set()

# Fast regex extraction from all crawled html files
for fname in os.listdir(PAGES_DIR):
    if not fname.endswith(".html"):
        continue
    filepath = os.path.join(PAGES_DIR, fname)
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    # Find all image URLs
    matches = re.findall(r'https?://[^\s"\'\<\>\)]+?\.(?:png|jpg|jpeg|webp|svg|gif)', content)
    for m in matches:
        if "apsca.co.in" in m:
            image_urls.add(m)

print(f"Total unique APSCA images found: {len(image_urls)}")

# Download each image
logo_url = None
for u in sorted(image_urls):
    parsed = urlparse(u)
    fname = os.path.basename(parsed.path)
    clean_name = re.sub(r'[^a-zA-Z0-9_\.-]', '_', fname)
    local_path = os.path.join(IMAGES_DIR, clean_name)

    if "c2fc31c8" in u or ("WhatsApp" in u and "removebg" in u):
        logo_url = u
        print(f"FOUND LOGO CANDIDATE: {u}")

    if not os.path.exists(local_path):
        try:
            r = requests.get(u, headers=headers, timeout=10)
            if r.status_code == 200:
                with open(local_path, "wb") as f:
                    f.write(r.content)
                print(f"Downloaded: {clean_name} ({len(r.content)} bytes)")
        except Exception as e:
            print(f"Error {u}: {e}")

print(f"\nAll downloads completed. {len(os.listdir(IMAGES_DIR))} files in {IMAGES_DIR}")

# Identify exact logo
logo_file = None
for f in os.listdir(IMAGES_DIR):
    if "c2fc31c8" in f or ("WhatsApp" in f and "removebg" in f):
        logo_file = os.path.join(IMAGES_DIR, f)
        break

if not logo_file:
    # check for largest logo or apsca-1
    for f in os.listdir(IMAGES_DIR):
        if "apsca" in f.lower():
            logo_file = os.path.join(IMAGES_DIR, f)
            break

print(f"Active Logo File: {logo_file}")

if logo_file and os.path.exists(logo_file):
    img = Image.open(logo_file).convert("RGBA")
    w, h = img.size
    print(f"Logo Size: {w}x{h}")
    # Extract dominant non-transparent colors
    pixels = list(img.getdata())
    non_trans = [p for p in pixels if p[3] > 40]
    print(f"Total non-transparent pixels: {len(non_trans)}")

    # Color bucketing
    color_buckets = Counter()
    exact_colors = Counter()
    for r, g, b, a in non_trans:
        exact_colors[(r, g, b)] += 1
        bucket = (round(r / 20) * 20, round(g / 20) * 20, round(b / 20) * 20)
        color_buckets[bucket] += 1

    print("\n--- DOMINANT COLOR PALETTE FROM LOGO ---")
    for (r, g, b), count in color_buckets.most_common(15):
        pct = (count / len(non_trans)) * 100
        hex_c = f"#{min(r, 255):02X}{min(g, 255):02X}{min(b, 255):02X}"
        print(f"Bucket: {hex_c} RGB({r}, {g}, {b}) - {pct:.2f}% ({count} px)")

    print("\n--- TOP EXACT RGB COLORS ---")
    for (r, g, b), count in exact_colors.most_common(10):
        pct = (count / len(non_trans)) * 100
        hex_c = f"#{r:02X}{g:02X}{b:02X}"
        print(f"Exact: {hex_c} RGB({r}, {g}, {b}) - {pct:.2f}% ({count} px)")
