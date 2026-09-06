"""화면 검수 — 네 페이지를 세 폭으로 렌더해서 스크린샷을 찍고,
가로 스크롤·JS 오류·너무 작은 글자를 함께 잽니다.

    python tools/shoot.py 결과폴더
"""
import sys, pathlib
from playwright.sync_api import sync_playwright

SITE = pathlib.Path(__file__).resolve().parent.parent / "site"
OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "shots")
OUT.mkdir(parents=True, exist_ok=True)

WIDTHS = [("1440", 1440, 1000), ("768", 768, 1100), ("320", 320, 900)]
PAGES = [
    ("en-home", "index.html"),
    ("en-yard", "yard.html"),
    ("ko-home", "ko/index.html"),
    ("ko-yard", "ko/yard.html"),
]

fails = 0
with sync_playwright() as p:
    browser = p.chromium.launch()
    for name, rel in PAGES:
        for wname, w, h in WIDTHS:
            page = browser.new_page(viewport={"width": w, "height": h})
            errs = []
            page.on("pageerror", lambda e: errs.append(str(e)))
            page.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
            page.goto((SITE / rel).as_uri(), wait_until="networkidle")
            page.wait_for_timeout(600)
            page.screenshot(path=str(OUT / f"{name}-{wname}.png"), full_page=(wname == "1440"))

            over = page.evaluate(
                "document.documentElement.scrollWidth - document.documentElement.clientWidth")
            tiny = page.evaluate(
                "[...document.querySelectorAll('*')].filter(e=>e.children.length===0"
                "&&e.textContent.trim()&&parseFloat(getComputedStyle(e).fontSize)<11).length")
            empty = page.evaluate(
                "document.querySelectorAll('.tile, .job').length")

            bad = over > 0 or tiny > 0 or errs or empty == 0
            fails += 1 if bad else 0
            print(f"{'FAIL' if bad else 'ok  '} {name:8s} w={w:5d} "
                  f"overflow={over}px tiny={tiny} cards={empty} errors={len(errs)}")
            for e in errs[:3]:
                print(f"        ! {e[:120]}")
            page.close()
    browser.close()

print("\n" + ("FAILED" if fails else "ALL PASS") + " - " + str(fails) + " problem(s)")
sys.exit(1 if fails else 0)
