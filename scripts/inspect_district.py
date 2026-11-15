import re

def inspect_district(fname):
    with open(f'_crawled_data/pages/{fname}', 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    print(f"=== {fname} ===")
    h2s = re.findall(r'<h[23][^>]*>(.*?)</h[23]>', text)
    print("Headings:", h2s[:10])
    # check for committee members or carpenter profiles
    profiles = re.findall(r'Name-([^<\n]+)', text)
    print("Total 'Name-' found:", len(profiles))
    if profiles:
        print("First 3 names:", profiles[:3])

inspect_district('anakapalli.html')
inspect_district('east-godavari.html')
inspect_district('srikakulam.html')
