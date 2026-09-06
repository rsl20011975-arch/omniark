/* 화면에 박히는 글. 제품 설명이 아닌 것은 전부 여기 있습니다.
   문구를 고치려면 여기만 고칩니다 — HTML을 열 필요가 없습니다. */
window.OMNIARK_STRINGS = {
  ko: {
    langName: "한국어",
    otherLangName: "English",
    nav: { home: "서비스", yard: "공정판", klang: "klangguide" },
    skip: "본문으로 건너뛰기",
    heroTry: "지금 써보기",
    heroNotify: "출시 알림받기",
    heroYard: "전부 어디까지 왔는지 보기",
    tileOpen: "열어보기",
    tileNotify: "알림받기",
    stripTitle: "먼저 아는 사람이 되세요",
    stripBody: "여기 있는 도구는 하나씩 완성돼서 나옵니다. 이메일을 남겨두시면 새로 나오는 날 딱 한 번 알려드립니다. 광고는 보내지 않습니다.",
    stripCta: "이메일 남기기",
    stripSubject: "OMNIARK의 새 도구",
    sheetTitle: "출시하면 가장 먼저 알려드릴게요",
    sheetBody: function (n) { return n + " 이(가) 출시되면 딱 한 번 메일을 보내드립니다. 광고는 보내지 않습니다."; },
    sheetGo: "이메일 남기기",
    sheetClose: "닫기",
    footTagline: "한국어와 목소리를 다루는 1인 스튜디오",
    footContact: "문의",
    yardKicker: "OMNIARK 조선소",
    yardHead: function (n) { return "짓고 있는 배 " + n + "척.<br>이번 달엔 하나를 띄웁니다."; },
    yardLede: "다 짓고 나서 보여주는 대신, 짓는 과정을 그대로 걸어둡니다. 여기 걸린 배는 반드시 물에 띄웁니다.",
    yardBoard: "공정판",
    yardBoardNote: "마지막 작업일 기준 · 30일 넘게 손 안 대면 정박으로 표시됩니다",
    launchLabel: "이번 달 진수 예정",
    lanes: ["구상", "설계", "착공", "시운전", "출항"],
    steps: ["설계", "착공", "내장", "시운전", "진수"],
    laneEmpty: "비어 있음",
    laneOnlyOne: "여기는 한 척만 올립니다",
    meters: ["출항 완료", "손대고 있음", "아직 구상만", "일 이상 정박"],
    whenLive: "운영중",
    whenNever: "아직 손대지 않음",
    whenToday: "오늘 작업",
    whenAgo: function (d) { return d + "일 전 작업"; },
    whenStalled: function (d) { return d + "일째 정박"; }
  },

  en: {
    langName: "English",
    otherLangName: "한국어",
    nav: { home: "Products", yard: "Yard", klang: "klangguide" },
    skip: "Skip to content",
    heroTry: "Open it",
    heroNotify: "Notify me at launch",
    heroYard: "See where everything stands",
    tileOpen: "Open",
    tileNotify: "Notify me",
    stripTitle: "Hear about it first",
    stripBody: "These tools ship one at a time. Leave an email and you get exactly one message on the day a new one is ready. No newsletters, no ads.",
    stripCta: "Leave an email",
    stripSubject: "the next OMNIARK tool",
    sheetTitle: "We will tell you the day it opens",
    sheetBody: function (n) { return "You get exactly one email when " + n + " is ready. No newsletters, no ads."; },
    sheetGo: "Leave an email",
    sheetClose: "Close",
    footTagline: "A one-person studio working on Korean and the human voice",
    footContact: "Contact",
    yardKicker: "The OMNIARK yard",
    yardHead: function (n) { return n + " unfinished builds.<br>One of them ships this month."; },
    yardLede: "Instead of showing the work once it is done, the work stays on the wall while it is being done. Everything on this board gets launched.",
    yardBoard: "The board",
    yardBoardNote: "By last worked date · anything untouched for 30 days is marked stalled",
    launchLabel: "Shipping this month",
    lanes: ["Concept", "Design", "Building", "Testing", "Launched"],
    steps: ["Design", "Build", "Fit out", "Test", "Launch"],
    laneEmpty: "Empty",
    laneOnlyOne: "Only one build sits here",
    meters: ["launched", "being worked on", "still just an idea", "days stalled or more"],
    whenLive: "Live",
    whenNever: "Not started yet",
    whenToday: "Worked on today",
    whenAgo: function (d) { return "Worked on " + d + " days ago"; },
    whenStalled: function (d) { return "Stalled for " + d + " days"; }
  }
};

/* 현재 언어의 문구 묶음과, 두 짝짜리 값에서 현재 언어를 꺼내는 도구. */
window.T = window.OMNIARK_STRINGS[window.OMNIARK_LANG || "en"];
window.pick = function (v) {
  if (v == null) return "";
  return typeof v === "string" ? v : (v[window.OMNIARK_LANG] || v.en || v.ko || "");
};
