"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { Field, Term } from "../_lib/types";
import LabSearch from "./LabSearch";

type Props = { fields: Field[]; terms: Term[] };

/** 왼쪽 분야 목차. 공개된 용어가 있는 분야만 링크가 되고, 나머지는 '준비 중'으로만 보인다. */
export default function Rail({ fields, terms }: Props) {
  const path = usePathname();
  const tree = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (tree.current && window.matchMedia("(max-width: 960px)").matches) tree.current.open = false;
  }, []);

  const cur = (href: string) => (path === href ? ("page" as const) : undefined);
  return (
    <aside className="rail" aria-label="사전 목차">
      <LabSearch placeholder="용어 찾기" />
      <nav className="rtabs" aria-label="사전 종류">
        <Link href="/lab/elements">요소 사전</Link>
        <Link href="/lab/prompts">지시 문장</Link>
        <Link href="/lab/clips">예시 영상</Link>
        <Link href="/lab/ideas">영상 소재</Link>
        <Link href="/lab/fonts">글꼴</Link>
      </nav>
      <details className="tree" open ref={tree}>
        <summary>분야 목차</summary>
        {(["기초", "연출"] as const).map((g) => (
          <div key={g}>
            <h4>{g === "기초" ? "기초 요소" : "연출 분야"}</h4>
            {fields.filter((f) => f.group === g).map((f) => {
              const list = terms.filter((t) => t.field === f.slug);
              if (list.length === 0) {
                return (
                  <span key={f.slug} className="off">
                    {f.name}
                    <em>준비 중</em>
                  </span>
                );
              }
              return (
                <div key={f.slug}>
                  <Link href={`/lab/${f.slug}`} aria-current={cur(`/lab/${f.slug}`)}>
                    {f.name}
                    <em>{list.length}</em>
                  </Link>
                  <div className="sub">
                    {list.map((t) => (
                      <Link key={t.slug} href={`/lab/${f.slug}/${t.slug}`} aria-current={cur(`/lab/${f.slug}/${t.slug}`)}>
                        {t.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </details>
    </aside>
  );
}
