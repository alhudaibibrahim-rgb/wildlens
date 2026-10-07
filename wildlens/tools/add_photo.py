"""Add a licensed reference photo for one animal.
Usage: python3 -I tools/add_photo.py <image> <animal-id> "<credit line>"
Center-crops to 4:3, resizes to 1200x900 JPEG (q82), writes photos/<id>.jpg and records the credit in photos.json.
Then run tools/build.py and publish dist/wildlens.html with photos/ as supporting files."""
import sys, json, os
from PIL import Image, ImageOps
if len(sys.argv) != 4: sys.exit(__doc__)
src, aid, credit = sys.argv[1:4]
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
im = ImageOps.fit(im, (1200, 900), Image.LANCZOS, centering=(0.5, 0.45))
out = os.path.join(root, "photos", aid + ".jpg")
im.save(out, "JPEG", quality=82, optimize=True, progressive=True)
pj = os.path.join(root, "photos.json")
meta = json.load(open(pj)) if os.path.exists(pj) else {}
meta[aid] = {"src": f"photos/{aid}.jpg", "credit": credit}
json.dump(meta, open(pj, "w"), indent=1)
print(f"{out} ({os.path.getsize(out):,} bytes)")
