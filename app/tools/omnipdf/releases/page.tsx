import type { Metadata } from "next";
import Link from "next/link";
import { release } from "../release";
import styles from "../page.module.css";

export const metadata: Metadata = { title: "OmniPDF 다운로드 및 검증", description: `OmniPDF Windows ${release.version}와 Mac ${release.macArm.version}의 다운로드, 검증 범위와 SHA-256.`, alternates: { canonical: "https://omniark.co/tools/omnipdf/releases" } };

export default function ReleasesPage(){return <div data-product-page lang="ko" className={`${styles.page} ${styles.release}`}><Link href="/tools/omnipdf">← OmniPDF 소개</Link><h1>다운로드 및 검증</h1><p>OmniPDF {release.version}은 모든 기능을 무료로 제공합니다. 설치본은 제작자 코드 서명을 적용하지 않은 개발 배포본입니다.</p>
  <section><p className={styles.eyebrow}>{release.date} · WINDOWS VERSION {release.version}</p><h2>파일 연결 개선</h2><p>Windows {release.version}은 단위 테스트 48개와 실제 설치본에서 PDF를 처음 열 때·이미 실행 중일 때 추가로 여는 검사를 통과했습니다. PDF 연결은 실제 설치 경로를 가리키며, 제거 시 각 연결 항목이 해당 설치본의 것인지 확인해 정리합니다. 기존 버전에서 연결 프로그램이 열리지 않는다면 새 설치본으로 다시 설치한 뒤 PDF의 연결 프로그램에서 OmniPDF를 선택하세요.</p><p>PDF 읽기·정리·주석·OCR·JPG/PNG/TXT 변환과 지원되는 원래 글자 직접 수정을 제공합니다. Mac {release.macArm.version}은 macOS 15의 Apple Silicon·Intel 패키지 앱 검증을 통과했습니다. 운영체제별 설치 파일의 크기와 SHA-256을 확인했습니다.</p><p>Windows x64 설치본은 관리자 권한 확인 후 컴퓨터의 모든 사용자에게 설치되며 PDF 연결 프로그램도 컴퓨터 전체에 등록됩니다. 기본 PDF 앱은 사용자가 선택합니다. 실제 종이 인쇄, 모든 PDF 변형과 모든 운영체제 환경을 보증하는 검사는 아닙니다.</p></section>
  <section><h2>Windows 10/11 x64</h2><a className={styles.primary} href={release.windows.file}>설치 파일 다운로드 ↓</a><p>{release.windows.size} · {release.windows.bytes.toLocaleString("en-US")} bytes · 코드 서명 미적용</p><h3>SHA-256</h3><code className={styles.hash}>{release.windows.sha256}</code></section>
  <section><h2>Mac {release.macArm.version} · Apple Silicon</h2><a className={styles.primary} href={release.macArm.file}>M 시리즈용 DMG 다운로드 ↓</a><p>{release.macArm.size} · Apple Developer ID 서명·공증 미적용</p><h3>SHA-256</h3><code className={styles.hash}>{release.macArm.sha256}</code></section>
  <section><h2>Mac {release.macIntel.version} · Intel</h2><a className={styles.primary} href={release.macIntel.file}>Intel용 DMG 다운로드 ↓</a><p>{release.macIntel.size} · Apple Developer ID 서명·공증 미적용</p><h3>SHA-256</h3><code className={styles.hash}>{release.macIntel.sha256}</code></section>
  <section><h2>파일 확인 방법</h2><p>Windows PowerShell에서는 <code>Get-FileHash 파일경로 -Algorithm SHA256</code>으로 계산한 값을 위 항목과 비교할 수 있습니다. 해시는 파일이 바뀌지 않았는지 확인하는 값이며 제작자 신원을 인증하는 코드 서명은 아닙니다.</p><p><Link href="/tools/omnipdf/terms">무료 이용 조건</Link> · <Link href="/contact">오류 문의</Link></p></section>
</div>}
