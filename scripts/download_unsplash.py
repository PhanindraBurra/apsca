import requests
import os

enriched_images = {
    "hero-carpenter.jpg": "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1920&q=80",
    "craftsman-workshop.jpg": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    "wood-carving-art.jpg": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
    "modern-timber.jpg": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    "polished-wood.jpg": "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80"
}

headers = {"User-Agent": "Mozilla/5.0"}
for fname, url in enriched_images.items():
    p = os.path.join("public", "images", fname)
    if not os.path.exists(p):
        try:
            r = requests.get(url, headers=headers, timeout=15)
            if r.status_code == 200:
                with open(p, "wb") as f:
                    f.write(r.content)
                print(f"Downloaded enriched photo: {fname}")
        except Exception as e:
            print(f"Error downloading {fname}: {e}")

print("Enriched photos ready!")
