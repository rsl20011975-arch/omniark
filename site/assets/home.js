/* 첫 화면 — 히어로 한 개와 그룹별 진열대를 products.js에서 그립니다. */
(function () {
  "use strict";

  var P = window.OMNIARK_PRODUCTS || [];
  var GROUPS = window.OMNIARK_GROUPS || [];
  var STATUS = window.OMNIARK_STATUS || {};

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function t(v) { return esc(window.pick(v)); }

  /* 히어로에는 가장 앞선 제품 하나만 세웁니다 — 목록의 첫 출시작. */
  function lead() {
    return P.find(function (p) { return p.status === "live"; }) ||
           P.find(function (p) { return p.status === "beta"; }) || P[0];
  }

  /* 부제는 "반대편 언어의 이름"입니다.
     영어판에서 Verse Trainer 밑에 성경암송이 보이면 스토어에서 찾을 수 있고 브랜드가 각인됩니다.
     이름이 양쪽 같으면 빈 자리로 두어 카드마다 제목 높이가 어긋나지 않게 합니다. */
  function otherName(p) {
    var other = window.OMNIARK_LANG === "ko" ? p.name.en : p.name.ko;
    return other && other !== window.pick(p.name) ? other : "";
  }
  function subName(p) {
    return '<span class="roman">' + esc(otherName(p)) + "</span>";
  }

  function heroHTML(p) {
    var T = window.T;
    var st = STATUS[p.status] || { tone: "plan" };
    var cta = p.url
      ? '<a class="btn btn-primary" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + T.heroTry + "</a>"
      : '<button class="btn btn-primary" type="button" data-notify="' + t(p.name) + '">' + T.heroNotify + "</button>";

    return (
      '<div class="hero-art"></div>' +
      '<div class="wrap"><div class="hero-inner">' +
      '<div class="hero-badges">' +
      '<span class="badge ' + st.tone + '"><span class="dot"></span>' + t(p.statusNote) + "</span>" +
      '<span class="badge">' + t(p.audience) + "</span>" +
      "</div>" +
      "<h1>" + t(p.name) + "</h1>" +
      '<p class="hero-lede">' + t(p.tagline) + "</p>" +
      '<div class="hero-actions">' + cta +
      '<a class="btn btn-ghost" href="yard.html">' + T.heroYard + "</a></div>" +
      "</div>" +
      '<div class="hero-poster art art-' + esc(p.art) + '" aria-hidden="true">' +
      '<span class="pen">' + esc(otherName(p) || window.pick(p.statusNote)) + "</span>" +
      '<span class="pname">' + t(p.name) + "</span>" +
      '<span class="prule"></span>' +
      '<span class="ptag">' + t(p.audience) + "</span>" +
      "</div></div>"
    );
  }

  function tileHTML(p) {
    var T = window.T;
    var st = STATUS[p.status] || { tone: "plan" };
    var action = p.url
      ? '<a class="tile-action" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + T.tileOpen + "</a>"
      : '<button class="tile-action" type="button" data-notify="' + t(p.name) + '">' + T.tileNotify + "</button>";

    return (
      '<article class="tile">' +
      '<div class="tile-art art art-' + esc(p.art) + '"><h3>' + t(p.name) + subName(p) + "</h3></div>" +
      '<div class="tile-body">' +
      '<p class="tile-audience">' + t(p.audience) + "</p>" +
      '<p class="tile-tagline">' + t(p.tagline) + "</p>" +
      '<div class="tile-foot">' +
      '<span class="chip ' + st.tone + '">' + t(st.label) + "</span>" +
      action +
      "</div></div></article>"
    );
  }

  function rowsHTML() {
    return GROUPS.map(function (g) {
      var items = P.filter(function (p) { return p.group === g.id; });
      if (!items.length) return "";
      return (
        '<section class="row">' +
        '<div class="row-head"><h2>' + t(g.title) + "</h2>" +
        '<span class="count mono">' + items.length + "</span>" +
        '<span class="note">' + t(g.note) + "</span></div>" +
        '<div class="tiles">' + items.map(tileHTML).join("") + "</div>" +
        "</section>"
      );
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var T = window.T;
    document.getElementById("hero").innerHTML = heroHTML(lead());
    document.getElementById("rows").innerHTML = rowsHTML();
    document.getElementById("strip-title").textContent = T.stripTitle;
    document.getElementById("strip-body").textContent = T.stripBody;
    var cta = document.getElementById("strip-cta");
    cta.textContent = T.stripCta;
    cta.setAttribute("data-notify", T.stripSubject);

    window.omniarkShell("home");
    document.body.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-notify]");
      if (btn) window.omniarkNotify(btn.getAttribute("data-notify"), btn);
    });
  });
})();
