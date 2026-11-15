from bs4 import BeautifulSoup

with open("_crawled_data/pricing_details.txt", "w", encoding="utf-8") as out:
    for page in ['home.html', 'register.html', 'member-login.html', 'my-account-2.html']:
        with open(f'_crawled_data/pages/{page}', 'r', encoding='utf-8', errors='ignore') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
        out.write(f"\n==================== {page} ====================\n")
        for el in soup.find_all(class_=lambda c: c and any(k in c.lower() for k in ['price', 'pricing', 'elementor-price-table', 'ihc-level', 'ihc-register'])):
            txt = ' '.join(el.get_text().split())
            out.write(f"Class: {el.get('class')}\nText: {txt}\n\n")

print("Wrote pricing_details.txt")
