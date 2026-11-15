import os
from bs4 import BeautifulSoup
import json

services = [
    'furniture-making', 'cabinet-makers', 'wood-carving', 
    'temple-wood-works', 'toys-making', 'boat-making', 'vehicle-interior-exterior',
    'indias-biggest-skill-competition', 'world-skill-competition-2'
]

svc_data = {}
for s in services:
    with open(f'_crawled_data/pages/{s}.html', 'r', encoding='utf-8', errors='ignore') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    for tag in soup(['script', 'style', 'nav', 'header', 'footer']): tag.extract()
    
    # get headings and paragraphs
    h1 = soup.find(['h1', 'h2'])
    h_text = h1.get_text(strip=True) if h1 else s
    
    body_div = soup.find(class_=lambda c: c and ('elementor-page' in c or 'site-main' in c or 'entry-content' in c)) or soup.body
    paras = [p.get_text(strip=True) for p in body_div.find_all('p') if len(p.get_text(strip=True)) > 20]
    imgs = [os.path.basename(img.get('src') or '') for img in body_div.find_all('img') if img.get('src')]
    
    svc_data[s] = {
        'title': h_text,
        'paragraphs': paras,
        'images': imgs
    }

with open('_crawled_data/services_and_events.json', 'w', encoding='utf-8') as f:
    json.dump(svc_data, f, indent=2, ensure_ascii=False)

print("Saved services and events data!")
for k, v in svc_data.items():
    print(f"=== {k} ===")
    print("Title:", v['title'])
    for p in v['paragraphs'][:2]:
        print("  P:", p[:120] + "...")
