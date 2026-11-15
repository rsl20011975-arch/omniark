// 실제 화면 틀(결정 #37·#38): 안에 페이지를 담고, 카메라·손으로 그린 표시·이름표·포인터·클릭 물결을 얹는다.
// 쓰는 법: const sc = Screen(부모, [왼, 위, 폭, 높이]); sc.content 에 페이지를 넣고, 매 프레임 sc.frame(T, {cam, marks, tags, cursor}).
//   cam   [cx, cy, z] 페이지 좌표의 어디를 가운데에, 몇 배로(1 = 가로가 틀에 꽉 참)
//   marks [{pts, t, d, off, col, w}] 그린 만큼만 보이는 선(ring/underline 경로). off 시각에 사라진다
//   tags  [{html, at:[x,y], on, off, cls}] 줌과 상관없이 같은 크기로 보이는 이름표
//   cursor Stage.Cursor
(() => {
  const { clamp, p, eio, eo, bo, pathD, camera } = Stage;
  const CUR = '<path d="M1 1 L1 22 L6.5 17 L10.5 26.5 L14 25 L10 16 L17.5 16 Z" fill="#fff" stroke="#1c1b18" stroke-width="1.6" stroke-linejoin="round"/>';

  window.Screen = (parent, [l, t, w, h], pageW = 1280, bg = "#f6f4ef") => {
    const el = document.createElement("div"); el.className = "scr";
    Object.assign(el.style, { left: l + "px", top: t + "px", width: w + "px", height: h + "px", background: bg });
    el.innerHTML = `<div class="scr-cam"><div class="scr-page"></div><svg class="scr-ov" width="${pageW}" height="2400"></svg><div class="scr-tags"></div><div class="scr-rips"></div><svg class="scr-cur" viewBox="0 0 20 28">${CUR}</svg></div>`;
    parent.appendChild(el);
    const q = s => el.querySelector(s), base = w / pageW;
    let marks = null, tags = null;
    return {
      el, content: q(".scr-page"), base, z: base,
      frame(T, { cam = [pageW / 2, h / base / 2, 1], marks: M = [], tags: G = [], cursor = null }) {
        q(".scr-cam").style.transform = camera(w, h, base, cam); const z = this.z = base * cam[2];
        if (marks !== M) { marks = M; q(".scr-ov").innerHTML = M.map((m, i) => `<path id="mk${i}" pathLength="1" stroke="${m.col || "#6d28d9"}" stroke-width="${m.w || 7}" fill="none" stroke-linecap="round" stroke-linejoin="round" d="${pathD(m.pts)}"/>`).join("") }
        M.forEach((m, i) => { const e = q("#mk" + i); e.style.strokeDasharray = "1"; e.style.strokeDashoffset = 1 - eio(p(T, m.t, m.d || .6)); e.style.opacity = m.off == null ? 1 : 1 - eio(p(T, m.off, .35)); e.style.strokeWidth = (m.w || 7) * base / z * 1.2 });
        if (tags !== G) { tags = G; q(".scr-tags").innerHTML = G.map((g, i) => `<div class="scr-tag ${g.cls || "see"}" id="tg${i}" style="left:${g.at[0]}px;top:${g.at[1]}px">${g.html}</div>`).join("") }
        G.forEach((g, i) => { const e = q("#tg" + i), v = bo(p(T, g.on, .45)) * (g.off == null ? 1 : 1 - eio(p(T, g.off, .35))); e.style.opacity = clamp(v * 1.6); e.style.transform = `scale(${(.6 + .4 * v) * base / z})` });
        const c = q(".scr-cur");
        if (!cursor) { c.style.display = "none"; q(".scr-rips").innerHTML = ""; return }
        const [x, y] = cursor.pos(T), pr = cursor.pressed(T) ? .82 : 1;
        Object.assign(c.style, { display: "block", left: x + "px", top: y + "px", transform: `scale(${pr * base / z * 1.15})` });
        q(".scr-rips").innerHTML = cursor.ripples(T).map(r => { const s = 80 * r.k * base / z; return `<div class="scr-rip" style="left:${r.at[0] - s / 2}px;top:${r.at[1] - s / 2}px;width:${s}px;height:${s}px;opacity:${1 - r.k}"></div>` }).join("");
      },
    };
  };
})();
