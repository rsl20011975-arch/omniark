/* 공정판 — products.js의 stage와 lastWork만 보고 판을 그립니다.
   정박일수는 오늘 날짜에서 계산합니다. 방치하면 화면이 스스로 붉어집니다. */
(function () {
  "use strict";

  var P = window.OMNIARK_PRODUCTS || [];
  var STALL_DAYS = 30;               // 이 날수를 넘기면 "정박"으로 봅니다
  var LANES = ["구상", "설계", "착공", "시운전", "출항"];
  var STEPS = ["설계", "착공", "내장", "시운전", "진수"];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

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
    if (p.status === "live") return "운영중";
    var d = daysSince(p.lastWork);
    if (d === null) return "아직 손대지 않음";
    if (d >= STALL_DAYS) return d + "일째 정박";
    if (d === 0) return "오늘 작업";
    return d + "일 전 작업";
  }

  function jobHTML(p) {
    var t = tone(p);
    var d = daysSince(p.lastWork);
    var stalled = d !== null && d >= STALL_DAYS && p.status !== "live";
    return (
      '<article class="job ' + t + '">' +
      "<strong>" + esc(p.name) + "</strong>" +
      "<p>" + esc(p.statusNote) + "</p>" +
      '<span class="when' + (stalled ? " stall" : "") + '">' + esc(whenText(p)) + "</span>" +
      "</article>"
    );
  }

  function lanesHTML() {
    return LANES.map(function (title, i) {
      var items = P.filter(function (p) { return p.stage === i; });
      var body = items.length
        ? items.map(jobHTML).join("")
        : '<div class="lane-empty">비어 있음</div>';
      if (i === 3 && items.length) body += '<div class="lane-empty">여기는 한 척만 올립니다</div>';
      return (
        '<section class="lane">' +
        '<div class="lane-head"><span class="label">' + esc(title) + "</span>" +
        '<b class="mono">' + items.length + "</b></div>" +
        body + "</section>"
      );
    }).join("");
  }

  function launchHTML() {
    var ship = P.filter(function (p) { return p.status === "beta"; })
                .sort(function (a, b) { return b.stage - a.stage; })[0];
    if (!ship) return "";
    var bars = STEPS.map(function (_, i) {
      var cls = i < ship.stage ? "done" : (i === ship.stage ? "now" : "");
      return '<i class="' + cls + '"></i>';
    }).join("");
    return (
      '<div class="launch">' +
      '<div class="launch-head"><strong>' + esc(ship.name) + "</strong>" +
      '<span class="label">이번 달 진수 예정</span></div>' +
      "<p>" + esc(ship.tagline) + "</p>" +
      '<div class="steps">' + bars + "</div>" +
      '<div class="step-labels">' + STEPS.map(function (s) { return "<span>" + s + "</span>"; }).join("") + "</div>" +
      "</div>"
    );
  }

  function metersHTML() {
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

    return [
      ["ok", live, "출항 완료"],
      ["beta", moving, "손대고 있음"],
      ["dev", idea, "아직 구상만"],
      ["stall", stalled, STALL_DAYS + "일 이상 정박"]
    ].map(function (m) {
      var cls = m[1] === 0 ? "zero" : m[0];
      return '<div class="meter ' + cls + '"><b>' + m[1] + "</b><span>" + m[2] + "</span></div>";
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("launch").innerHTML = launchHTML();
    document.getElementById("meters").innerHTML = metersHTML();
    document.getElementById("lanes").innerHTML = lanesHTML();
    // 헤드라인 숫자는 "아직 안 띄운 배"만 셉니다 — 출항한 것까지 세면 거짓말이 됩니다.
    document.getElementById("total").textContent =
      P.filter(function (p) { return p.status !== "live"; }).length;
    window.omniarkShell("yard");
  });
})();
