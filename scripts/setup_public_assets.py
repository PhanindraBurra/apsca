import os
import shutil
from PIL import Image

PUBLIC_DIR = "public"
PUBLIC_IMAGES = os.path.join(PUBLIC_DIR, "images")
SRC_DATA = os.path.join("src", "data")

os.makedirs(PUBLIC_IMAGES, exist_ok=True)
os.makedirs(SRC_DATA, exist_ok=True)

CRAWLED_IMAGES = "_crawled_data/images"
copied_count = 0

for f in os.listdir(CRAWLED_IMAGES):
    src_path = os.path.join(CRAWLED_IMAGES, f)
    dst_path = os.path.join(PUBLIC_IMAGES, f)
    if os.path.isfile(src_path):
        shutil.copy2(src_path, dst_path)
        copied_count += 1

print(f"Copied {copied_count} images to {PUBLIC_IMAGES}")

# Setup logo
logo_src = os.path.join(PUBLIC_IMAGES, "WhatsApp_Image_2025-06-27_at_19.50.06_c2fc31c8-removebg-preview-1-r83vhkqbtwpuj0yie06suiwy5iyvf02vv6wq4kctf2.png")
if not os.path.exists(logo_src):
    for f in os.listdir(PUBLIC_IMAGES):
        if "removebg" in f:
            logo_src = os.path.join(PUBLIC_IMAGES, f)
            break

print("Primary Logo Source:", logo_src)
if os.path.exists(logo_src):
    shutil.copy2(logo_src, os.path.join(PUBLIC_DIR, "logo.png"))
    shutil.copy2(logo_src, os.path.join(PUBLIC_DIR, "favicon.png"))
    # Save ico
    try:
        im = Image.open(logo_src)
        im.resize((64, 64)).save(os.path.join(PUBLIC_DIR, "favicon.ico"), format="ICO")
    except Exception as e:
        print("ICO creation note:", e)

# Copy data files to src/data
data_files = [
    "all_pages_content.json",
    "district_members.json",
    "carpenters_directory.json",
    "services_and_events.json"
]

for df in data_files:
    sp = os.path.join("_crawled_data", df)
    dp = os.path.join(SRC_DATA, df)
    if os.path.exists(sp):
        shutil.copy2(sp, dp)
        print(f"Copied {df} to {SRC_DATA}")

print("Assets and data setup completed!")
