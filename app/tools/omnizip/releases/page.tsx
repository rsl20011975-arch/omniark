import type { Metadata } from "next";
import Link from "next/link";
import { release } from "../release";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "OmniZip 업데이트 및 다운로드 검증",
  description: "OmniZip 0.2.3 프리뷰의 변경 사항, 검사 범위, 지원 환경과 다운로드 파일 SHA256.",
  alternates: { canonical: "https://omniark.co/tools/omnizip/releases" },
};

export default function ReleasesPage() {
  return <div data-product-page lang="ko" className={styles.page + " " + styles.release}>
    <Link href="/tools/omnizip">← OmniZip 소개</Link>
    <h1>업데이트 내역</h1>
    <p>Windows x64 프리뷰와 Mac 베타를 무료로 제공합니다. 코드 서명과 자동 업데이트는 제공하지 않습니다.</p>

    <section>
      <h2>OmniZip 0.3.2 · Mac 베타</h2>
      <p>2026-10-08 · Apple Silicon / Intel · macOS 14 이상 대상. 공식 OmniZip 브랜드와 새 작업 화면을 적용했습니다. ZIP·7Z·RAR·001 형식을 Finder의 ‘다음으로 열기’ 후보로 등록하며 기존 기본 앱은 바꾸지 않습니다.</p>
      <p>macOS 14·15·26의 Apple Silicon과 Intel 환경에서 한글 파일, 암호 ZIP·7Z 생성, 무결성 검사, 해제, 되돌리기, 문서 형식 등록과 네이티브 앱 시작을 검사했습니다. 이 검증은 모든 장치와 사용자 환경에 대한 보증이 아닙니다.</p>
      <p>Apple Developer ID 서명과 공증은 적용하지 않았습니다. 유료 가입 없이 무료 베타로 제공합니다. 앱 번들에는 실행 호환성을 위한 로컬 서명만 적용했으며, 이는 Apple의 개발자 신원 인증을 뜻하지 않습니다.</p>
      <p><a href="https://github.com/rsl20011975-arch/omnizip-releases/releases/tag/mac-v0.3.2-beta">Mac 다운로드 · SHA256 · 검증 로그</a></p>
    </section>

    <section>
      <p className={styles.eyebrow}>{release.date} · PREVIEW</p>
      <h2>OmniZip {release.version}</h2>
      <ul>
        <li>공식 OmniZip 제품 아이콘과 더 선명한 원본·미리보기 작업 화면을 적용했습니다.</li>
        <li>설치할 때 ZIP·7Z·RAR·001 형식의 Windows ‘연결 프로그램’ 후보로 자동 등록합니다.</li>
        <li>기존 기본 압축 앱은 바꾸지 않으며, 제거할 때 OmniZip이 소유한 등록만 정리합니다.</li>
        <li>7Z 다중 파일 추출, 작은 창 스크롤, 취소 반응과 사용자 파일 보존 기능을 유지합니다.</li>
      </ul>
      <h3>검증한 범위</h3>
      <p>기능 70개와 실제 임시 설치·제거 34개 검사를 통과했습니다. 설치본을 직접 실행하고 브랜드 자산 포함, 네 형식의 연결 프로그램 등록, 제거 후 정리, 사용자 추가·수정 파일 보존을 확인했습니다.</p>
      <p>4 GiB + 64 KiB의 0으로 채운 파일을 ZIP64로 생성·해제하고 SHA256이 일치함을 확인했습니다. 이 검사는 특정 PC에서 수행했으며 모든 Windows 환경과 압축파일에 대한 보증은 아닙니다.</p>
      <h3>다운로드 파일</h3>
      <p>Windows x64 · .NET Framework 4.5 이상 · ZIP {release.size}. 현재 코드 서명이 없어 Windows 경고가 나타날 수 있습니다.</p>
      <a className={styles.primary} href={release.file} download>v{release.version} 프리뷰 ZIP 다운로드 ↓</a>
      <h3>SHA256</h3>
      <code className={styles.hash}>{release.sha256}</code>
      <p>PowerShell의 Get-FileHash 명령으로 내려받은 ZIP의 SHA256을 계산해 위 값과 비교할 수 있습니다. 해시는 파일 동일성 확인용이며 제작자 신원을 보증하는 코드 서명은 아닙니다.</p>
      <h3>소프트웨어 이용 조건</h3>
      <p><Link href="/tools/omnizip/terms">OmniZip 사용 및 재배포 조건</Link>을 확인하세요. 제3자 엔진에는 아래 별도 라이선스가 적용됩니다.</p>
      <h3>엔진과 라이선스</h3>
      <p>7-Zip 26.03 엔진을 사용합니다. 배포 ZIP의 THIRD-PARTY.md, engine/License.txt와 해당 엔진의 소스 압축파일을 함께 제공합니다.</p>
      <h3>알아둘 제한</h3>
      <ul>
        <li>자동 되돌리기 기록은 앱 실행 중에만 유지됩니다. 덮어쓴 파일의 백업은 디스크에 남습니다.</li>
        <li>RAR 생성은 지원하지 않습니다. ZIP 생성의 한글 암호는 지원하지 않으므로 7Z를 이용하세요.</li>
        <li>파일 생성 시 임시 복사 공간이 추가로 필요합니다.</li>
      </ul>
    </section>
    <p>문제 제보: <Link href="/contact">OMNIARK 문의</Link> · 암호나 개인 파일 대신 버전, 형식, 오류 메시지를 먼저 알려 주세요.</p>
  </div>;
}
