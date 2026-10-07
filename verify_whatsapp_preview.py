from pathlib import Path
import json
import re
import struct
import zlib

html = Path("index.html").read_text(encoding="utf-8")
image_path = Path("images/social/whatsapp-preview.png")
raw_png = image_path.read_bytes()
assert raw_png[:8] == b"\x89PNG\r\n\x1a\n"

position = 8
chunks = []
while position + 12 <= len(raw_png):
    length = struct.unpack(">I", raw_png[position:position + 4])[0]
    tag = raw_png[position + 4:position + 8]
    data = raw_png[position + 8:position + 8 + length]
    chunks.append((tag, data))
    position += 12 + length

width, height, bit_depth, color_type = struct.unpack(">IIBB", next(data for tag, data in chunks if tag == b"IHDR")[:8])
assert (width, height, bit_depth, color_type) == (1200, 630, 8, 2)

compressed = b"".join(data for tag, data in chunks if tag == b"IDAT")
scanlines = zlib.decompress(compressed)
row_size = width * 3
assert len(scanlines) == height * (row_size + 1)

pixels = []
for row in range(height):
    start = row * (row_size + 1) + 1
    pixels.append(scanlines[start:start + row_size])

unique_colors = set()
for row in pixels:
    for idx in range(0, len(row), 3):
        unique_colors.add(tuple(row[idx:idx + 3]))

assert len(unique_colors) > 1000
assert "property=\"og:image\" content=\"https://regentfuelinjectors.com/images/social/whatsapp-preview.png\"" in html
assert "name=\"twitter:image\" content=\"https://regentfuelinjectors.com/images/social/whatsapp-preview.png\"" in html
schema = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.S).group(1))
assert schema["@graph"][1]["image"].endswith("/images/social/whatsapp-preview.png")

print(f"PASS: PNG {width}x{height}, {image_path.stat().st_size} bytes")
print(f"PASS: Decoded {len(unique_colors)} unique colors")
print("PASS: Open Graph image URL")
print("PASS: Twitter image URL")
print("PASS: LocalBusiness schema image URL")
