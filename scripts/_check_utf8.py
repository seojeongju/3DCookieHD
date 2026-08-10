# -*- coding: utf-8 -*-
import pathlib, re
files = [
    "src/views/admin_prototype_gallery.ts",
    "src/views/admin_education_gallery.ts",
    "src/views/admin_portfolio_gallery.ts",
    "src/views/admin_posts.ts",
    "src/views/posts.ts",
    "src/views/admin_courses_sub.ts",
    "public/admin-courses.js",
    "public/static/course-sessions-register.js",
]
root = pathlib.Path(r"D:/Program_DEV/3DCookieHD-education-platform")
for f in files:
    p = root / f
    t = p.read_text(encoding="utf-8")
    has_hangul = any("\uac00" <= c <= "\ud7a3" for c in t)
    has_fffd = "\ufffd" in t
    m = re.search(r"<title>([^<]+)</title>", t)
    title = m.group(1) if m else ""
    cloud = "cdn.tiny.cloud" in t
    jsdelivr = "jsdelivr.net/npm/tinymce" in t
    print(f"{f}: hangul={has_hangul} fffd={has_fffd} cloud={cloud} jsdelivr={jsdelivr} title={title}")
