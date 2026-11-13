"use client";

import { useState } from "react";
import type { Prompt } from "../_lib/catalog";
import CopyButton from "./CopyButton";
import { CheckIcon } from "./icons";

type Filter = "all" | "ok" | "todo";
const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "ok", label: "실제로 쓴 문장" },
  { key: "todo", label: "아직 안 써 본 문장" },
];

/** 지시 문장 카드 목록. 한 장 = 항목 하나(길이, 장면, 등장 순서…) + 그대로 붙여 넣을 문장 + 복사 버튼. */
export default function PromptList({ items }: { items: Prompt[] }) {
  const [f, setF] = useState<Filter>("all");
  // 같은 이름의 문장이 있어서(예: 카메라 2개) 이름이 아니라 원래 순번을 키로 쓴다.
  const shown = items.map((p, i) => ({ p, i })).filter(({ p }) => f === "all" || p.status === f);
  return (
    <>
      <div className="etools">
        <div className="eseg" role="group" aria-label="사용 여부">
          {FILTERS.map((x) => (
            <button key={x.key} type="button" aria-pressed={f === x.key} onClick={() => setF(x.key)}>
              {x.label}
            </button>
          ))}
        </div>
        <span className="ecount inline" role="status">{shown.length}개</span>
      </div>
      <ul className="pgrid">
        {shown.map(({ p, i }) => (
          <li key={i} className={p.status === "ok" ? "pcard ok" : "pcard"}>
            <div className="ph">
              <span className={p.status === "ok" ? "badge ok" : "badge none"}>
                {p.status === "ok" ? <><CheckIcon /> 실제로 씀</> : "아직 안 써 봄"}
              </span>
              <b>{p.name}</b>
              <CopyButton text={p.text} />
            </div>
            <p>{p.text}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
