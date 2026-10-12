import type { Metadata } from "next";
import Link from "next/link";
import { release } from "../release";
import styles from "../page.module.css";

export const metadata: Metadata = { title: "OmniPDF 다운로드 및 검증", description: "OmniPDF Windows 0.6.2와 Mac 0.6.0의 다운로드, 검증 범위와 SHA-256.", alternates: { canonical: "https://omniark.co/tools/omnipdf/releases" } };

export default function ReleasesPage(){return <div data-product-page lang="ko" className={`${styles.page} ${styles.release}`}><Link href="/tools/omnipdf">← OmniPDF 소개</Link><h1>다운로드 및 검증</h1><p>OmniPDF {release.version}은 모든 기능을 무료로 제공합니다. 설치본은 제작자 코드 서명을 적용하지 않은 개발 배포본입니다.</p>
  <section><p className={styles.eyebrow}>{release.date} · WINDOWS VERSION {release.version}</p><h2>확인한 기능</h2><p>Windows 0.6.2는 단위 테스트 19개, 모든 사용자 설치 설정, 컴퓨터 전체 연결 프로그램 등록, 설치 파일의 크기와 SHA-256을 확인했습니다. 렌더링·저장·추출·검색·주석·인쇄 변환·강제 종료 복구·한글/영어 OCR·영역 수정·압축은 0.6.0 패키지 앱에서 확인했고, 0.6.2의 새 화면은 웹 렌더링으로 확인했습니다.</p><p>Windows x64 설치본은 관리자 권한 확인 후 컴퓨터의 모든 사용자에게 설치되며 PDF 연결 프로그램도 컴퓨터 전체에 등록됩니다. macOS 15 Apple Silicon·Intel은 0.6.0 패키지 앱을 검사했습니다. 실제 종이 인쇄, 모든 PDF 변형과 모든 운영체제 환경을 보증하는 검사는 아닙니다.</p></section>
  <section><h2>Windows 10/11 x64</h2><a className={styles.primary} href={release.windows.file}>설치 파일 다운로드 ↓</a><p>{release.windows.size} · {release.windows.bytes.toLocaleString("en-US")} bytes · 코드 서명 미적용</p><h3>SHA-256</h3><code className={styles.hash}>{release.windows.sha256}</code></section>
  <section><h2>Mac {release.macArm.version} · Apple Silicon</h2><a className={styles.primary} href={release.macArm.file}>M 시리즈용 DMG 다운로드 ↓</a><p>{release.macArm.size} · Apple Developer ID 서명·공증 미적용</p><h3>SHA-256</h3><code className={styles.hash}>{release.macArm.sha256}</code></section>
  <section><h2>Mac {release.macIntel.version} · Intel</h2><a className={styles.primary} href={release.macIntel.file}>Intel용 DMG 다운로드 ↓</a><p>{release.macIntel.size} · Apple Developer ID 서명·공증 미적용</p><h3>SHA-256</h3><code className={styles.hash}>{release.macIntel.sha256}</code></section>
  <section><h2>파일 확인 방법</h2><p>Windows PowerShell에서는 <code>Get-FileHash 파일경로 -Algorithm SHA256</code>으로 계산한 값을 위 항목과 비교할 수 있습니다. 해시는 파일이 바뀌지 않았는지 확인하는 값이며 제작자 신원을 인증하는 코드 서명은 아닙니다.</p><p><Link href="/tools/omnipdf/terms">무료 이용 조건</Link> · <Link href="/contact">오류 문의</Link></p></section>
</div>}
