import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { release } from "./release";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "OmniPDF — 구독 없이 편하게 쓰는 무료 PDF 편집 도구",
  description: "결제, 워터마크, 사용 횟수 제한 없이 PDF 병합·추출·페이지 정리·주석·한영 OCR·압축을 사용하세요. 웹·Windows·Mac용 무료 PDF 도구.",
  alternates: { canonical: "https://omniark.co/tools/omnipdf" },
  openGraph: { title: "OmniPDF | 필요한 PDF 편집을 편하게", description: "제가 쓰려고 만들었고, 함께 쓰려고 무료로 공개합니다.", url: "https://omniark.co/tools/omnipdf", locale: "ko_KR" },
};

const features = [
  ["01", "페이지를 내 방식대로", "여러 PDF와 이미지를 열고 페이지 순서 변경·회전·삭제·추출·병합을 할 수 있습니다."],
  ["02", "읽고 표시하고 찾기", "본문 검색과 복사, 형광펜, 한글 메모, 인쇄를 한 작업실에서 처리합니다."],
  ["03", "문서를 더 쓸모 있게", "한글·영어 OCR, 이미지 방식 압축, 선택 영역 지우기와 글자 교체를 제공합니다."],
];

export default function OmniPdfPage() {
  return <div data-product-page className={styles.page} lang="ko">
    <nav className={styles.breadcrumb} aria-label="현재 위치"><Link href="/">OMNIARK 홈</Link><span aria-hidden="true"> / </span><span>OmniPDF</span></nav>
    <section className={styles.hero} aria-labelledby="omnipdf-title"><div className={styles.heroCopy}>
      <p className={styles.eyebrow}><span className={styles.mark} aria-hidden="true">A</span> OMNIPDF <span className={styles.badge}>ALL FEATURES FREE</span></p>
      <h1 id="omnipdf-title">구독 없이,<br /><em>필요한 PDF 편집을 편하게.</em></h1>
      <p className={styles.lead}>결제도, 워터마크도, 횟수 제한도 없습니다.<br />브라우저에서 바로 쓰거나 내 컴퓨터에 설치하세요.</p>
      <div className={styles.actions}><a className={styles.primary} href={release.web}>브라우저에서 바로 사용 <span aria-hidden="true">↗</span></a><a className={styles.secondary} href="#download">무료 다운로드 ↓</a></div>
      <p className={styles.meta}>v{release.version} · Windows · Apple Silicon · Intel Mac · 모든 기능 무료</p>
    </div><div className={styles.heroNote}><span>YOUR DOCUMENTS.</span><span>YOUR WAY.</span><p>문서는 내 기기에서.<br />기능은 누구에게나.</p></div></section>
    <figure className={styles.screen}><div className={styles.screenBar}><span aria-hidden="true">● ● ●</span><span>OMNIPDF / DOCUMENT STUDIO</span><span>0.6.0</span></div><Image src="/images/omnipdf/workspace.png" alt="OmniPDF 편집 화면: 왼쪽 페이지 목록, 가운데 문서 미리보기, 위쪽 검색과 주석 도구" width={1424} height={911} priority sizes="(max-width: 760px) 100vw, 1100px" /><figcaption>실제 OmniPDF 앱 화면 · 페이지 정리와 큰 문서 미리보기</figcaption></figure>
    <section className={styles.features} aria-label="주요 기능">{features.map(([number,title,body]) => <article key={number}><span className={styles.number}>{number}</span><h2>{title}</h2><p>{body}</p></article>)}</section>
    <section className={styles.walkthrough} aria-labelledby="why-title"><div><p className={styles.eyebrow}>WHY OMNIPDF</p><h2 id="why-title">제가 쓰려고 만들었고,<br />함께 쓰려고 공개합니다.</h2></div><div><p>PDF를 자주 사용하지만 구독하지 않으면 필요한 편집 기능을 제대로 쓰기 어려웠습니다. 무료 버전은 기능이 제한되어 작업 흐름이 자주 끊겼습니다.</p><p>저와 같은 불편을 겪는 분들이 결제 걱정 없이 편하게 사용하셨으면 해서 OmniPDF를 만들었습니다. 무료 기능을 미끼로 결제를 유도하지 않습니다. 운영을 위해 광고를 넣더라도 문서 작업과 분리된 최소한의 영역에만 표시할 계획입니다.</p><p>이 도구가 편리했다면 OmniPDF를 만든 <strong>OMNIARK</strong>라는 이름을 기억해 주시는 것으로 충분합니다.</p></div></section>
    <section className={styles.download} aria-labelledby="web-title"><div><p className={styles.eyebrow}>NO INSTALLATION</p><h2 id="web-title">설치 없이 바로 사용하세요.</h2><p>웹 버전도 PDF를 서버에 업로드하지 않습니다. 브라우저 안에서 처리하며 작업 결과만 사용자가 저장합니다. 계정 가입도 필요 없습니다.</p></div><div className={styles.downloadDetails}><a className={styles.primary} href={release.web}>OmniPDF 웹 작업실 열기 <span aria-hidden="true">↗</span></a><p>최신 Chrome, Edge, Safari 권장 · 큰 문서는 데스크톱 앱 권장</p></div></section>
    <section id="download" className={styles.download} aria-labelledby="download-title"><div><p className={styles.eyebrow}>FREE DESKTOP APP</p><h2 id="download-title">자주 쓴다면 앱으로.</h2><p>모든 기능은 무료입니다. 자동 결제와 구독 갱신이 없습니다.</p><p className={styles.notice}><strong>제작자 코드 서명 미적용</strong><br />무료 배포를 유지하기 위해 현재 Windows 인증서와 Apple Developer ID 유료 등록을 사용하지 않습니다. 운영체제가 경고할 수 있으므로 파일 해시와 출처를 확인해 주세요. 시스템 전체 보안 기능을 끄도록 요구하지 않습니다.</p></div><div className={styles.downloadDetails}>
      <a className={styles.primary} href={release.windows.file}>Windows 10/11 x64 설치 ↓</a>
      <a className={styles.primary} href={release.macArm.file}>Mac · Apple Silicon 다운로드 ↓</a>
      <a className={styles.primary} href={release.macIntel.file}>Mac · Intel 다운로드 ↓</a>
      <p>Mac은 ‘이 Mac에 관하여’에서 칩 종류를 확인하세요. 처음 실행이 차단되면 출처를 신뢰하는 경우에만 <a href="https://support.apple.com/ko-kr/102445" target="_blank" rel="noopener noreferrer">Apple의 앱별 실행 허용 안내</a>를 이용하세요.</p>
      <Link href="/tools/omnipdf/releases">버전 정보와 SHA-256 확인 →</Link><p><Link href="/tools/omnipdf/terms">무료 이용 조건</Link></p>
    </div></section>
    <section className={styles.faq} aria-labelledby="faq-title"><p className={styles.eyebrow}>GOOD TO KNOW</p><h2 id="faq-title">사용 전에 궁금한 것들.</h2>
      <details><summary>정말 모든 기능이 무료인가요?</summary><p>현재 제공되는 기능은 개인용과 업무용 모두 결제, 워터마크, 횟수 제한 없이 사용할 수 있습니다. 자동 갱신되는 구독도 없습니다.</p></details>
      <details><summary>문서가 서버로 전송되나요?</summary><p>웹과 데스크톱 버전 모두 PDF와 이미지를 사용자의 기기에서 처리합니다. 앱에는 문서 업로드, 로그인, 사용 분석 전송 기능이 없습니다.</p></details>
      <details><summary>Mac에서 왜 보안 안내가 나오나요?</summary><p>Apple의 유료 개발자 등록과 공증을 적용하지 않은 무료 개발 배포본이기 때문입니다. macOS 15의 Apple Silicon과 Intel 환경에서 자동 실행 검증을 통과했지만 Apple이 제작자 신원을 인증한 앱은 아닙니다.</p></details>
      <details><summary>원래 문서의 글자를 직접 고칠 수 있나요?</summary><p>선택 영역을 지우거나 새 글자를 넣을 수 있지만 해당 페이지를 이미지로 바꾸는 방식입니다. 원래 글꼴과 벡터 구조를 유지하는 본문 편집, 전자서명, Office 변환은 아직 지원하지 않습니다.</p></details>
      <details><summary>문제가 생기면 어디에 알려야 하나요?</summary><p><Link href="/contact">문의 페이지</Link>에 앱 버전, 운영체제, 파일 형식과 오류 메시지를 보내 주세요. 개인 문서 자체는 보내지 않아도 됩니다.</p></details>
    </section>
    <aside className={styles.related}><span>OMNIARK를 더 알아보세요</span><Link href="/productivity">생산성 가이드 →</Link><Link href="/about">OMNIARK 소개 →</Link></aside>
  </div>;
}
