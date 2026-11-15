from bs4 import BeautifulSoup

with open('_crawled_data/pages/home.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

print("All images on home page:")
for i, img in enumerate(soup.find_all('img')):
    src = img.get('src') or img.get('data-src') or ''
    alt = img.get('alt') or ''
    cls = img.get('class') or []
    parent = img.parent.name if img.parent else ''
    print(f"[{i}] src='{src}' alt='{alt}' class='{cls}' parent='{parent}'")
