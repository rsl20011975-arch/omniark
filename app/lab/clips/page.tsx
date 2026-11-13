import Link from "next/link";
import type { Metadata } from "next";
import CopyButton from "../_components/CopyButton";
import LabTabs from "../_components/LabTabs";
import { clips, mediaUrl } from "../_lib/catalog";

export const metadata: Metadata = {
  title: "예시 영상 20개 — 연출 요소 하나씩 잘라 낸 4~9초 조각",
  description:
    "실제로 만든 롱폼에서 연출 요소 하나씩을 잘라 낸 4~9초 영상 20개와, 요소 하나에 붙이는 지시 문장. 재생하면 반복됩니다.",
  alternates: { canonical: "/lab/clips" },
};

export default function ClipsPage() {
  const { sub, items, full } = clips();
  return (
    <div className="hubw cat-page">
      <nav className="crumb" aria-label="경로">
        <Link href="/lab">Visual Lab</Link><i>›</i><span>예시 영상</span>
      </nav>
      <LabTabs current="/lab/clips" />
      <header className="cat-h">
        <span className="kicker ko">예시 영상 · {items.length}개</span>
        <h1>연출 요소 하나씩, 직접 만든 4~9초 영상 {items.length}개</h1>
        <p className="lead">{sub}</p>
      </header>

      <section className="cfull" aria-labelledby="full-h">
        <div className="cv">
          <video controls playsInline preload="none" poster={mediaUrl(full.poster)} src={mediaUrl(full.video)} aria-label="완성 영상 58초" />
        </div>
        <div>
          <span className="kicker ko">완성 영상 · 58초</span>
          <h2 id="full-h">같은 데이터, 지시문만 다르게</h2>
          <p>{full.sub}</p>
          <p>{full.text}</p>
          <p className="cmute">{full.caveat}</p>
        </div>
      </section>

      <ul className="cgrid">
        {items.map((c) => (
          <li key={c.id} id={c.id} className="cclip">
            <div className="cv">
              <video controls muted loop playsInline preload="none" poster={mediaUrl(c.poster)} src={mediaUrl(c.video)} aria-label={c.title} />
            </div>
            <div className="cb">
              <h2>{c.title}</h2>
              <p className="cwhat">{c.what}</p>
              <div className="ccmd">
                <code>{c.cmd}</code>
                <CopyButton text={c.cmd} />
              </div>
              <span className="csrc">{c.src}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
