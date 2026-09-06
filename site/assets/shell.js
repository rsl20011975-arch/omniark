/* 머리말·꼬리말·알림받기 창 — 모든 화면이 이 파일 하나를 부릅니다. */
(function () {
  "use strict";

  // 이메일 명단은 klangguide에서 이미 쓰고 있는 MailerLite로 모읍니다.
  var MAILERLITE = "https://omniark-gsyfcg.subscribepage.io";

  var MARK =
    '<svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">' +
    '<defs><linearGradient id="ark" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#6fd0b3"/><stop offset="1" stop-color="#2c7761"/>' +
    '</linearGradient></defs>' +
    '<path d="M4 21 L16 4 L28 21 L22.5 21 L16 11 L9.5 21 Z" fill="url(#ark)"/>' +
    '<path d="M6 24 Q16 30 26 24 L23 22 Q16 25.5 9 22 Z" fill="#4fa88b" opacity="0.75"/>' +
    "</svg>";

  var NAV = [
    { href: "index.html", text: "서비스", key: "home" },
    { href: "yard.html", text: "공정판", key: "yard" },
    { href: "https://klangguide.com", text: "klangguide", key: "klang", opt: true }
  ];

  function head(active) {
    var links = NAV.map(function (n) {
      return (
        '<a href="' + n.href + '"' +
        (n.key === active ? ' aria-current="page"' : "") +
        (n.opt ? ' class="opt"' : "") +
        ">" + n.text + "</a>"
      );
    }).join("");

    return (
      '<header class="site-head"><div class="wrap">' +
      '<a class="brand" href="index.html">' + MARK +
      '<span class="brand-name">Omniark</span></a>' +
      '<nav class="site-nav" aria-label="주요 메뉴">' + links + "</nav>" +
      "</div></header>"
    );
  }

  function foot() {
    var year = new Date().getFullYear();
    return (
      '<footer class="site-foot"><div class="wrap">' +
      "<div>© " + year + " OMNIARK · 한국어와 목소리를 다루는 1인 스튜디오</div>" +
      '<div class="foot-links">' +
      '<a href="yard.html">공정판</a>' +
      '<a href="https://klangguide.com">klangguide.com</a>' +
      '<a href="mailto:rsl.2001.1975@gmail.com">문의</a>' +
      "</div></div></footer>"
    );
  }

  function sheet() {
    return (
      '<div class="sheet" id="notify-sheet" role="dialog" aria-modal="true" aria-labelledby="notify-title" hidden>' +
      '<div class="sheet-card">' +
      '<h3 id="notify-title">출시하면 가장 먼저 알려드릴게요</h3>' +
      '<p id="notify-body">이메일만 남겨두시면 준비되는 날 딱 한 번 보내드립니다. 광고는 보내지 않습니다.</p>' +
      '<div class="sheet-actions">' +
      '<a class="btn btn-primary" id="notify-go" href="' + MAILERLITE + '" target="_blank" rel="noopener">이메일 남기기</a>' +
      '<button class="sheet-close" type="button" data-close>닫기</button>' +
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
      body.textContent =
        productName + " 이(가) 출시되면 딱 한 번 메일을 보내드립니다. 광고는 보내지 않습니다.";
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
