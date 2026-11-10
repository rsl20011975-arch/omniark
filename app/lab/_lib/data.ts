import fs from "node:fs";
import path from "node:path";
import type { Episode, Field, LookupRow, SearchEntry, Term } from "./types";

const DIR = path.join(process.cwd(), "app/lab/_content");

type Store = { fields: Field[]; terms: Term[]; episodes: Episode[]; lookup: LookupRow[] };
let store: Store | null = null;

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(DIR, file), "utf8")) as T;
}

/** 빌드 한 번에 한 번만 읽는다(호출마다 폴더 전체를 다시 읽지 않는다). */
function load(): Store {
  if (store) return store;
  const termFiles = fs.readdirSync(path.join(DIR, "terms")).filter((f) => f.endsWith(".json"));
  store = {
    fields: readJson<Field[]>("fields.json"),
    episodes: readJson<Episode[]>("episodes.json"),
    lookup: readJson<LookupRow[]>("lookup.json"),
    terms: termFiles.map((f) => readJson<Term>(`terms/${f}`)),
  };
  return store;
}

/** 데모와 지시문을 시험해 공개한 용어만 사이트에 나온다. */
export const publishedTerms = (): Term[] => load().terms.filter((t) => t.status === "published");
export const allFields = (): Field[] => load().fields;
export const episodes = (): Episode[] => load().episodes;
export const termsOfField = (field: string) => publishedTerms().filter((t) => t.field === field);
export const getField = (slug: string) => load().fields.find((f) => f.slug === slug);
export const getTerm = (field: string, slug: string) =>
  publishedTerms().find((t) => t.field === field && t.slug === slug);
export const openFields = () => allFields().filter((f) => termsOfField(f.slug).length > 0);
export const fieldName = (slug: string) => getField(slug)?.name ?? slug;
export const termPath = (t: Term) => `/lab/${t.field}/${t.slug}`;

export function lookupRows() {
  const pub = new Map(publishedTerms().map((t) => [t.slug, t]));
  return load()
    .lookup.map((r) => ({ feel: r.feel, term: pub.get(r.term) }))
    .filter((r): r is { feel: string; term: Term } => Boolean(r.term));
}

export function searchIndex(): SearchEntry[] {
  return publishedTerms().map((t) => ({
    n: t.name,
    en: t.en,
    f: fieldName(t.field),
    l: t.level,
    u: termPath(t),
    k: t.keywords,
    d: t.oneLine,
  }));
}

/** 가나다 색인용: 첫 글자 묶음 */
export function hangulInitial(s: string): string {
  const base = "ㄱㄱㄴㄷㄷㄹㅁㅂㅂㅅㅅㅇㅈㅈㅊㅋㅌㅍㅎ";
  const c = s.charCodeAt(0);
  if (c >= 0xac00 && c <= 0xd7a3) return base[Math.floor((c - 0xac00) / 588)];
  return "A–Z";
}
