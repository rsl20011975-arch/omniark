"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Term } from "../_lib/types";
import Thumb from "./Thumb";

type Key = "level" | "purposes" | "media";
const LABEL: Record<Key, string> = { level: "난이도", purposes: "목적", media: "매체" };
const LEVEL_ORDER = ["기본", "중급", "고급"];

function uniq(list: string[]) {
  return Array.from(new Set(list));
}

/** 분야 안의 용어 목록: 난이도·목적·매체로 거르고 카드/목록으로 본다. 값이 실제로 있는 선택지만 보여 준다. */
export default function TermBrowser({ terms }: { terms: Term[] }) {
  const [sel, setSel] = useState<Record<Key, string>>({ level: "all", purposes: "all", media: "all" });
  const [view, setView] = useState<"cards" | "list">("cards");

  const options = useMemo(
    () => ({
      level: uniq(terms.map((t) => t.level)).sort((a, b) => LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(b)),
      purposes: uniq(terms.flatMap((t) => t.purposes)),
      media: uniq(terms.flatMap((t) => t.media)),
    }),
    [terms],
  );

  const shown = terms.filter(
    (t) =>
      (sel.level === "all" || t.level === sel.level) &&
      (sel.purposes === "all" || t.purposes.includes(sel.purposes)) &&
      (sel.media === "all" || t.media.includes(sel.media)),
  );
  const reset = () => setSel({ level: "all", purposes: "all", media: "all" });

  return (
    <>
      <div className="fbox">
        <div className="filters" role="group" aria-label="용어 거르기">
          {(Object.keys(LABEL) as Key[]).map((k) => (
            <div className="fgroup" key={k}>
              <span className="flabel">{LABEL[k]}</span>
              <div className="fchips">
                {["all", ...options[k]].map((v) => (
                  <button
                    key={v}
                    type="button"
                    className="fchip"
                    aria-pressed={sel[k] === v}
                    onClick={() => setSel((s) => ({ ...s, [k]: v }))}
                  >
                    {v === "all" ? "전체" : v}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bar">
        <p className="cnt">{shown.length}개 / 전체 {terms.length}개</p>
        <div className="seg" role="group" aria-label="보기 방식">
          <button type="button" aria-pressed={view === "cards"} onClick={() => setView("cards")}>카드</button>
          <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")}>목록</button>
        </div>
      </div>
      <div className="items" data-view={view}>
        {shown.map((t) => (
          <Link key={t.slug} className="item" href={`/lab/${t.field}/${t.slug}`}>
            <Thumb term={t} />
            <div className="bd">
              <h3>{t.name}</h3>
              <p className="en">{t.en}</p>
              <p className="one">{t.oneLine}</p>
            </div>
            <div className="tags">
              <span className="chip">{t.level}</span>
              {t.purposes.slice(0, 2).map((p) => (
                <span key={p} className="chip line">{p}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
      {shown.length === 0 && (
        <div className="empty">
          <p className="empty-t">조건에 맞는 용어가 아직 없어요</p>
          <p className="empty-d">용어는 데모와 지시문을 직접 시험한 것만 공개한다. 조건을 바꿔 보면 된다.</p>
          <button type="button" className="btn ghost" onClick={reset}>필터 모두 지우기</button>
        </div>
      )}
    </>
  );
}
