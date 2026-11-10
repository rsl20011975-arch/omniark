/**
 * 검색엔진에 열어 둘지. 2026-11-10 드림님 지시("모두 열어야지")로 true.
 * false 로 바꾸면 /lab 은 noindex 이고 sitemap.xml 에도 들어가지 않는다.
 */
export const LAB_INDEXABLE = true;

export const LAB_NAV = [
  { href: "/products", label: "제품·서비스" },
  { href: "/blog", label: "개발 노트" },
  { href: "/guides", label: "활용 가이드" },
  { href: "/lab", label: "Visual Lab" },
  { href: "/about", label: "소개" },
];
