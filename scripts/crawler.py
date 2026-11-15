import os
import re
import json
import urllib.parse
from urllib.parse import urljoin, urlparse
import requests
from bs4 import BeautifulSoup
from PIL import Image
from collections import Counter

BASE_URL = "https://apsca.co.in"
DOMAIN = "apsca.co.in"

OUT_DIR = os.path.abspath("./_crawled_data")
PAGES_DIR = os.path.join(OUT_DIR, "pages")
IMAGES_DIR = os.path.join(OUT_DIR, "images")
os.makedirs(PAGES_DIR, exist_ok=True)
os.makedirs(IMAGES_DIR, exist_ok=True)

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

visited_urls = set()
to_visit = [BASE_URL, f"{BASE_URL}/"]
discovered_pages = {}
downloaded_images = {}

def normalize_url(url):
    parsed = urlparse(url)
    clean_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
    if clean_url.endswith("/index.php") or clean_url.endswith("/index.html"):
        clean_url = clean_url.rsplit("/", 1)[0] + "/"
    return clean_url

def is_internal_url(url):
    parsed = urlparse(url)
    return DOMAIN in parsed.netloc

def get_slug(url):
    parsed = urlparse(url)
    path = parsed.path.strip("/")
    if not path:
        return "home"
    slug = re.sub(r'[^a-zA-Z0-9_-]', '_', path)
    return slug

print("Starting crawling APSCA...")

while to_visit:
    current_url = to_visit.pop(0)
    current_url = normalize_url(current_url)

    if current_url in visited_urls:
        continue

    # Skip files or useless wp paths
    if any(x in current_url.lower() for x in ['wp-admin', 'wp-login', 'wp-json', 'xmlrpc', 'feed', 'comments', '?s=', '.pdf', '.zip']):
        continue

    visited_urls.add(current_url)
    print(f"Fetching: {current_url}")

    try:
        resp = requests.get(current_url, headers=headers, timeout=20)
        if resp.status_code != 200:
            print(f"Status {resp.status_code} for {current_url}")
            continue

        html = resp.text
        slug = get_slug(current_url)
        page_file = os.path.join(PAGES_DIR, f"{slug}.html")
        with open(page_file, "w", encoding="utf-8") as f:
            f.write(html)

        soup = BeautifulSoup(html, "html.parser")
        title = soup.title.string.strip() if soup.title and soup.title.string else slug

        # Extract text blocks, headings
        headings = [h.get_text(strip=True) for h in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) if h.get_text(strip=True)]
        links_found = []
        page_images = []

        # Find internal links
        for a in soup.find_all('a', href=True):
            href = a['href'].strip()
            full_url = urljoin(current_url, href)
            full_normalized = normalize_url(full_url)
            text = a.get_text(strip=True)
            links_found.append({"text": text, "url": full_normalized})

            if is_internal_url(full_normalized) and full_normalized not in visited_urls and full_normalized not in to_visit:
                to_visit.append(full_normalized)

        # Find images
        for img in soup.find_all('img'):
            src = img.get('src') or img.get('data-src') or img.get('srcset')
            if src:
                # If srcset, grab the highest or first
                if ',' in src:
                    src = src.split(',')[0].strip().split(' ')[0]
                img_url = urljoin(current_url, src)
                alt = img.get('alt', '').strip()
                page_images.append({"url": img_url, "alt": alt})

        # Also search background images in inline styles
        for el in soup.find_all(style=True):
            style = el['style']
            urls_in_style = re.findall(r'url\([\'"]?(.*?)[\'"]?\)', style)
            for bg_url in urls_in_style:
                full_bg = urljoin(current_url, bg_url)
                page_images.append({"url": full_bg, "alt": "background-image"})

        discovered_pages[current_url] = {
            "title": title,
            "slug": slug,
            "headings": headings,
            "image_count": len(page_images),
            "images": page_images,
            "links": links_found
        }

    except Exception as e:
        print(f"Error fetching {current_url}: {e}")

print(f"\nCrawling complete. Visited {len(discovered_pages)} pages.")

# Download all unique images
print("\nDownloading images...")
all_images = {}
for p_url, p_data in discovered_pages.items():
    for img_obj in p_data["images"]:
        i_url = img_obj["url"]
        if i_url not in all_images:
            all_images[i_url] = img_obj["alt"]

for i_url, alt in all_images.items():
    try:
        parsed_img = urlparse(i_url)
        img_name = os.path.basename(parsed_img.path)
        if not img_name or '.' not in img_name:
            continue
        # clean filename
        img_name = re.sub(r'[^a-zA-Z0-9_\.-]', '_', img_name)
        save_path = os.path.join(IMAGES_DIR, img_name)
        if not os.path.exists(save_path):
            img_resp = requests.get(i_url, headers=headers, timeout=15)
            if img_resp.status_code == 200:
                with open(save_path, "wb") as f:
                    f.write(img_resp.content)
                downloaded_images[i_url] = {
                    "filename": img_name,
                    "local_path": save_path,
                    "alt": alt,
                    "size": len(img_resp.content)
                }
                print(f"Downloaded: {img_name} ({len(img_resp.content)} bytes)")
    except Exception as e:
        print(f"Error downloading {i_url}: {e}")

# Save crawl summary
summary = {
    "pages": discovered_pages,
    "images": downloaded_images
}
with open(os.path.join(OUT_DIR, "crawl_summary.json"), "w", encoding="utf-8") as f:
    json.dump(summary, f, indent=2)

print("\nSaved summary to crawl_summary.json")
