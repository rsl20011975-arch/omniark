/**
 * 검색엔진에 열어 둘지. 용어가 충분히 쌓이고 드림님이 열기로 하기 전까지 false.
 * false 면 /lab 은 noindex 이고 sitemap.xml 에도 들어가지 않는다.
 */
export const LAB_INDEXABLE = false;

export const LAB_NAV = [
  { href: "/products", label: "제품·서비스" },
  { href: "/blog", label: "개발 노트" },
  { href: "/guides", label: "활용 가이드" },
  { href: "/lab", label: "Visual Lab" },
  { href: "/about", label: "소개" },
];
