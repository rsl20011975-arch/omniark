/* 공정판 — products.js의 stage와 lastWork만 보고 판을 그립니다.
   정박일수는 오늘 날짜에서 계산합니다. 방치하면 화면이 스스로 붉어집니다. */
(function () {
  "use strict";

  var P = window.OMNIARK_PRODUCTS || [];
  var STALL_DAYS = 30;               // 이 날수를 넘기면 "정박"으로 봅니다

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function t(v) { return esc(window.pick(v)); }

  function daysSince(iso) {
    if (!iso) return null;
    var then = new Date(iso + "T00:00:00");
    if (isNaN(then)) return null;
    return Math.floor((Date.now() - then.getTime()) / 86400000);
  }

  function tone(p) {
    if (p.status === "live") return "ok";
    if (p.status === "beta") return "beta";
    var d = daysSince(p.lastWork);
    if (d !== null && d >= STALL_DAYS) return "stall";
    return p.status === "dev" ? "dev" : "";
  }

  function whenText(p) {
    var T = window.T;
    if (p.status === "live") return T.whenLive;
    var d = daysSince(p.lastWork);
    if (d === null) return T.whenNever;
    if (d >= STALL_DAYS) return T.whenStalled(d);
    if (d === 0) return T.whenToday;
    return T.whenAgo(d);
  }

  function jobHTML(p) {
    var d = daysSince(p.lastWork);
    var stalled = d !== null && d >= STALL_DAYS && p.status !== "live";
    return (
      '<article class="job ' + tone(p) + '">' +
      "<strong>" + t(p.name) + "</strong>" +
      "<p>" + t(p.statusNote) + "</p>" +
      '<span class="when' + (stalled ? " stall" : "") + '">' + esc(whenText(p)) + "</span>" +
      "</article>"
    );
  }

  function lanesHTML() {
    var T = window.T;
    return T.lanes.map(function (title, i) {
      var items = P.filter(function (p) { return p.stage === i; });
      var body = items.length
        ? items.map(jobHTML).join("")
        : '<div class="lane-empty">' + T.laneEmpty + "</div>";
      if (i === 3 && items.length) body += '<div class="lane-empty">' + T.laneOnlyOne + "</div>";
      return (
        '<section class="lane">' +
        '<div class="lane-head"><span class="label">' + esc(title) + "</span>" +
        '<b class="mono">' + items.length + "</b></div>" +
        body + "</section>"
      );
    }).join("");
  }

  function launchHTML() {
    var T = window.T;
    var ship = P.filter(function (p) { return p.status === "beta"; })
                .sort(function (a, b) { return b.stage - a.stage; })[0];
    if (!ship) return "";
    var bars = T.steps.map(function (_, i) {
      return '<i class="' + (i < ship.stage ? "done" : (i === ship.stage ? "now" : "")) + '"></i>';
    }).join("");
    return (
      '<div class="launch">' +
      '<div class="launch-head"><strong>' + t(ship.name) + "</strong>" +
      '<span class="label">' + T.launchLabel + "</span></div>" +
      "<p>" + t(ship.tagline) + "</p>" +
      '<div class="steps">' + bars + "</div>" +
      '<div class="step-labels">' + T.steps.map(function (s) { return "<span>" + esc(s) + "</span>"; }).join("") + "</div>" +
      "</div>"
    );
  }

  function metersHTML() {
    var T = window.T;
    var live = P.filter(function (p) { return p.status === "live"; }).length;
    var moving = P.filter(function (p) {
      var d = daysSince(p.lastWork);
      return p.status !== "live" && d !== null && d < STALL_DAYS;
    }).length;
    var stalled = P.filter(function (p) {
      var d = daysSince(p.lastWork);
      return p.status !== "live" && d !== null && d >= STALL_DAYS;
    }).length;
    var idea = P.filter(function (p) { return !p.lastWork; }).length;
    var stallLabel = window.OMNIARK_LANG === "ko"
      ? STALL_DAYS + T.meters[3]
      : STALL_DAYS + " " + T.meters[3];

    return [
      ["ok", live, T.meters[0]],
      ["beta", moving, T.meters[1]],
      ["dev", idea, T.meters[2]],
      ["stall", stalled, stallLabel]
    ].map(function (m) {
      return '<div class="meter ' + (m[1] === 0 ? "zero" : m[0]) + '">' +
        "<b>" + m[1] + "</b><span>" + esc(m[2]) + "</span></div>";
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var T = window.T;
    // 헤드라인 숫자는 "아직 안 띄운 배"만 셉니다 — 출항한 것까지 세면 거짓말이 됩니다.
    var unfinished = P.filter(function (p) { return p.status !== "live"; }).length;

    document.getElementById("yard-kicker").textContent = T.yardKicker;
    document.getElementById("yard-head").innerHTML = T.yardHead(unfinished);
    document.getElementById("yard-lede").textContent = T.yardLede;
    document.getElementById("board-title").textContent = T.yardBoard;
    document.getElementById("board-note").textContent = T.yardBoardNote;
    document.getElementById("launch").innerHTML = launchHTML();
    document.getElementById("meters").innerHTML = metersHTML();
    document.getElementById("lanes").innerHTML = lanesHTML();

    window.omniarkShell("yard");
  });
})();
