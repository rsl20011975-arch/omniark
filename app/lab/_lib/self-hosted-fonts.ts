/**
 * /lab 에서 쓰는 글꼴을 우리 사이트에서 직접 내보낸다(결정 #74).
 * 예전에는 Google Fonts·jsDelivr 에서 불러와 방문자 브라우저가 제3자에게 요청을 보냈다.
 * 모두 SIL Open Font License 1.1 — 재배포 허용, 라이선스 전문은 /lab/fonts 내려받기 묶음에 함께 넣는다.
 * 한국어 글꼴은 글자 범위(unicode-range)별로 잘게 나뉘어 있어, 화면에 나온 글자의 조각만 내려받는다.
 */
import "wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/black-han-sans/400.css";
import "@fontsource/ibm-plex-sans-kr/400.css";
import "@fontsource/ibm-plex-sans-kr/500.css";
import "@fontsource/ibm-plex-sans-kr/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
