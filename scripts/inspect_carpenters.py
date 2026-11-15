import re

with open('_crawled_data/pages/carpenters.html', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

print("File size in characters:", len(content))
# Find article or main content
m = re.findall(r'<h[1-6][^>]*>(.*?)</h[1-6]>', content)
print("Headings in carpenters.html:", m[:15])

# Find tables or list items
tables = re.findall(r'<table[^>]*>.*?</table>', content, re.DOTALL)
print(f"Number of tables in carpenters.html: {len(tables)}")
if tables:
    print("First table sample (first 500 chars):", tables[0][:500])

# Check what takes up all the space
forms = re.findall(r'<form[^>]*>.*?</form>', content, re.DOTALL)
print(f"Number of forms: {len(forms)}")
if forms:
    print("Form sample:", forms[0][:500])

# Find select options (maybe a huge list of villages or carpenters?)
selects = re.findall(r'<select[^>]*>.*?</select>', content, re.DOTALL)
print(f"Number of select elements: {len(selects)}")
for s in selects:
    opts = re.findall(r'<option[^>]*>(.*?)</option>', s)
    print(f"Select element with {len(opts)} options! First 5: {opts[:5]}")
