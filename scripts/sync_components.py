# ==============================================================================
# Regent Fuel Injectors — Component Sync Tool
# Syncs header.html and footer.html across all site HTML files automatically.
# Usage: python scripts/sync_components.py
# ==============================================================================
import os
import glob
import re

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT_DIR)

with open("header.html", "r", encoding="utf-8") as f:
    header_raw = f.read()

with open("footer.html", "r", encoding="utf-8") as f:
    footer_raw = f.read()

html_files = glob.glob("*.html") + glob.glob("products/*.html")

for filepath in html_files:
    if filepath in ("header.html", "footer.html", "includes/header.html", "includes/footer.html"):
        continue

    is_subfolder = bool(os.path.dirname(filepath))
    root_prefix = "../" if is_subfolder else ""

    page_header = header_raw.replace("{{ROOT}}", root_prefix)
    page_footer = footer_raw.replace("{{ROOT}}", root_prefix)

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace header: from TOP UTILITY BAR or MAIN HEADER & NAV to </nav>
    header_pattern = r"(<!-- ================= (?:TOP UTILITY BAR|MAIN HEADER & NAV).*?<!-- ================= MOBILE NAVIGATION DRAWER ================= -->\s*<nav class=\"mobile-nav\"[^>]*>.*?</nav>)"
    if re.search(header_pattern, content, re.DOTALL):
        content = re.sub(header_pattern, page_header, content, count=1, flags=re.DOTALL)
    else:
        print(f"Warning: header pattern not matched in {filepath}")

    # Replace footer: from <!-- ================= SITE FOOTER to </footer>
    footer_pattern = r"(<!-- ================= SITE FOOTER.*?</footer>)"
    if re.search(footer_pattern, content, re.DOTALL):
        content = re.sub(footer_pattern, page_footer, content, count=1, flags=re.DOTALL)
    else:
        print(f"Warning: footer pattern not matched in {filepath}")

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Synced header and footer to {filepath}")

print("Sync completed successfully across all pages.")
