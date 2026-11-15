import os
from bs4 import BeautifulSoup
import re
import json

home_path = "_crawled_data/pages/home.html"
if not os.path.exists(home_path):
    print("home.html not found yet")
    exit(0)

with open(home_path, "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")

print("--- SITE TITLE & META ---")
print("Title:", soup.title.string if soup.title else "N/A")
for meta in soup.find_all("meta"):
    if meta.get("name") in ["description", "keywords"] or meta.get("property") in ["og:title", "og:description", "og:image"]:
        print(f"{meta.get('name') or meta.get('property')}: {meta.get('content')}")

print("\n--- LOGO CANDIDATES ---")
for img in soup.find_all("img"):
    src = img.get("src", "")
    alt = img.get("alt", "")
    cls = " ".join(img.get("class", []))
    if any(k in src.lower() or k in alt.lower() or k in cls.lower() for k in ["logo", "brand", "header"]):
        print(f"SRC: {src} | ALT: {alt} | CLASS: {cls}")

# Header menus
print("\n--- HEADER MENU ITEMS ---")
navs = soup.find_all(["nav", "div"], class_=lambda c: c and ("menu" in c.lower() or "nav" in c.lower() or "ekit" in c.lower()))
menu_links = []
for a in soup.find_all("a"):
    href = a.get("href", "")
    text = a.get_text(strip=True)
    if text and href and not href.startswith("#") and "apsca.co.in" in href:
        menu_links.append((text, href))

# Remove duplicates while preserving order
seen = set()
unique_links = []
for t, h in menu_links:
    if (t, h) not in seen:
        seen.add((t, h))
        unique_links.append((t, h))

print(f"Total links found: {len(unique_links)}")
for t, h in unique_links[:40]:
    print(f"  [{t}] -> {h}")
