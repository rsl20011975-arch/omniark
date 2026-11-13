import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CodeBlock from "../../_components/CodeBlock";
import { DemoWorkbench } from "../../_components/DemoWorkbench";
import DemoSlot from "../../_components/DemoSlot";
import TipsPanel from "../../_components/TipsPanel";
import StepsPanel from "../../_components/StepsPanel";
import Rail from "../../_components/Rail";
import { CheckIcon } from "../../_components/icons";
import { LAB_INDEXABLE } from "../../_lib/config";
import { allFields, fieldName, getField, getTerm, publishedTerms, termPath, termsOfField } from "../../_lib/data";
import { absoluteUrl } from "../../../seo/site";

interface Props {
  params: Promise<{ field: string; term: string }>;
}

/** 공개된 용어만 길이 열린다(준비 중인 용어 주소는 404, sitemap 에도 없다). */
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedTerms().map((t) => ({ field: t.field, term: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { field, term } = await params;
  const t = getTerm(field, term);
  if (!t) return { title: "페이지를 찾을 수 없습니다", robots: { index: false } };
  return {
    title: `${t.name} (${t.en})`,
    description: `${t.oneLine}. 연출 전·후를 직접 돌려 보고, 그대로 붙여 넣을 지시문을 가져가세요.`,
    alternates: { canonical: termPath(t) },
    robots: LAB_INDEXABLE ? undefined : { index: false, follow: false },
    openGraph: { type: "article", title: `${t.name} (${t.en})`, description: t.oneLine, locale: "ko_KR" },
  };
}

export default async function TermPage({ params }: Props) {
  const { field, term } = await params;
  const t = getTerm(field, term);
  const f = getField(field);
  if (!t || !f || !t.detail) notFound();
  const d = t.detail;
  const hasSteps = d.steps.length > 0;
  const hasTerms = d.terms.length > 0;
  let no = 2;
  const n = () => String(++no).padStart(2, "0");
  const nTips = d.tips.length > 0 ? n() : "";
  const nSteps = hasSteps ? n() : "";
  const nTerms = hasTerms ? n() : "";
  const nCheck = n(), nUse = n(), nRel = n(), nSrc = n();

  const siblings = termsOfField(field);
  const at = siblings.findIndex((x) => x.slug === t.slug);
  const prev = at > 0 ? siblings[at - 1] : null;
  const next = at < siblings.length - 1 ? siblings[at + 1] : null;

  const crumbs = [
    { name: "Visual Lab", url: absoluteUrl("/lab") },
    { name: f.name, url: absoluteUrl(`/lab/${f.slug}`) },
    { name: t.name, url: absoluteUrl(termPath(t)) },
  ];
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url })),
  };

  return (
    <div className="shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Rail fields={allFields()} terms={publishedTerms()} />
      <div className="pg">
        <div className="doc">
          <div className="doc-main">
            <nav className="crumb" aria-label="경로">
              <Link href="/lab">Visual Lab</Link><i>›</i><Link href={`/lab/${f.slug}`}>{f.name}</Link><i>›</i><span>{t.name}</span>
            </nav>
            <span className="kicker ko">용어 · {f.name}</span>
            <h1>{t.name}</h1>
            <p className="en-t">{t.en}</p>
            <p className="lead">{t.oneLine}.</p>
            <div className="chips">
              <span className="chip">{t.level}</span>
              {t.purposes.map((p) => <span key={p} className="chip line">{p}</span>)}
            </div>

            <nav className="toc" aria-label="이 페이지">
              <b>이 페이지</b>
              <a href="#demo">데모</a><a href="#prompt">지시문</a>{d.tips.length > 0 && <a href="#tips">응용 팁</a>}{hasSteps && <a href="#steps">만드는 순서</a>}{hasTerms && <a href="#words">용어 풀이</a>}<a href="#check">확인 목록</a><a href="#use">쓰는 곳</a><a href="#rel">같이 쓰는 용어</a><a href="#src">근거</a>
            </nav>

            <DemoWorkbench>
            <section className="blk" id="demo">
              <h2><i>01</i>직접 돌려 보기</h2>
              <p className="sub">‘연출 전’은 대충 시켰을 때를 가정해 만든 화면이고 실제 AI 결과와 다를 수 있습니다.</p>
              <DemoSlot demo={d.demo} label={t.name} tipTitle={Object.fromEntries(d.tips.map((x) => [x.id, x.title]))} />
            </section>

            <section className="blk" id="prompt">
              <h2><i>02</i>이름으로 시키는 지시문</h2>
              {d.vs && (
                <div className="vs">
                  <div className="bad"><b>대충 시킴</b><q>{d.vs.bad}</q>→ {d.vs.badResult}</div>
                  <div className="good"><b>이름으로 시킴</b><q>{d.vs.good}</q>→ {d.vs.goodResult}</div>
                </div>
              )}
              <CodeBlock text={d.prompt} />
              <p className="note">구현에 쓰이는 기술: {d.tech.map((x) => <span key={x} className="chip line">{x}</span>)}</p>
            </section>

            {d.tips.length > 0 && (
            <section className="blk" id="tips">
              <h2><i>{nTips}</i>응용 팁</h2>
              <p className="sub">팁은 데모에서 값만 바꿔 같은 장면과 비교한 것입니다. AI가 같은 결과를 내는지는 직접 해 보셔야 합니다.</p>
              <TipsPanel tips={d.tips} />
            </section>
            )}

            {hasSteps && (
              <section className="blk" id="steps">
                <h2><i>{nSteps}</i>만드는 순서</h2>
                <p className="sub">{d.levels > 0 ? "각 단계의 버튼을 누르면 위의 데모가 그 단계까지의 모습으로 바뀝니다." : "처음 만들 때 이 순서로 하면 덜 헤맵니다."}</p>
                <StepsPanel steps={d.steps} levels={d.levels} />
              </section>
            )}
            </DemoWorkbench>

            {hasTerms && (
              <section className="blk" id="words">
                <h2><i>{nTerms}</i>전문용어 풀이</h2>
                <div className="term-grid">
                  {d.terms.map((w) => (
                    <div className="term" key={w.w}>
                      <div className="term-h"><b>{w.w}</b><span>{w.en}</span></div>
                      <p>{w.m}</p>
                      <div className="say"><i>AI에게</i>{w.say}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="blk" id="check">
              <h2><i>{nCheck}</i>결과를 받으면 이것부터 확인</h2>
              <ul className="cklist">{d.check.map((c) => <li key={c}><CheckIcon /><span>{c}</span></li>)}</ul>
            </section>

            <section className="blk" id="use">
              <h2><i>{nUse}</i>이럴 때 쓰세요</h2>
              <ul className="uselist">{d.use.map((u) => <li key={u}>{u}</li>)}</ul>
            </section>

            <section className="blk" id="rel">
              <h2><i>{nRel}</i>같이 쓰는 용어</h2>
              {d.episode && (
                <p className="sub">이 용어가 나온 편: <Link href={`/blog/${d.episode.slug}`} style={{ color: "var(--accent)", textDecoration: "underline" }}>{d.episode.no} {d.episode.title}</Link></p>
              )}
              <div className="rel">
                {d.related.map((r) => {
                  const hit = publishedTerms().find((x) => x.name === r.name);
                  const body = (<><b>{r.name}</b><span>{r.note}</span></>);
                  return hit ? <Link key={r.name} href={termPath(hit)}>{body}</Link> : <div key={r.name} className="soon-rel">{body}</div>;
                })}
              </div>
            </section>

            <section className="blk" id="src">
              <h2><i>{nSrc}</i>근거와 확인 범위</h2>
              <p className="sub">‘확인’은 출처 문서에서 사실로 확인한 내용, ‘추정’은 결과물을 보고 추론한 내용, ‘원본 없음’은 흔히 쓰이지만 대표 원본 사례를 확인하지 못해 성공 사례로 제시하지 않은 기법입니다.</p>
              <ul className="refs">
                {d.refs.map((r) => (
                  <li key={r.text}>
                    <span className={`badge ${r.state === "확인" ? "ok" : r.state === "추정" ? "guess" : "none"}`}>{r.state}</span>
                    <span>
                      {r.text}
                      {r.url && r.title && <> <a className="ext" href={r.url} rel="noopener noreferrer" target="_blank">{r.title}</a></>}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {(prev || next) && (
              <nav className="pn" aria-label="이전 다음 용어">
                {prev ? <Link href={termPath(prev)}><span>← 이전 용어</span><b>{prev.name}</b></Link> : <span />}
                {next ? <Link className="n" href={termPath(next)}><span>다음 용어 →</span><b>{next.name}</b></Link> : <span />}
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { fieldName };
