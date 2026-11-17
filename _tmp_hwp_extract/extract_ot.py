# -*- coding: utf-8 -*-
import os, olefile, zlib, re

base = r"d:\Program_DEV\참조\3Dcookiehd_학사행정\개강서류\새 폴더"
out_dir = r"d:\Program_DEV\3DCookieHD-education-platform\_tmp_hwp_extract"

targets = [
    "3-1_오리엔테이션_수거용_스마트 제품개발을 위한 3D프린팅,아두이노,3D설계 실무과정_직업능력개발훈련.hwp",
    "3-2_오리엔테이션_배포용_스마트 제품개발을 위한 3D프린팅,아두이노,3D설계 실무과정.hwp",
    "4_미디어 촬영 동의서.hwp",
    "업무수행평가.hwp",
    "강의후설문조사_스마트 제품개발을 위한 3D프린팅,아두이노,3D설계 실무과정 + 1차.hwp",
    "5-3_출석입력요청대장(별지서식제16호).hwp",
]


def extract_body(path: str) -> str:
    ole = olefile.OleFileIO(path)
    chunks = []
    for entry in ole.listdir():
        name = "/".join(entry)
        if not name.startswith("BodyText"):
            continue
        data = ole.openstream(entry).read()
        raw = None
        for off in range(0, min(64, len(data))):
            try:
                raw = zlib.decompress(data[off:])
                break
            except Exception:
                continue
        if raw is None:
            raw = data
        text = raw.decode("utf-16le", "ignore")
        cleaned = []
        for ch in text:
            if (
                "\uac00" <= ch <= "\ud7a3"
                or ch in " .,;:()[]{}%/-+~\n\t'\"·￭○□■※<>:_=|"
                or ch.isdigit()
                or ("A" <= ch <= "Z")
                or ("a" <= ch <= "z")
            ):
                cleaned.append(ch)
            else:
                cleaned.append(" ")
        s = "".join(cleaned)
        s = re.sub(r"[ \t]+", " ", s)
        s = re.sub(r"\n{3,}", "\n\n", s)
        chunks.append(f"---{name}---\n{s.strip()}")
    ole.close()
    return "\n\n".join(chunks)


for f in targets:
    path = os.path.join(base, f)
    print("processing", f)
    body = extract_body(path)
    safe = re.sub(r"[^\w.-]+", "_", f)[:50]
    out = os.path.join(out_dir, f"BODY_{safe}.txt")
    with open(out, "w", encoding="utf-8") as w:
        w.write(body)
    print(" wrote", out, "len", len(body))
