/* 머리말·꼬리말·언어 전환·알림받기 창 — 모든 화면이 이 파일 하나를 부릅니다.
   언어는 각 HTML이 스크립트를 부르기 전에 window.OMNIARK_LANG 으로 정합니다. */
(function () {
  "use strict";

  // 이메일 명단은 klangguide에서 이미 쓰고 있는 MailerLite로 모읍니다.
  var MAILERLITE = "https://omniark-gsyfcg.subscribepage.io";
  var LANG = window.OMNIARK_LANG || "en";

  var MARK =
    '<svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">' +
    '<defs><linearGradient id="ark" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#6fd0b3"/><stop offset="1" stop-color="#2c7761"/>' +
    '</linearGradient></defs>' +
    '<path d="M4 21 L16 4 L28 21 L22.5 21 L16 11 L9.5 21 Z" fill="url(#ark)"/>' +
    '<path d="M6 24 Q16 30 26 24 L23 22 Q16 25.5 9 22 Z" fill="#4fa88b" opacity="0.75"/>' +
    "</svg>";

  function head(active) {
    var T = window.T;
    var page = active === "yard" ? "yard.html" : "index.html";
    var other = (LANG === "en" ? "ko/" : "../") + page;

    function link(href, text, key, cls) {
      return '<a href="' + href + '"' +
        (key === active ? ' aria-current="page"' : "") +
        (cls ? ' class="' + cls + '"' : "") + ">" + text + "</a>";
    }

    return (
      '<header class="site-head"><div class="wrap">' +
      '<a class="brand" href="index.html">' + MARK +
      '<span class="brand-name">Omniark</span></a>' +
      '<nav class="site-nav" aria-label="OMNIARK">' +
      link("index.html", T.nav.home, "home", "nav-home") +
      link("yard.html", T.nav.yard, "yard") +
      link("https://klangguide.com", T.nav.klang, "klang", "opt") +
      "</nav>" +
      '<a class="lang-switch" href="' + other + '" hreflang="' + (LANG === "en" ? "ko" : "en") + '">' +
      T.otherLangName + "</a>" +
      "</div></header>"
    );
  }

  function foot() {
    var T = window.T;
    return (
      '<footer class="site-foot"><div class="wrap">' +
      "<div>© " + new Date().getFullYear() + " OMNIARK · " + T.footTagline + "</div>" +
      '<div class="foot-links">' +
      '<a href="yard.html">' + T.nav.yard + "</a>" +
      '<a href="https://klangguide.com">klangguide.com</a>' +
      '<a href="mailto:rsl.2001.1975@gmail.com">' + T.footContact + "</a>" +
      "</div></div></footer>"
    );
  }

  function sheet() {
    var T = window.T;
    return (
      '<div class="sheet" id="notify-sheet" role="dialog" aria-modal="true" aria-labelledby="notify-title" hidden>' +
      '<div class="sheet-card">' +
      '<h3 id="notify-title">' + T.sheetTitle + "</h3>" +
      '<p id="notify-body">' + T.stripBody + "</p>" +
      '<div class="sheet-actions">' +
      '<a class="btn btn-primary" id="notify-go" href="' + MAILERLITE + '" target="_blank" rel="noopener">' + T.sheetGo + "</a>" +
      '<button class="sheet-close" type="button" data-close>' + T.sheetClose + "</button>" +
      "</div></div></div>"
    );
  }

  function mountSheet() {
    var el = document.getElementById("notify-sheet");
    var body = document.getElementById("notify-body");
    var go = document.getElementById("notify-go");
    var opener = null;

    function close() {
      el.hidden = true;
      if (opener) { opener.focus(); opener = null; }
    }
    el.addEventListener("click", function (e) {
      if (e.target === el || e.target.hasAttribute("data-close")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !el.hidden) close();
    });

    window.omniarkNotify = function (productName, trigger) {
      opener = trigger || null;
      body.textContent = window.T.sheetBody(productName);
      go.href = MAILERLITE + "?utm_source=omniark&utm_content=" + encodeURIComponent(productName);
      el.hidden = false;
      go.focus();
    };
  }

  window.omniarkShell = function (active) {
    document.body.insertAdjacentHTML("afterbegin", head(active));
    document.body.insertAdjacentHTML("beforeend", foot() + sheet());
    mountSheet();
  };
})();
