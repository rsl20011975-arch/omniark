import Link from "next/link";
import type { Metadata } from "next";
import LabTabs from "../_components/LabTabs";
import CodeBlock from "../_components/CodeBlock";
import { ArrowIcon } from "../_components/icons";
import { rules, rulesText, RULE_GROUPS, rulesOf } from "../_lib/catalog";

export const metadata: Metadata = {
  title: "AI에게 읽히는 연출 규칙 — 막연한 말을 이름과 숫자로",
  description:
    "예쁘게·멋있게·잘·제대로 같은 막연한 말을 이름과 숫자로 바꾸는 번역표와, 영상 연출·쇼츠·롱폼 제작 포맷과 앱·웹 화면 제작 규칙 56개(증거 등급 표시). 새 AI 세션에 붙여 넣으면 처음부터 다시 정하지 않아도 됩니다.",
  alternates: { canonical: "/lab/rules" },
};

const GRADE_NOTE: Record<string, string> = {
  측정: "제작자가 직접 잰 값(조건·표본 확인)",
  지시: "제작자가 직접 한 지시",
  기록: "제작 기록의 값(효과는 증명되지 않음)",
  추정: "근거 없이 정해 둔 값",
  미확인: "효과가 확인되지 않음",
};

export default function RulesPage() {
  const r = rules();
  return (
    <div className="hubw cat-page">
      <nav className="crumb" aria-label="경로">
        <Link href="/lab">Visual Lab</Link><i>›</i><span>연출 규칙</span>
      </nav>
      <LabTabs current="/lab/rules" />
      <header className="cat-h">
        <span className="kicker ko">연출 규칙 · {r.rules.length}개 · {r.updated} 기준</span>
        <h1>{r.title}</h1>
        <p className="lead">{r.intro}</p>
      </header>

      <section className="blk" id="paste">
        <h2><i>01</i>새 AI 세션에 붙여 넣기</h2>
        <p className="sub">아래 글 전체가 규칙입니다. 새 대화를 열면 이 글을 먼저 붙여 넣거나, 이 주소(<Link href="/lab/rules/raw">/lab/rules/raw</Link>)를 읽게 하세요.</p>
        <CodeBlock text={rulesText()} />
      </section>

      <section className="blk" id="translate">
        <h2><i>02</i>번역표 — 막연한 말을 이름과 숫자로</h2>
        <div className="rtable" role="table" aria-label="번역표">
          {r.translate.map((x) => (
            <div className="rrow" role="row" key={x.word}>
              <b role="cell">{x.word}</b>
              <span role="cell">{x.split}</span>
              <q role="cell">{x.example}</q>
              <span role="cell" className="rlinks">
                {x.links.map((l) => (
                  <Link key={l.href} href={l.href}>{l.name} <ArrowIcon /></Link>
                ))}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="blk" id="rules">
        <h2><i>03</i>영상 연출 규칙</h2>
        <p className="sub">규칙마다 증거 등급이 붙어 있습니다: {Object.entries(GRADE_NOTE).map(([k, v]) => `${k}(${v})`).join(" · ")}.</p>
        {RULE_GROUPS.map((g) => {
          const list = rulesOf(r.rules, g.id);
          if (!list.length) return null;
          return (
            <div key={g.id} id={`rules-${g.id}`}>
              <h3 className="rgh">{g.name} · {list.length}개</h3>
              <ul className="rulelist">
                {list.map((x) => (
                  <li key={x.id}>
                    <div className="rh"><span className="rid">{x.id}</span><span className={`rg g-${x.grade}`}>{x.grade}</span><h3>{x.t}</h3></div>
                    <p className="rv">{x.value}</p>
                    <p className="rb">{x.basis}</p>
                    <div className="rlinks">
                      {x.links.map((l) => (
                        <Link key={l.href} href={l.href}>{l.name} <ArrowIcon /></Link>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      {r.pending.length > 0 && (
      <section className="blk" id="pending">
        <h2><i>04</i>결정 대기 — 저장소마다 값이 달랐던 것</h2>
        <div className="rtable" role="table" aria-label="결정 대기">
          {r.pending.map((x) => (
            <div className="rrow rpend" role="row" key={x.t}>
              <b role="cell">{x.t}</b>
              <span role="cell">A) {x.a}</span>
              <span role="cell">B) {x.b}</span>
              <span role="cell" className="rnow">지금: {x.now}</span>
            </div>
          ))}
        </div>
      </section>
      )}

      <section className="blk" id="bans">
        <h2><i>{r.pending.length > 0 ? "05" : "04"}</i>금지</h2>
        <ul className="uselist">{r.bans.map((b) => <li key={b}>{b}</li>)}</ul>
      </section>

      <p className="cfoot">이 규칙은 제작 기록에서 모았고, 효과가 확인되지 않은 값은 그렇게 표시했습니다. 시청 성과는 예측하지 않습니다.</p>
    </div>
  );
}
