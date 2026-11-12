export type Field = { slug: string; name: string; group: "기초" | "연출" | "제작"; desc: string };

export type Ref = { state: "확인" | "추정" | "원본 없음"; text: string; title: string | null; url: string | null };

/** 응용 팁: 지시문을 한 줄만 고쳤을 때 달라지는 것. 팁마다 값만 바꾼 데모(적용본)가 따로 있다. */
export type Tip = { id: string; title: string; situation: string; from: string; to: string; effect: string };

/** 만드는 순서 한 단계. code 는 있을 때만 */
export type Step = { t: string; d: string; code?: string };
/** 전문용어 풀이: 그 말을 AI에게 어떻게 써서 지시하는지까지 */
export type Jargon = { w: string; en: string; m: string; say: string };

export type Detail = {
  demo: string;
  prompt: string;
  check: string[];
  use: string[];
  tech: string[];
  refs: Ref[];
  related: { name: string; note: string }[];
  episode?: { no: string; title: string; slug: string };
  /** 응용 팁과 같이 쓰는 ‘대충 시킴 vs 이름으로 시킴’ 비교. 팁을 쓰기 전에는 없다 */
  vs?: { bad: string; badResult: string; good: string; goodResult: string };
  tips: Tip[];
  steps: Step[];
  terms: Jargon[];
  /** 0 이면 단계별 보기 없음. 2 이상이면 ‘N단계까지 적용한 모습’을 데모에서 볼 수 있다 */
  levels: number;
};

export type Term = {
  order: number;
  slug: string;
  name: string;
  en: string;
  field: string;
  level: string;
  purposes: string[];
  media: string[];
  oneLine: string;
  preview: string | null;
  poster?: string;
  keywords: string[];
  status: "published" | "planned";
  detail?: Detail;
};

export type Episode = { no: string; title: string; frame: string; slug: string };
export type LookupRow = { feel: string; term: string };

/** 검색 색인 한 줄: 짧은 이름표로 줄여 브라우저로 보낸다 */
export type SearchEntry = { n: string; en: string; f: string; l: string; u: string; k: string[]; d: string };
