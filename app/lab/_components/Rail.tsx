"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import type { Field, Term } from "../_lib/types";
import LabSearch from "./LabSearch";

type Props = { fields: Field[]; terms: Term[] };

/** 목차가 스크롤된 위치. 용어를 눌러 다른 페이지로 가면 목차가 새로 그려지므로, 위치를 기억했다가 되살려 눌렀던 자리에 그대로 둔다. */
const SCROLL_KEY = "lab-rail-scroll";

/** 왼쪽 분야 목차. 공개된 용어가 있는 분야만 링크가 되고, 나머지는 '준비 중'으로만 보인다. */
export default function Rail({ fields, terms }: Props) {
  const path = usePathname();
  const tree = useRef<HTMLDetailsElement>(null);
  const aside = useRef<HTMLElement>(null);

  useEffect(() => {
    if (tree.current && window.matchMedia("(max-width: 960px)").matches) tree.current.open = false;
  }, []);

  // 처음 그릴 때(그리기 전에): 저장된 위치가 있으면 그 자리로, 없으면(주소로 바로 들어옴) 지금 보는 용어가 가운데 오게 한다.
  useLayoutEffect(() => {
    const el = aside.current;
    if (!el) return;
    let saved: string | null = null;
    try {
      saved = sessionStorage.getItem(SCROLL_KEY);
    } catch {
      saved = null;
    }
    if (saved !== null && Number.isFinite(Number(saved))) {
      el.scrollTop = Number(saved);
      return;
    }
    const a = el.querySelector<HTMLElement>('a[aria-current="page"]');
    if (a) el.scrollTop = Math.max(0, a.offsetTop - el.clientHeight / 2);
  }, []);

  const remember = (e: React.UIEvent<HTMLElement>) => {
    try {
      sessionStorage.setItem(SCROLL_KEY, String(e.currentTarget.scrollTop));
    } catch {
      /* 저장이 막힌 브라우저에서는 위치를 기억하지 못할 뿐, 목차는 그대로 쓸 수 있다 */
    }
  };

  const cur = (href: string) => (path === href ? ("page" as const) : undefined);
  return (
    <aside className="rail" aria-label="사전 목차" ref={aside} onScroll={remember}>
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
        {(["기초", "연출", "제작"] as const).map((g) => (
          <div key={g}>
            <h4>{g === "기초" ? "기초 요소" : g === "연출" ? "연출 분야" : "제작 참고"}</h4>
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
