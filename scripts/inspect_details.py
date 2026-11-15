import json
import os

with open('_crawled_data/all_pages_content.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

with open('_crawled_data/pages_sample_preview.txt', 'w', encoding='utf-8') as out:
    for slug in ['home', 'about-us', 'contact-us', 'register', 'members', 'indias-biggest-skill-competition', 'furniture-making', 'anakapalli', 'east-godavari']:
        p = data.get(slug, {})
        out.write(f"\n{'='*50}\nPAGE: {slug}\nTITLE: {p.get('title')}\n{'='*50}\n")
        out.write("HEADINGS:\n")
        for h in p.get('headings', []):
            out.write(f"  [{h['tag']}] {h['text']}\n")
        out.write("\nPARAGRAPHS:\n")
        for para in p.get('paragraphs', [])[:10]:
            out.write(f"  - {para}\n")
        out.write("\nIMAGES:\n")
        for img in p.get('images', [])[:8]:
            out.write(f"  * src: {img['src']} | alt: {img['alt']}\n")

print("Wrote _crawled_data/pages_sample_preview.txt successfully.")
