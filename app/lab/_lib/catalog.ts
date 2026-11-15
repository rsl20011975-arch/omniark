import fs from "node:fs";
import path from "node:path";

/** 요소 사전·지시 문장·예시 영상(2단계). 내용은 lab-site/tools/extract_catalog.py 와 export_content.py 가 만든 사본이다. */
const DIR = path.join(process.cwd(), "app/lab/_content");
const read = <T,>(file: string): T => JSON.parse(fs.readFileSync(path.join(DIR, file), "utf8")) as T;

export type ChipLink = { n: number; href: string; name: string };
export type Chip = { t: string; s: "ok" | "todo" | "none"; links: ChipLink[] };
export type Cat = {
  no: string;
  name: string;
  chips: Chip[];
  clips: { id: string; label: string }[];
  notes: string[];
};
export type Elements = {
  sub: string;
  cats: Cat[];
  limits: { sub: string; items: string[] };
  counts: { chips: number; ok: number; todo: number; none: number; cats: number; clips: number; prompts: number; ideas: number };
};
export type Prompt = { status: "ok" | "todo"; name: string; text: string };
export type Prompts = { sub: string; items: Prompt[] };
export type Clip = { id: string; title: string; what: string; cmd: string; src: string; video: string; poster: string };
export type Clips = {
  sub: string;
  items: Clip[];
  full: { sub: string; text: string; caveat: string; video: string; poster: string };
};

/** 영상 소재(결정 #73): 원본의 내부 메모(비슷한 영상 현황·차별화 가능성)는 추출 단계에서 빠진다. */
export type Idea = { t: string; f: string; g: string; links: ChipLink[] };
export type Ideas = { sub: string; items: Idea[] };

/** AI에게 읽히는 연출 규칙(결정 #94). 새 세션이 0부터 다시 정하지 않게, 증거 등급을 붙여 모은 것. */
export type RuleLink = { href: string; name: string };
export type RuleGroup = "imgvid" | "shorts" | "longform" | "appui" | "aiimage";
export type Rule = { id: string; g?: RuleGroup; t: string; value: string; grade: "측정" | "지시" | "기록" | "추정" | "미확인"; basis: string; links: RuleLink[] };
/** 규칙 묶음: g 를 안 쓴 규칙은 imgvid. */
export const RULE_GROUPS: { id: RuleGroup; name: string; href: string }[] = [
  { id: "imgvid", name: "이미지→영상 연출 규칙", href: "https://omniark.co/lab/imgvid" },
  { id: "shorts", name: "쇼츠 제작 포맷 규칙", href: "https://omniark.co/lab/shorts" },
  { id: "longform", name: "롱폼 제작 포맷 규칙", href: "https://omniark.co/lab/longform" },
  { id: "appui", name: "앱·웹 화면 제작 규칙", href: "https://omniark.co/lab/appui" },
  { id: "aiimage", name: "AI 이미지 생성 제작 규칙", href: "https://omniark.co/lab/aiimage" },
];
export const rulesOf = (rs: Rule[], g: RuleGroup) => rs.filter((x) => (x.g ?? "imgvid") === g);
export type Rules = {
  title: string;
  updated: string;
  intro: string;
  usage: string[];
  frame: string[];
  translate: { word: string; split: string; example: string; links: RuleLink[] }[];
  rules: Rule[];
  pending: { t: string; a: string; b: string; now: string }[];
  bans: string[];
};

let cache: { el: Elements; pr: Prompts; cl: Clips; id: Ideas; ru: Rules } | null = null;
const load = () =>
  (cache ??= { el: read<Elements>("elements.json"), pr: read<Prompts>("prompts.json"), cl: read<Clips>("clips.json"), id: read<Ideas>("ideas.json"), ru: read<Rules>("rules.json") });

export const elements = (): Elements => load().el;
export const prompts = (): Prompts => load().pr;
export const clips = (): Clips => load().cl;
export const ideas = (): Ideas => load().id;
export const rules = (): Rules => load().ru;

/** 새 세션의 AI 가 그대로 읽는 순수 글(규칙 페이지와 /lab/rules/raw 가 같은 글을 쓴다). */
export function rulesText(): string {
  const r = rules();
  const L: string[] = [`# ${r.title} (${r.updated})`, "", r.intro, "", "## 읽는 법"];
  r.usage.forEach((u, i) => L.push(`${i + 1}. ${u}`));
  L.push("", "## 지시 틀", ...r.frame, "", "## 번역표(막연한 말 → 쪼개기 → 이름으로 시키는 말)");
  r.translate.forEach((x) => L.push(`- ${x.word}: ${x.split} → 예) ${x.example}`));
  L.push("", "## 규칙(등급: 측정·지시·기록·추정·미확인)");
  RULE_GROUPS.forEach((g) => {
    const list = rulesOf(r.rules, g.id);
    if (!list.length) return;
    L.push("", `### ${g.name}`);
    list.forEach((x) => L.push(`- ${x.id} [${x.grade}] ${x.t}: ${x.value} (근거: ${x.basis})`));
  });
  if (r.pending.length) {
    L.push("", "## 결정 대기(저장소마다 값이 다른 것)");
    r.pending.forEach((x) => L.push(`- ${x.t}: A) ${x.a} / B) ${x.b} → 지금: ${x.now}`));
  }
  L.push("", "## 금지", ...r.bans.map((b) => `- ${b}`), "", `각 규칙의 데모와 지시문: ${RULE_GROUPS.filter((g) => rulesOf(r.rules, g.id).length).map((g) => g.href).join(" , ")}`);
  return L.join("\n");
}
export const mediaUrl = (file: string) => `/lab/media/${file}`;

/** 요소 사전의 확인 안 한(○) 칩 수 = 점선 칩(todo) + 표시가 없는 칩(none). 원본 머리글의 '아직 확인하지 않은 것'과 같은 정의다. */
export const unconfirmed = (c: Elements["counts"]) => c.todo + c.none;

/** 이 새 페이지 주소는 분야 주소(/lab/<분야>)와 겹치면 안 된다. */
export const CATALOG_PATHS = ["/lab/elements", "/lab/prompts", "/lab/clips", "/lab/ideas", "/lab/rules"] as const;
