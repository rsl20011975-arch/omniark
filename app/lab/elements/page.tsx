import Link from "next/link";
import type { Metadata } from "next";
import ElementCatalog from "../_components/ElementCatalog";
import LabTabs from "../_components/LabTabs";
import { clips, elements, unconfirmed } from "../_lib/catalog";

export const metadata: Metadata = {
  title: "요소 사전 — AI에게 시킬 수 있는 연출 요소 448개",
  description:
    "시간·이징·전환·카메라·타이포·데이터·3D·소리까지, AI에게 이름으로 시킬 수 있는 연출 요소 448개. 직접 확인한 것과 아직 확인하지 않은 것을 나눠 적었습니다.",
  alternates: { canonical: "/lab/elements" },
};

export default function ElementsPage() {
  const { cats, limits, counts } = elements();
  const clipTitles = Object.fromEntries(clips().items.map((c) => [c.id, c.title]));
  return (
    <div className="hubw cat-page">
      <nav className="crumb" aria-label="경로">
        <Link href="/lab">Visual Lab</Link><i>›</i><span>요소 사전</span>
      </nav>
      <LabTabs current="/lab/elements" />
      <header className="cat-h">
        <span className="kicker ko">요소 사전 · {counts.cats}개 분류</span>
        <h1>AI에게 이름으로 시킬 수 있는 연출 요소 {counts.chips}개</h1>
        <p className="lead">
          칩 하나가 요소 하나입니다. 초록 칩은 데모로 직접 확인한 것({counts.ok}개), 점선 칩은 아직 확인하지 않은 것({unconfirmed(counts)}개)입니다.
          칩 안의 ‘실습 번호’를 누르면 그 요소를 돌려 볼 수 있는 용어 페이지로 이어집니다.
        </p>
        <dl className="cstats">
          <div><dt>전체 요소</dt><dd>{counts.chips}</dd></div>
          <div><dt>확인한 것</dt><dd className="ok">{counts.ok}</dd></div>
          <div><dt>아직 안 한 것</dt><dd>{unconfirmed(counts)}</dd></div>
        </dl>
      </header>

      <nav className="cjump" aria-label="분류로 바로가기">
        <h2>분류로 바로가기</h2>
        <ul>
          {cats.map((c) => (
            <li key={c.no}>
              <a href={`#cat-${c.no}`}><span className="no">{c.no}</span>{c.name}<em>{c.chips.length || "—"}</em></a>
            </li>
          ))}
        </ul>
      </nav>

      <ElementCatalog cats={cats} clipTitles={clipTitles} />

      <section className="climits" aria-labelledby="limits-h">
        <h2 id="limits-h">한계</h2>
        <p>{limits.sub}</p>
        <ul>{limits.items.map((x) => <li key={x}>{x}</li>)}</ul>
      </section>
    </div>
  );
}
