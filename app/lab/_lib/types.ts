export type Field = { slug: string; name: string; group: "기초" | "연출"; desc: string };

export type Ref = { state: "확인" | "추정"; text: string; title: string | null; url: string | null };

export type Detail = {
  prompt: string;
  check: string[];
  use: string[];
  tech: string[];
  refs: Ref[];
  related: { name: string; note: string }[];
  episode?: { no: string; title: string; slug: string };
  vs: { bad: string; badResult: string; good: string; goodResult: string };
};

export type Term = {
  slug: string;
  name: string;
  en: string;
  field: string;
  level: string;
  purposes: string[];
  media: string[];
  oneLine: string;
  preview: string | null;
  keywords: string[];
  status: "published" | "planned";
  detail?: Detail;
};

export type Episode = { no: string; title: string; frame: string; slug: string };
export type LookupRow = { feel: string; term: string };

/** 검색 색인 한 줄: 짧은 이름표로 줄여 브라우저로 보낸다 */
export type SearchEntry = { n: string; en: string; f: string; l: string; u: string; k: string[]; d: string };
