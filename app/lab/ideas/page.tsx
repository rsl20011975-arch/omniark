import Link from "next/link";
import type { Metadata } from "next";
import LabTabs from "../_components/LabTabs";
import { ArrowIcon } from "../_components/icons";
import { ideas } from "../_lib/catalog";

export const metadata: Metadata = {
  title: "이 기술로 만들 수 있는 영상 소재 8개 — 쇼츠·롱폼 아이디어",
  description:
    "자막 연출, 뉴스형 그래프, 강의 안내 연출, 사진 한 장 다큐 오프닝, 제품 광고 컷, 색과 감정, 앱 화면 전환, SF HUD — Visual Lab 실습으로 바로 만들 수 있는 영상 소재 8개와 배울 실습 링크.",
  alternates: { canonical: "/lab/ideas" },
};

export default function IdeasPage() {
  const { sub, items } = ideas();
  return (
    <div className="hubw cat-page">
      <nav className="crumb" aria-label="경로">
        <Link href="/lab">Visual Lab</Link><i>›</i><span>영상 소재</span>
      </nav>
      <LabTabs current="/lab/ideas" />
      <header className="cat-h">
        <span className="kicker ko">영상 소재 · {items.length}개</span>
        <h1>이 기술로 만들 수 있는 영상 소재 {items.length}개</h1>
        <p className="lead">
          {sub} 소재마다 아래 실습을 먼저 돌려 보면, 영상에 들어갈 장면을 그대로 만들 수 있습니다. 길이와 형식은 제안이니 내 채널에 맞게 바꿔 쓰세요.
        </p>
      </header>
      <ul className="ideagrid">
        {items.map((it) => (
          <li key={it.t} className="ideacard">
            <div className="ihead"><span className="ifmt">{it.f}</span></div>
            <h2>{it.t}</h2>
            <p>{it.g}</p>
            <div className="ilinks" aria-label="배울 실습">
              {it.links.map((l) => (
                <Link key={l.n} href={l.href}>
                  {l.name} <ArrowIcon />
                </Link>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <p className="cfoot">조회수나 성과는 예측하지 않습니다. 소재는 출발점이고, 실제 반응은 올려 본 뒤에야 알 수 있습니다.</p>
    </div>
  );
}
