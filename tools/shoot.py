import sys, pathlib
from playwright.sync_api import sync_playwright

SITE = pathlib.Path(r"D:\omniark web\site")
OUT = pathlib.Path(sys.argv[1]); OUT.mkdir(parents=True, exist_ok=True)
WIDTHS = [("1440", 1440, 1000), ("768", 768, 1100), ("320", 320, 900)]
PAGES = [("home", "index.html"), ("yard", "yard.html")]

with sync_playwright() as p:
    b = p.chromium.launch()
    for pname, f in PAGES:
        for wname, w, h in WIDTHS:
            pg = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
            errs = []
            pg.on("console", lambda m: errs.append(m.type + ": " + m.text) if m.type == "error" else None)
            pg.on("pageerror", lambda e: errs.append("pageerror: " + str(e)))
            pg.goto((SITE / f).as_uri(), wait_until="networkidle")
            pg.wait_for_timeout(700)
            full = (wname == "1440")
            pg.screenshot(path=str(OUT / f"{pname}-{wname}.png"), full_page=full)
            # 가로 스크롤 발생 여부 실측
            over = pg.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
            print(f"{pname}-{wname}: 가로스크롤={'발생' if over else '없음'} 오류={errs if errs else '없음'}")
            pg.close()
    b.close()
print("done")
