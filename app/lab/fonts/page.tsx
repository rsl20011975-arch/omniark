import Link from "next/link";
import type { Metadata } from "next";
import LabTabs from "../_components/LabTabs";
import { DownloadIcon } from "../_components/icons";
import { LAB_FONTS, zipSize } from "../_lib/fonts";

export const metadata: Metadata = {
  title: "Visual Lab 에서 쓴 글꼴 5종 — 무료 내려받기(OFL)",
  description:
    "Visual Lab 페이지와 데모에 쓴 글꼴 5종(Wanted Sans, Instrument Serif, 검은고딕, IBM Plex Sans KR, JetBrains Mono)을 공식 파일 그대로 내려받을 수 있다. 모두 SIL Open Font License 1.1로 상업 작업에도 무료이다.",
  alternates: { canonical: "/lab/fonts" },
};

export default function FontsPage() {
  return (
    <div className="hubw cat-page">
      <nav className="crumb" aria-label="경로">
        <Link href="/lab">Visual Lab</Link><i>›</i><span>사용한 글꼴</span>
      </nav>
      <LabTabs current="/lab/fonts" />
      <header className="cat-h">
        <span className="kicker ko">사용한 글꼴 · {LAB_FONTS.length}종</span>
        <h1>이 사전에 쓴 글꼴 {LAB_FONTS.length}종</h1>
        <p className="lead">
          데모를 따라 만들 때 같은 글꼴을 쓰면 화면이 똑같이 나옵니다. 모두 공식 배포 파일 그대로이며, SIL Open Font License 1.1이라 영상·웹·인쇄 같은
          상업 작업에도 무료로 쓸 수 있다. 내려받은 .ttf 파일을 더블클릭해 ‘설치’를 누르면 된다.
        </p>
      </header>
      <ul className="fontgrid">
        {LAB_FONTS.map((f) => (
          <li key={f.slug} className="fontcard">
            <p className="fontsample" style={{ fontFamily: `"${f.family}"`, fontStyle: f.italic ? "italic" : undefined }}>{f.sample}</p>
            <div className="fontmeta">
              <b>{f.name}</b>
              <span>쓰인 곳: {f.where}</span>
              <span>들어 있는 파일: {f.files} + 라이선스 전문</span>
            </div>
            <div className="fontact">
              <a className="btn" href={`/lab/fonts/${f.slug}.zip`} download>
                <DownloadIcon /> 내려받기 · {zipSize(f.slug)}
              </a>
              <a className="fontlink" href={f.source} target="_blank" rel="noopener noreferrer">공식 출처</a>
            </div>
          </li>
        ))}
      </ul>
      <p className="cfoot">
        OFL 조건: 글꼴 파일만 따로 판매할 수는 없고, 글꼴 파일 자체를 고쳐 다시 배포할 때는 같은 라이선스로 원래 이름을 쓰지 않아야 한다. 이 글꼴로 만든 영상·이미지·문서에는
        제한이 없다. 이 사이트는 글꼴을 외부 서비스에서 불러오지 않고 직접 내보낸다.
      </p>
    </div>
  );
}
