# -*- coding: utf-8 -*-
"""Replace TinyMCE Cloud CDN with jsDelivr open-source, UTF-8 safe."""
from pathlib import Path
import re

ROOT = Path(r"D:/Program_DEV/3DCookieHD-education-platform")
OLD = "https://cdn.tiny.cloud/1/mvw2dv577uz6ru7oboooo1vpsgfgtj25kfa5sci9bblekdy3/tinymce/6/tinymce.min.js"
NEW = "https://cdn.jsdelivr.net/npm/tinymce@6.8.5/tinymce.min.js"
BASE = "https://cdn.jsdelivr.net/npm/tinymce@6.8.5"

VIEW_FILES = [
    "src/views/admin_prototype_gallery.ts",
    "src/views/admin_education_gallery.ts",
    "src/views/admin_portfolio_gallery.ts",
    "src/views/admin_posts.ts",
    "src/views/posts.ts",
    "src/views/admin_courses_sub.ts",
]

JS_FILES = [
    "public/admin-courses.js",
    "public/static/course-sessions-register.js",
]


def ensure_script_and_globals(text: str) -> str:
    old_tag = f'<script src="{OLD}" referrerpolicy="origin"></script>'
    new_tag = f'<script src="{NEW}" referrerpolicy="origin"></script>'
    globals_tag = (
        f"<script>window.TINYMCE_BASE_URL='{BASE}';"
        "window.TINYMCE_SUFFIX='.min';</script>"
    )
    if old_tag in text:
        text = text.replace(old_tag, new_tag + "\n    " + globals_tag)
    elif new_tag in text and "TINYMCE_BASE_URL" not in text:
        text = text.replace(new_tag, new_tag + "\n    " + globals_tag)
    return text


def ensure_init_base(text: str, for_js: bool = False) -> str:
    def repl(m: re.Match) -> str:
        indent = m.group(1)
        following = m.string[m.end() : m.end() + 120]
        if "base_url:" in following:
            return m.group(0)
        if for_js:
            line1 = (
                "base_url: (typeof window !== 'undefined' && window.TINYMCE_BASE_URL) || "
                f"'{BASE}',"
            )
            line2 = (
                "suffix: (typeof window !== 'undefined' && window.TINYMCE_SUFFIX) || '.min',"
            )
        else:
            line1 = f"base_url: window.TINYMCE_BASE_URL || '{BASE}',"
            line2 = "suffix: window.TINYMCE_SUFFIX || '.min',"
        return f"tinymce.init({{\n{indent}{line1}\n{indent}{line2}\n{indent}"

    return re.sub(r"tinymce\.init\(\{\s*\n([ \t]*)", repl, text)


def main() -> None:
    for rel in VIEW_FILES:
        path = ROOT / rel
        original = path.read_text(encoding="utf-8")
        text = ensure_script_and_globals(original)
        text = ensure_init_base(text, for_js=False)
        if text != original:
            path.write_text(text, encoding="utf-8", newline="\n")
            print(rel, "updated")
        else:
            print(rel, "unchanged")

    for rel in JS_FILES:
        path = ROOT / rel
        original = path.read_text(encoding="utf-8")
        text = ensure_init_base(original, for_js=True)
        if text != original:
            path.write_text(text, encoding="utf-8", newline="\n")
            print(rel, "updated")
        else:
            print(rel, "unchanged")

    p = ROOT / "src/views/admin_prototype_gallery.ts"
    t = p.read_text(encoding="utf-8")
    print("verify 시제품:", "시제품" in t)
    print("verify no cloud:", "cdn.tiny.cloud" not in t)
    print("verify jsdelivr:", NEW in t)
    print("verify init base_url:", "base_url: window.TINYMCE_BASE_URL" in t)
    print("verify no fffd:", "\ufffd" not in t)


if __name__ == "__main__":
    main()
