from bs4 import BeautifulSoup
import json

with open('_crawled_data/pages/members.html', 'r', encoding='utf-8', errors='ignore') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

print("=== MEMBERS.HTML LEADERSHIP TEAM ===")
leaders = []
# Look for team member widgets or headings
for h in soup.find_all(['h2', 'h3', 'h4', 'h5']):
    text = h.get_text(strip=True)
    if text in ['Our Team', 'Introducing our best carpenters.', 'Professional Carpenter', 'Solid as the wood we work with.', 'Interested in joining our team?', 'Explore Us', 'Contact Info', 'Newsletter']:
        continue
    # parent container
    parent = h.find_parent(['div', 'section'])
    p_tags = [p.get_text(strip=True) for p in parent.find_all('p') if p.get_text(strip=True)] if parent else []
    img = parent.find('img') if parent else None
    leaders.append({
        'title_or_name': text,
        'details': p_tags,
        'img': img.get('src') if img else None
    })

print(f"Total items found: {len(leaders)}")
with open('_crawled_data/state_committee.json', 'w', encoding='utf-8') as f:
    json.dump(leaders, f, indent=2, ensure_ascii=False)

for l in leaders:
    print(l)
