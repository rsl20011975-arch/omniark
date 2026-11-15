import Link from "next/link";
import type { Metadata } from "next";
import LabTabs from "../_components/LabTabs";
import PromptList from "../_components/PromptList";
import { prompts } from "../_lib/catalog";

export const metadata: Metadata = {
  title: "복사해 쓰는 지시 문장 25개 — AI 영상·모션 지시문 모음",
  description:
    "AI에게 영상·모션그래픽을 시킬 때 그대로 붙여 넣는 지시 문장 25개. 길이·장면·등장 순서·강조·카메라·리듬·금지·검수 항목별로 나눴고, 실제로 쓴 문장과 아직 써 보지 않은 문장을 구분했다.",
  alternates: { canonical: "/lab/prompts" },
};

export default function PromptsPage() {
  const { sub, items } = prompts();
  return (
    <div className="hubw cat-page">
      <nav className="crumb" aria-label="경로">
        <Link href="/lab">Visual Lab</Link><i>›</i><span>지시 문장</span>
      </nav>
      <LabTabs current="/lab/prompts" />
      <header className="cat-h">
        <span className="kicker ko">지시 문장 · {items.length}개</span>
        <h1>복사해 쓰는 지시 문장 {items.length}개</h1>
        <p className="lead">{sub} 문장 옆 ‘복사’를 누르고 Claude Code·Codex 같은 AI에게 붙여 넣는다. 숫자와 색은 내 영상에 맞게 바꿔 쓰면 된다.</p>
      </header>
      <PromptList items={items} />
      <p className="cfoot">각 문장의 숫자(0.12~0.2초, 40px, #FF8A3D 등)는 한 번의 실험에서 쓴 값이다. 정답이 아니라 출발점이니 영상의 리듬에 맞춰 조정한다.</p>
    </div>
  );
}
