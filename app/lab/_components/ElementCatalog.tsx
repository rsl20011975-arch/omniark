"use client";

import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import type { Cat, Chip } from "../_lib/catalog";
import { CheckIcon } from "./icons";

type Filter = "all" | "ok" | "todo";
const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "ok", label: "확인한 것" },
  { key: "todo", label: "아직 안 한 것" },
];

/** 칩 글 속의 '실습 74' · '실습 74·79' 를 그 실습 용어 페이지로 이어 준다. 나머지 글은 원본 그대로. */
function ChipText({ chip }: { chip: Chip }) {
  const parts = chip.t.split(/(실습 ?\d+(?:\s?·\s?\d+)*)/);
  return (
    <>
      {parts.map((p, i) => {
        const nums = i % 2 ? p.match(/\d+/g)?.map(Number) : null;
        if (!nums) return <Fragment key={i}>{p}</Fragment>;
        return (
          <span key={i} className="ech-ref">
            실습{" "}
            {nums.map((n, j) => {
              const l = chip.links.find((x) => x.n === n);
              return (
                <Fragment key={n}>
                  {j > 0 && "·"}
                  {l ? <Link href={l.href} title={`${l.name} 데모로 이동`}>{n}</Link> : n}
                </Fragment>
              );
            })}
          </span>
        );
      })}
    </>
  );
}

/** 요소 사전 본문: 검색(칩 글·연결된 실습 이름)과 확인 상태 걸러 보기. 처음 그릴 때는 전부 나오므로 검색엔진도 전부 읽는다. */
export default function ElementCatalog({ cats, clipTitles }: { cats: Cat[]; clipTitles: Record<string, string> }) {
  const [q, setQ] = useState("");
  const [f, setF] = useState<Filter>("all");
  const term = q.trim().toLowerCase();
  const active = term !== "" || f !== "all";

  const view = useMemo(
    () =>
      cats.map((c) => {
        const shown = c.chips.filter(
          (x) =>
            (f === "all" || (f === "ok" ? x.s === "ok" : x.s !== "ok")) &&
            (!term || (x.t + " " + x.links.map((l) => l.name).join(" ")).toLowerCase().includes(term)),
        );
        return { c, shown };
      }),
    [cats, f, term],
  );
  const total = view.reduce((n, v) => n + v.shown.length, 0);

  return (
    <>
      <div className="etools">
        <label className="ebox">
          <span className="sr">요소 검색</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="요소 이름 검색 (예: 스프링, 지도, 블러)" />
        </label>
        <div className="eseg" role="group" aria-label="확인 상태">
          {FILTERS.map((x) => (
            <button key={x.key} type="button" aria-pressed={f === x.key} onClick={() => setF(x.key)}>{x.label}</button>
          ))}
        </div>
      </div>
      {active && <p className="ecount" role="status">{total === 0 ? "검색 결과가 없습니다." : `${total}개 찾았습니다.`}</p>}
      {view.map(({ c, shown }) => {
        if (active && shown.length === 0) return null;
        const ok = c.chips.filter((x) => x.s === "ok").length;
        return (
          <section key={c.no} className="ecat" id={`cat-${c.no}`} aria-labelledby={`cat-h-${c.no}`}>
            <header>
              <span className="no">{c.no}</span>
              <h2 id={`cat-h-${c.no}`}>{c.name}</h2>
              {c.chips.length > 0 && <span className="ecnt">확인 {ok} / 전체 {c.chips.length}</span>}
            </header>
            {shown.length > 0 && (
              <ul className="echips">
                {shown.map((x, i) => (
                  <li key={i} className={x.s === "ok" ? "ech ok" : "ech"}>
                    {x.s === "ok" && <CheckIcon />}
                    <span className="ect">
                      <span className="sr">{x.s === "ok" ? "확인한 요소: " : "아직 확인하지 않은 요소: "}</span>
                      <ChipText chip={x} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {c.notes.length > 0 && !active && c.notes.map((n) => <p key={n} className="enote">{n}</p>)}
            {c.clips.length > 0 && !active && (
              <p className="eclips">
                예시 영상{" "}
                {c.clips.map((l) => (
                  <Link key={l.id} href={`/lab/clips#${l.id}`}>{clipTitles[l.id] ?? l.label}</Link>
                ))}
              </p>
            )}
          </section>
        );
      })}
    </>
  );
}
