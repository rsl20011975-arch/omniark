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

  /* 히어로에는 가장 앞선 제품 하나만 세웁니다 — 출시중이 있으면 그것, 없으면 시운전 중인 것. */
  function lead() {
    return P.find(function (p) { return p.status === "live"; }) ||
           P.find(function (p) { return p.status === "beta"; }) || P[0];
  }

  function heroHTML(p) {
    var st = STATUS[p.status] || { label: p.status, tone: "plan" };
    var cta = p.url
      ? '<a class="btn btn-primary" href="' + esc(p.url) + '" target="_blank" rel="noopener">지금 써보기</a>'
      : '<button class="btn btn-primary" type="button" data-notify="' + esc(p.name) + '">출시 알림받기</button>';

    return (
      '<div class="hero-art"></div>' +
      '<div class="wrap"><div class="hero-inner">' +
      '<div class="hero-badges">' +
      '<span class="badge ' + st.tone + '"><span class="dot"></span>' + esc(p.statusNote) + "</span>" +
      '<span class="badge">' + esc(p.audience) + "</span>" +
      "</div>" +
      "<h1>" + esc(p.name) + "</h1>" +
      '<p class="hero-lede">' + esc(p.tagline) + "</p>" +
      '<div class="hero-actions">' + cta +
      '<a class="btn btn-ghost" href="yard.html">전부 어디까지 왔는지 보기</a></div>' +
      "</div>" +
      '<div class="hero-poster art art-' + esc(p.art) + '" aria-hidden="true">' +
      '<span class="pen">' + esc(p.nameEn) + "</span>" +
      '<span class="pname">' + esc(p.name) + "</span>" +
      '<span class="prule"></span>' +
      '<span class="ptag">' + esc(p.audience) + "을 위한 도구</span>" +
      "</div></div>"
    );
  }

  function tileHTML(p) {
    var st = STATUS[p.status] || { label: p.status, tone: "plan" };
    var action = p.url
      ? '<a class="tile-action" href="' + esc(p.url) + '" target="_blank" rel="noopener">열어보기</a>'
      : '<button class="tile-action" type="button" data-notify="' + esc(p.name) + '">알림받기</button>';

    return (
      '<article class="tile">' +
      '<div class="tile-art art art-' + esc(p.art) + '"><h3>' + esc(p.name) + "</h3></div>" +
      '<div class="tile-body">' +
      '<p class="tile-audience">' + esc(p.audience) + "</p>" +
      '<p class="tile-tagline">' + esc(p.tagline) + "</p>" +
      '<div class="tile-foot">' +
      '<span class="chip ' + st.tone + '">' + esc(st.label) + "</span>" +
      action +
      "</div></div></article>"
    );
  }

  /* 히어로에 세운 제품도 진열대에 그대로 둡니다 —
     빼면 그 줄이 한 칸 비어서 오히려 허전해집니다. */
  function rowsHTML() {
    return GROUPS.map(function (g) {
      var items = P.filter(function (p) { return p.group === g.id; });
      if (!items.length) return "";
      return (
        '<section class="row">' +
        '<div class="row-head"><h2>' + esc(g.title) + "</h2>" +
        '<span class="count mono">' + items.length + "</span>" +
        '<span class="note">' + esc(g.note) + "</span></div>" +
        '<div class="tiles">' + items.map(tileHTML).join("") + "</div>" +
        "</section>"
      );
    }).join("");
  }

  function wireNotify(root) {
    root.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-notify]");
      if (btn) window.omniarkNotify(btn.getAttribute("data-notify"), btn);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var top = lead();
    document.getElementById("hero").innerHTML = heroHTML(top);
    document.getElementById("rows").innerHTML = rowsHTML();
    window.omniarkShell("home");
    wireNotify(document.body);
  });
})();
