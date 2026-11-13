"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { SearchEntry } from "../_lib/types";
import { SearchIcon } from "./icons";

const norm = (s: string) => s.toLowerCase().replace(/[“”"'.,!?·()]/g, " ").trim();

/**
 * 이름이 아니라 '본 느낌'으로 적어도 찾는다. 한국어 조사·어미가 붙어도 되도록
 * 글자 단위 포함 검사(token.includes / keyword.includes)로 맞춘다. 색인은 공개된 용어만 담는다.
 */
function score(e: SearchEntry, q: string, toks: string[]): number {
  const name = e.n.toLowerCase();
  const en = e.en.toLowerCase();
  const desc = e.d.toLowerCase();
  let h = 0;
  if (name.includes(q) || q.includes(name)) h += 6;
  if (en.includes(q)) h += 4;
  for (const t of toks) {
    if (name.includes(t) || t.includes(name)) h += 3;
    if (en.includes(t)) h += 2;
    if (e.k.some((k) => t.includes(k) || (t.length >= 2 && k.includes(t)))) h += 2;
    if (desc.includes(t)) h += 1;
  }
  return h;
}

export default function LabSearch({ placeholder }: { placeholder: string }) {
  const [q, setQ] = useState("");
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [failed, setFailed] = useState(false);

  function load() {
    if (index || failed) return;
    fetch("/lab/search-index.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: SearchEntry[]) => setIndex(d))
      .catch(() => setFailed(true));
  }

  const hits = useMemo(() => {
    const nq = norm(q);
    if (!nq || !index) return [];
    const toks = nq.split(/\s+/).filter((t) => t.length >= 2);
    return index
      .map((e) => ({ e, h: score(e, nq, toks) }))
      .filter((x) => x.h > 0)
      .sort((a, b) => b.h - a.h)
      .slice(0, 4);
  }, [q, index]);

  const open = norm(q).length > 0;
  return (
    <div className="search">
      <label className="sbox">
        <SearchIcon />
        <span className="sr">용어 찾기</span>
        <input
          type="search"
          value={q}
          placeholder={placeholder}
          autoComplete="off"
          onFocus={load}
          onChange={(ev) => {
            setQ(ev.target.value);
            load();
          }}
        />
      </label>
      {open && (
        <div className="sres">
          <small>이렇게 찾아져요 (지금 열려 있는 용어 안에서)</small>
          {failed && <p>검색 목록을 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요.</p>}
          {!failed && !index && <p>찾는 중…</p>}
          {!failed && index && hits.length === 0 && (
            <p>맞는 용어를 아직 못 찾았어요. 다른 말로 적어 보시거나, 아직 열리지 않은 용어일 수 있어요.</p>
          )}
          {hits.map(({ e }) => (
            <Link key={e.u} href={e.u}>
              <b>{e.n}</b>
              <span>{e.f} · {e.l}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
