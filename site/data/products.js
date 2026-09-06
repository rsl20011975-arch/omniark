/* OMNIARK 제품 원장 — 이 파일 하나만 고치면 모든 화면이 바뀝니다.
   제품을 추가하려면 아래 배열에 { } 덩어리 하나를 복사해 붙이고 값만 바꾸세요.

   status  : live(출항) | beta(시운전) | dev(착공) | design(설계) | idea(구상)
   stage   : 0~4 (설계·착공·내장·시운전·진수 중 지금 어디인지)
   lastWork: 마지막으로 손댄 날. 비워두면 공정판에서 정박일수를 못 셉니다.
   art     : 카드 배경 이름 — jade / steel / ochre / violet / wine / teal
*/
window.OMNIARK_PRODUCTS = [
  {
    id: "jjocoach",
    name: "쪼코치",
    nameEn: "JJO Coach",
    tagline: "녹음 한 번에 발성·속도·끊어읽기를 짚어주는 낭독 코치.",
    audience: "목소리로 먹고사는 사람",
    group: "maker",
    status: "live",
    stage: 4,
    statusNote: "Google Play 출시중",
    lastWork: "2026-09-03",
    url: "https://play.google.com/store",
    art: "jade"
  },
  {
    id: "klangguide",
    name: "klangguide",
    nameEn: "Klang Guide",
    tagline: "한국어 단어를 뜻·쓰임·뉘앙스까지 묶어 보여주는 학습 사이트. 뉘앙스 사전 1,000장 이상.",
    audience: "한국어를 배우는 외국인",
    group: "korean",
    status: "live",
    stage: 4,
    statusNote: "운영중",
    lastWork: "2026-08-02",
    url: "https://klangguide.com",
    art: "teal"
  },
  {
    id: "onepasscut",
    name: "원패스컷",
    nameEn: "One Pass Cut",
    tagline: "한 번에 훑고 한 번에 자르는 영상 컷 편집 도구. 되감기 없이 끝냅니다.",
    audience: "영상을 매주 올리는 사람",
    group: "maker",
    status: "beta",
    stage: 3,
    statusNote: "이번 달 진수 예정",
    lastWork: "2026-09-02",
    url: "",
    art: "ochre"
  },
  {
    id: "passgate",
    name: "PassGate",
    nameEn: "PassGate",
    tagline: "TOPIK II 쓰기 54번 답안을 공식 3범주로 즉시 채점합니다. 점수와 근거를 함께 돌려줍니다.",
    audience: "TOPIK II를 준비하는 학습자",
    group: "korean",
    status: "dev",
    stage: 2,
    statusNote: "0단계 구현 완료",
    lastWork: "2026-08-26",
    url: "",
    art: "steel"
  },
  {
    id: "malgyeol",
    name: "말결",
    nameEn: "Malgyeol",
    tagline: "같은 한국어 문장이 사람과 상황에 따라 어떻게 다르게 도착하는지 보여줍니다.",
    audience: "말의 온도를 알고 싶은 학습자",
    group: "korean",
    status: "dev",
    stage: 2,
    statusNote: "P1 화용 유형 확정 완료",
    lastWork: "2026-08-23",
    url: "",
    art: "violet"
  },
  {
    id: "subextract",
    name: "자막 추출기",
    nameEn: "Subtitle Extractor",
    tagline: "보던 영상의 자막을 그대로 학습 자료로 바꿔줍니다.",
    audience: "드라마로 한국어를 배우는 사람",
    group: "korean",
    status: "dev",
    stage: 2,
    statusNote: "자막 파싱까지 완료",
    lastWork: "2026-08-15",
    url: "",
    art: "wine"
  },
  {
    id: "soridari",
    name: "소리다리",
    nameEn: "Soridari",
    tagline: "한국어 발음 규칙을 소리로 건너가게 만드는 연습 도구. 공공 발음 데이터 확보 완료.",
    audience: "발음에서 막힌 학습자",
    group: "korean",
    status: "design",
    stage: 1,
    statusNote: "착공 준비",
    lastWork: "2026-08-26",
    url: "",
    art: "teal"
  },
  {
    id: "jjoweb",
    name: "쪼코치 웹",
    nameEn: "JJO Coach Web",
    tagline: "설치 없이 브라우저에서 바로 녹음하고 평가받습니다.",
    audience: "앱 설치가 부담스러운 사람",
    group: "maker",
    status: "design",
    stage: 1,
    statusNote: "설계 중",
    lastWork: "2026-09-03",
    url: "",
    art: "jade"
  },
  {
    id: "verse",
    name: "성경암송",
    nameEn: "Verse Trainer",
    tagline: "구절을 게임처럼 반복해 외우게 하는 암송 트레이너.",
    audience: "매일 한 구절씩 외우려는 사람",
    group: "maker",
    status: "idea",
    stage: 0,
    statusNote: "구상",
    lastWork: "",
    url: "",
    art: "steel"
  },
  {
    id: "reactorplus",
    name: "리액터+",
    nameEn: "Reactor Plus",
    tagline: "영상 자막 위에 뉘앙스 해석과 발음 규칙을 얹어서 봅니다.",
    audience: "영상으로 공부하는 학습자",
    group: "korean",
    status: "idea",
    stage: 0,
    statusNote: "구상",
    lastWork: "",
    url: "",
    art: "violet"
  }
];

/* 진열대 그룹. 카드가 줄을 채우도록 두 갈래로만 나눕니다 —
   줄이 안 차면 카드 하나가 덩그러니 남아 초라해 보입니다. */
window.OMNIARK_GROUPS = [
  { id: "korean", title: "한국어를 배우는 사람에게", note: "뜻이 아니라 쓰임을 가르치는 도구" },
  { id: "maker",  title: "말하고 만드는 사람에게",   note: "목소리와 영상을 다루는 시간을 줄이는 도구" }
];

window.OMNIARK_STATUS = {
  live:   { label: "출시중",   tone: "ok"   },
  beta:   { label: "시운전",   tone: "beta" },
  dev:    { label: "개발중",   tone: "dev"  },
  design: { label: "설계 중",  tone: "plan" },
  idea:   { label: "구상",     tone: "plan" }
};
