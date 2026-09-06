/* OMNIARK 제품 원장 — 이 파일 하나만 고치면 영어판·한국어판이 동시에 바뀝니다.
   제품을 추가하려면 { } 덩어리 하나를 복사해 붙이고 값만 바꾸세요.

   글이 들어가는 칸은 전부 { ko: "...", en: "..." } 두 짝입니다. 한쪽만 쓰면 그 언어에서 빈칸이 됩니다.

   status  : live(출항) | beta(시운전) | dev(착공) | design(설계) | idea(구상)
   stage   : 0~4 (설계·착공·내장·시운전·진수 중 지금 어디인지)
   lastWork: 마지막으로 손댄 날. 비워두면 공정판에서 "아직 손대지 않음"으로 나옵니다.
   art     : 카드 배경 이름 — jade / teal / steel / ochre / violet / wine
*/
window.OMNIARK_PRODUCTS = [
  {
    id: "klangguide",
    name: { ko: "klangguide", en: "klangguide" },
    tagline: {
      ko: "한국어 단어를 뜻·쓰임·뉘앙스까지 묶어 보여주는 학습 사이트. 뉘앙스 사전 1,000장 이상.",
      en: "A Korean dictionary that teaches how a word is used, not just what it means. Over 1,000 nuance cards with audio."
    },
    audience: { ko: "한국어를 배우는 외국인", en: "People learning Korean" },
    group: "meaning",
    status: "live",
    stage: 4,
    statusNote: { ko: "운영중", en: "Live" },
    lastWork: "2026-08-02",
    url: "https://klangguide.com",
    art: "teal"
  },
  {
    id: "jjocoach",
    name: { ko: "쪼코치", en: "TakeCoach" },
    tagline: {
      ko: "대본을 읽으면 어절마다 표준 발음이 붙고, 문장 위에 내 억양 곡선이 그려집니다. 어느 음절이 안 맞았는지 짚어줍니다.",
      en: "Read a script aloud. Standard pronunciation appears beside each word, your pitch is drawn over the sentence, and it marks the syllables that missed."
    },
    audience: { ko: "발음과 억양을 다듬는 사람", en: "People working on pronunciation and delivery" },
    group: "sound",
    status: "live",
    stage: 4,
    statusNote: { ko: "Google Play 출시중", en: "On Google Play" },
    lastWork: "2026-09-03",
    url: "https://play.google.com/store/apps/details?id=com.jjocoach.jjo_coach",
    art: "jade"
  },
  {
    id: "onepasscut",
    name: { ko: "원패스컷", en: "One Pass Cut" },
    tagline: {
      ko: "한 번에 훑고 한 번에 자르는 영상 컷 편집 도구. 되감기 없이 끝냅니다.",
      en: "Watch it once, cut it once. Video editing that never asks you to rewind."
    },
    audience: { ko: "영상을 매주 올리는 사람", en: "People who publish video every week" },
    group: "other",
    status: "beta",
    stage: 3,
    statusNote: { ko: "이번 달 진수 예정", en: "Shipping this month" },
    lastWork: "2026-09-02",
    url: "",
    art: "ochre"
  },
  {
    id: "passgate",
    name: { ko: "PassGate", en: "PassGate" },
    tagline: {
      ko: "TOPIK II 쓰기 54번 답안을 공식 3범주로 즉시 채점합니다. 점수와 근거를 함께 돌려줍니다.",
      en: "Grades TOPIK II Writing Task 54 against the three official criteria — instantly, and tells you why."
    },
    audience: { ko: "TOPIK II를 준비하는 학습자", en: "People sitting TOPIK II" },
    group: "other",
    status: "dev",
    stage: 2,
    statusNote: { ko: "0단계 구현 완료", en: "Stage 0 complete" },
    lastWork: "2026-08-26",
    url: "",
    art: "steel"
  },
  {
    id: "malgyeol",
    name: { ko: "말결", en: "Malgyeol" },
    tagline: {
      ko: "같은 한국어 문장이 사람과 상황에 따라 어떻게 다르게 도착하는지 보여줍니다.",
      en: "Shows how the same Korean sentence lands differently depending on who you say it to."
    },
    audience: { ko: "말의 온도를 알고 싶은 학습자", en: "Learners who want to hear tone" },
    group: "meaning",
    status: "dev",
    stage: 2,
    statusNote: { ko: "P1 화용 유형 확정 완료", en: "Pragmatic types locked" },
    lastWork: "2026-08-23",
    url: "",
    art: "violet"
  },
  {
    id: "subextract",
    name: { ko: "자막 추출기", en: "Subtitle Extractor" },
    tagline: {
      ko: "보던 영상의 자막을 그대로 학습 자료로 바꿔줍니다.",
      en: "Turns the subtitles you were already watching into study material."
    },
    audience: { ko: "드라마로 한국어를 배우는 사람", en: "People learning Korean from drama" },
    group: "meaning",
    status: "dev",
    stage: 2,
    statusNote: { ko: "자막 파싱까지 완료", en: "Subtitle parsing done" },
    lastWork: "2026-08-15",
    url: "",
    art: "wine"
  },
  {
    id: "soridari",
    name: { ko: "소리다리", en: "Soridari" },
    tagline: {
      ko: "한국어 발음 규칙을 소리로 건너가게 만드는 연습 도구. 공공 발음 데이터 확보 완료.",
      en: "Korean pronunciation rules you practice by ear, built on Korea's public pronunciation data."
    },
    audience: { ko: "발음에서 막힌 학습자", en: "Learners stuck on pronunciation" },
    group: "sound",
    status: "design",
    stage: 1,
    statusNote: { ko: "착공 준비", en: "Ready to start" },
    lastWork: "2026-08-26",
    url: "",
    art: "teal"
  },
  {
    id: "jjoweb",
    name: { ko: "쪼코치 웹", en: "TakeCoach Web" },
    tagline: {
      ko: "설치 없이 브라우저에서 바로 녹음하고 평가받습니다.",
      en: "The same Pronunciation Report and Pitch Monitor in a browser. Nothing to install."
    },
    audience: { ko: "앱 설치가 부담스러운 사람", en: "People who would rather not install an app" },
    group: "sound",
    status: "design",
    stage: 1,
    statusNote: { ko: "설계 중", en: "In design" },
    lastWork: "2026-09-03",
    url: "",
    art: "jade"
  },
  {
    id: "verse",
    name: { ko: "성경암송", en: "Verse Trainer" },
    tagline: {
      ko: "구절을 게임처럼 반복해 외우게 하는 암송 트레이너.",
      en: "Memorize scripture by repetition, shaped like a game rather than a drill."
    },
    audience: { ko: "매일 한 구절씩 외우려는 사람", en: "People memorizing a verse a day" },
    group: "other",
    status: "idea",
    stage: 0,
    statusNote: { ko: "구상", en: "Concept" },
    lastWork: "",
    url: "",
    art: "steel"
  },
  {
    id: "reactorplus",
    name: { ko: "리액터+", en: "Reactor Plus" },
    tagline: {
      ko: "영상 자막 위에 뉘앙스 해석과 발음 규칙을 얹어서 봅니다.",
      en: "Nuance notes and pronunciation rules layered straight onto video subtitles."
    },
    audience: { ko: "영상으로 공부하는 학습자", en: "People who study from video" },
    group: "meaning",
    status: "idea",
    stage: 0,
    statusNote: { ko: "구상", en: "Concept" },
    lastWork: "",
    url: "",
    art: "violet"
  }
];

/* 진열대 그룹. 학습자가 막히는 자리를 기준으로 나눕니다 —
   소리에서 막히느냐, 뜻에서 막히느냐. 그 밖의 것은 솔직하게 "그 밖에"로 둡니다. */
window.OMNIARK_GROUPS = [
  {
    id: "sound",
    title: { ko: "소리에서 막힐 때", en: "When the sound is the problem" },
    note:  { ko: "표준 발음과 내 억양을 눈으로 보게 하는 도구", en: "Tools that show you your own pronunciation and pitch" }
  },
  {
    id: "meaning",
    title: { ko: "뜻에서 막힐 때", en: "When the meaning is the problem" },
    note:  { ko: "사전이 안 알려주는 쓰임과 뉘앙스", en: "The usage and nuance a dictionary leaves out" }
  },
  {
    id: "other",
    title: { ko: "시험 준비와 그 밖에", en: "Exam prep, and everything else" },
    note:  { ko: "한국어 밖에서 만들고 있는 것들", en: "What else this studio is building" }
  }
];

window.OMNIARK_STATUS = {
  live:   { label: { ko: "출시중",  en: "Live" },       tone: "ok"   },
  beta:   { label: { ko: "시운전",  en: "In testing" },  tone: "beta" },
  dev:    { label: { ko: "개발중",  en: "In progress" }, tone: "dev"  },
  design: { label: { ko: "설계 중", en: "In design" },   tone: "plan" },
  idea:   { label: { ko: "구상",    en: "Concept" },     tone: "plan" }
};
