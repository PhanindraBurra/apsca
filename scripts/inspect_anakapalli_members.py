from bs4 import BeautifulSoup

with open('_crawled_data/pages/anakapalli.html', 'r', encoding='utf-8', errors='ignore') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

print("District Title:", soup.find(['h1', 'h2']).get_text(strip=True) if soup.find(['h1', 'h2']) else '')

cards = []
# Look for member/carpenter blocks
for heading in soup.find_all(['h2', 'h3', 'h4']):
    text = heading.get_text(strip=True)
    if text in ['Anakapalli', 'Explore Us', 'Contact Info', 'Newsletter']:
        continue
    # look at surrounding elements
    parent = heading.find_parent(['div', 'section'])
    p_texts = [p.get_text(strip=True) for p in parent.find_all('p') if p.get_text(strip=True)] if parent else []
    img = parent.find('img') if parent else None
    cards.append({
        'name': text,
        'details': p_texts[:4],
        'img': img.get('src') if img else None
    })

print(f"Total members found in Anakapalli: {len(cards)}")
for c in cards[:5]:
    print(c)
