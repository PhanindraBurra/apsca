with open('_crawled_data/pages/carpenters.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read(100000)

idx = text.find('000153')
with open('_crawled_data/sample_carpenter_card.txt', 'w', encoding='utf-8') as out:
    out.write(text[max(0, idx-800):idx+1200])

print("Written sample carpenter card to _crawled_data/sample_carpenter_card.txt")
