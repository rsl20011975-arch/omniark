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
  counts: { chips: number; ok: number; todo: number; none: number; cats: number; clips: number; prompts: number };
};
export type Prompt = { status: "ok" | "todo"; name: string; text: string };
export type Prompts = { sub: string; items: Prompt[] };
export type Clip = { id: string; title: string; what: string; cmd: string; src: string; video: string; poster: string };
export type Clips = {
  sub: string;
  items: Clip[];
  full: { sub: string; text: string; caveat: string; video: string; poster: string };
};

let cache: { el: Elements; pr: Prompts; cl: Clips } | null = null;
const load = () => (cache ??= { el: read<Elements>("elements.json"), pr: read<Prompts>("prompts.json"), cl: read<Clips>("clips.json") });

export const elements = (): Elements => load().el;
export const prompts = (): Prompts => load().pr;
export const clips = (): Clips => load().cl;
export const mediaUrl = (file: string) => `/lab/media/${file}`;

/** 요소 사전의 확인 안 한(○) 칩 수 = 점선 칩(todo) + 표시가 없는 칩(none). 원본 머리글의 '아직 확인하지 않은 것'과 같은 정의다. */
export const unconfirmed = (c: Elements["counts"]) => c.todo + c.none;

/** 이 새 페이지 주소는 분야 주소(/lab/<분야>)와 겹치면 안 된다. */
export const CATALOG_PATHS = ["/lab/elements", "/lab/prompts", "/lab/clips"] as const;
