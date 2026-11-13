import { Fragment } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import LabSearch from "./_components/LabSearch";
import Pv from "./_components/Pv";
import { ArrowIcon } from "./_components/icons";
import { clips, elements, prompts, unconfirmed } from "./_lib/catalog";
import { allFields, episodes, hangulInitial, lookupRows, publishedTerms, termPath, termsOfField, fieldName } from "./_lib/data";

export const metadata: Metadata = {
  title: { absolute: "Visual Lab · 시각 용어 사전 | OMNIARK" },
  alternates: { canonical: "/lab" },
};

export default function LabHubPage() {
  const fields = allFields();
  const terms = publishedTerms();
  const rows = lookupRows();
  const groups = new Map<string, typeof terms>();
  for (const t of [...terms].sort((a, b) => a.name.localeCompare(b.name, "ko"))) {
    const k = hangulInitial(t.name);
    groups.set(k, [...(groups.get(k) ?? []), t]);
  }
  const el = elements().counts;
  const initials = Array.from(groups.keys()).sort((a, b) => (a === "A–Z" ? 1 : b === "A–Z" ? -1 : a.localeCompare(b, "ko")));

  return (
    <div className="hubw">
      <section className="hero2">
        <div className="g">
          <div>
            <span className="kicker">Visual Lab <b>시각 용어 사전</b></span>
            <h1>AI에게 “예쁘게”라고 말하지 마세요. <em>이름으로 시키세요.</em></h1>
            <p className="lead">화면·영상·문서에 들어가는 시각 용어를 데모로 직접 보고, 그대로 붙여 넣을 지시문까지 한 번에 가져가세요.</p>
            <div style={{ marginTop: 32, maxWidth: 560 }}>
              <LabSearch placeholder="이름을 몰라도 돼요 — 보이는 대로 적어 보세요" />
            </div>
          </div>
          <figure className="pair">
            <div>
              <Pv kind="fade" />
              <figcaption><b>“멋지게 나오게 해줘”</b>AI가 고르는 가장 흔한 답: 그냥 나타남</figcaption>
            </div>
            <div>
              <Pv kind="mask" />
              <figcaption><b>“마스크 리빌”</b>이름으로 시키면 막대가 지나간 자리만 드러남</figcaption>
            </div>
          </figure>
        </div>
      </section>

      {rows.length > 0 && (
        <section className="sec">
          <h2>이런 화면이라면, 이 이름</h2>
          <p className="sub">이름을 모르는 사람이 가장 많이 막히는 곳입니다. 본 것을 말로 적으면 이름으로 이어 드립니다.</p>
          <div className="lookup">
            <div className="h"><span>이렇게 보이면</span><span /><span>이 이름으로 시키세요</span></div>
            {rows.map((r) => (
              <Link key={r.term.slug} href={termPath(r.term)}>
                <span>{r.feel}</span>
                <span className="ar">→</span>
                <b>{r.term.name}</b>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="sec">
        <div className="sec-h">
          <div><span className="kicker ko">더 깊이</span><h2>용어 말고도 이렇게 찾아보세요</h2></div>
          <p>용어 사전에 들어가기 전에, 시킬 수 있는 요소 전체를 훑거나 바로 붙여 넣을 문장·영상부터 가져갈 수 있습니다.</p>
        </div>
        <div className="fgrid three">
          <Link href="/lab/elements" className="fcard">
            <h3>요소 사전</h3>
            <p className="d">AI에게 이름으로 시킬 수 있는 연출 요소 {el.chips}개를 {el.cats}개 분류로 나눴습니다. 직접 확인한 것 {el.ok}개, 아직 확인하지 않은 것 {unconfirmed(el)}개를 구분해 적었습니다.</p>
            <div className="ct"><span>요소 {el.chips}개 보기</span><ArrowIcon /></div>
          </Link>
          <Link href="/lab/prompts" className="fcard">
            <h3>지시 문장</h3>
            <p className="d">길이·장면·등장 순서·강조·카메라·리듬·금지·검수까지, 그대로 복사해 붙여 넣는 문장 {prompts().items.length}개입니다.</p>
            <div className="ct"><span>문장 {prompts().items.length}개 보기</span><ArrowIcon /></div>
          </Link>
          <Link href="/lab/clips" className="fcard">
            <h3>예시 영상</h3>
            <p className="d">실제로 만든 롱폼에서 요소 하나씩 잘라 낸 4~9초 영상 {clips().items.length}개와 58초 완성 영상입니다.</p>
            <div className="ct"><span>영상 {clips().items.length}개 보기</span><ArrowIcon /></div>
          </Link>
        </div>
      </section>

      <section className="sec">
        <div className="sec-h">
          <div><span className="kicker ko">처음 오셨다면</span><h2>입문 코스</h2></div>
          <p>순서대로 보지 않아도 됩니다. 각 편은 혼자서 이해되고, 글·영상·쇼츠로 같이 나옵니다.</p>
        </div>
        <div className="course">
          {episodes().map((e) => (
            <Link key={e.no} href={`/blog/${e.slug}`}>
              <span className="no">{e.no}</span>
              <h3>{e.title}</h3>
              <span className="meta"><span className="chip">{e.frame}</span><span className="chip line">블로그 · 영상 · 쇼츠</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="sec-h">
          <div><span className="kicker ko">분야 지도</span><h2>어디서부터 찾아볼까요</h2></div>
          <p>데모와 지시문을 직접 시험한 용어만 공개합니다. 시험이 끝나지 않은 분야는 열지 않습니다.</p>
        </div>
        {(["기초", "연출", "제작"] as const).map((g) => (
          <Fragment key={g}>
            <div className="glabel">{g} <small>{g === "기초" ? "모든 결과물에 들어가는 시각 요소" : g === "연출" ? "한 단계 위의 표현 기법" : "만들고 내보낼 때 알아야 할 규격·도구·검수"}</small></div>
            <div className="fgrid">
              {fields.filter((f) => f.group === g).map((f) => {
                const list = termsOfField(f.slug);
                if (list.length === 0) {
                  return (
                    <div key={f.slug} className="fcard soon">
                      <h3>{f.name}</h3>
                      <p className="d">{f.desc}</p>
                      <div className="ct"><span>준비 중 — 시험을 마친 용어부터 공개</span></div>
                    </div>
                  );
                }
                return (
                  <Link key={f.slug} href={`/lab/${f.slug}`} className="fcard">
                    <h3>{f.name}</h3>
                    <p className="d">{f.desc}</p>
                    <div className="tp">{list.slice(0, 3).map((t) => <span key={t.slug} className="chip line">{t.name}</span>)}</div>
                    <div className="ct"><span>용어 {list.length}개</span><ArrowIcon /></div>
                  </Link>
                );
              })}
            </div>
          </Fragment>
        ))}
      </section>

      {terms.length > 0 && (
        <section className="sec">
          <div className="sec-h">
            <div><span className="kicker ko">색인</span><h2>가나다 색인</h2></div>
            <p>지금 열려 있는 용어 전체입니다. 데모와 지시문을 시험한 것만 올립니다.</p>
          </div>
          <div className="idx">
            {initials.map((k) => (
              <div key={k}>
                <h3>{k}</h3>
                <ul>
                  {groups.get(k)!.map((t) => (
                    <li key={t.slug}><Link href={termPath(t)}><b>{t.name}</b><span>{fieldName(t.field)}</span></Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
