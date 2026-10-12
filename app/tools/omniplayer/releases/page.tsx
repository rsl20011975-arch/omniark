import type { Metadata } from "next";
import Link from "next/link";
import { release } from "../release";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Omni Player 업데이트 및 다운로드 검증",
  description: "Omni Player 0.3.8 개발 프리뷰의 변경 사항, 기능 시험, 지원 환경, 제한과 다운로드 SHA256.",
  alternates: { canonical: "https://omniark.co/tools/omniplayer/releases" },
};

export default function ReleasesPage() {
  return <div data-product-page lang="ko" className={styles.page + " " + styles.release}>
    <Link href="/tools/omniplayer">← Omni Player 소개</Link><h1>업데이트 및 검증</h1>
    <p>Windows 10/11 x64용 무료 개발 프리뷰입니다. 코드 서명과 공식 자동 업데이트 채널은 아직 적용하지 않았습니다.</p>
    <section><p className={styles.eyebrow}>{release.date} · DEVELOPMENT PREVIEW</p><h2>Omni Player {release.version}</h2>
      <h3>0.3.8 변경 사항</h3><ul><li>승인된 Omni Player 제품 아이콘과 OMNIARK 보라·라일락·짙은 보라 팔레트를 창 아이콘, 상단 로고, 주요 버튼과 선택 상태에 적용</li><li>배포 폴더에 같은 제품 아이콘의 실행·설치·제거 항목과 간단한 시작 안내를 추가</li><li>설치 시 시작 메뉴의 실행·제거 바로가기와 Windows 설치된 앱 제거 항목을 등록하고 제거 시 함께 정리</li><li>제품 페이지 첫 화면의 다중 색상 테스트 영상을 실제 보라색 UI와 음악 반응 빛 파형 화면으로 교체</li></ul><h3>포함된 기능</h3><ul><li>영상·음악 파일과 폴더의 구분 가져오기, 저장한 재생목록 불러오기, 이어보기, 탐색, 배속과 A-B 반복</li><li>내장 자막·오디오 트랙 선택과 SRT·VTT·SMI·외부 ASS/SSA 자막</li><li>외부 ASS 옆 TTF·OTF·TTC 글꼴의 제한된 로컬 불러오기</li><li>1배속 실시간 3대역 EQ, 출력 장치 선택, 준비형 음악 연속 재생</li><li>실제 음악 신호에 반응하는 유리 리본·원형 스펙트럼·빛 파형 화면 효과</li><li>상단 미니 버튼으로 여는 항상 위 미니 플레이어와 기본 재생 버튼</li><li>폴더 라이브러리, 10,000개 합성 파일 인덱싱·검색 검증</li><li>설정 안전 사본·손상 자동 복구·최대 128KiB 로컬 오류 기록</li><li>공식 제품 아이콘의 실행·설치·제거 항목, 시작 메뉴 바로가기, 설치된 앱 제거 정보와 기존 연결 앱을 보존하는 Windows 연결 프로그램 등록</li></ul>
      <h3>검증한 범위</h3><p>기능 시험 58개가 통과했습니다. 전체 시험 48개 상태에서 5회, 50개 상태에서 3회 독립 반복 실행을 완료했습니다. 실제 패키지에서 H.264/AAC 영상, 한글 ASS 자막과 옆 글꼴, 실시간 EQ, 음악 연속 재생, 실제 음원에 반응하는 음악 화면 효과, 저샘플레이트 WAV 변환, 설치·업데이트·제거, 사용자용 실행·설치·제거 항목, 설치된 앱 등록, 설치 목록 변조 거부, 개인 파일 원위치 보존과 기존 연결 앱을 보존하는 Windows 연결 프로그램 등록을 확인했습니다.</p><p>실시간 EQ와 외부 ASS 자막을 함께 켜고 H.264/AAC·HEVC 10비트·VP9/Opus·FLAC를 전환한 900초 시험에서 재생 오류 없이 영상 15,958프레임과 EQ 오디오 31,822,264프레임을 처리했습니다. 이 검증은 특정 PC에서 이루어졌으며 모든 GPU·오디오 장치·HDR 디스플레이·스크린리더 조합을 의미하지 않습니다.</p>
      <h3>현재 제한</h3><ul><li>실시간 EQ는 1배속·48kHz 스테레오 출력 장치에서 사용합니다.</li><li>압축 음악의 인코딩 여백과 모든 파일의 완전한 갭리스 재생은 보장하지 않습니다.</li><li>컨테이너 내장 ASS 스타일과 첨부 글꼴은 외부 ASS와 동일하게 처리되지 않을 수 있습니다.</li><li>공식 게시자 코드 서명과 실제 서버 기반 자동 업데이트 전체 검증은 남아 있습니다.</li></ul>
      <h3>다운로드 파일</h3><p>Windows 10/11 x64 · ZIP {release.size} · {release.bytes.toLocaleString("en-US")} bytes</p><a className={styles.primary} href={release.file} download>v{release.version} 다운로드 ↓</a>
      <h3>SHA256</h3><code className={styles.hash}>{release.sha256}</code><p>PowerShell의 <code>Get-FileHash</code>로 계산한 값과 비교할 수 있습니다. 해시는 파일 동일성 확인용이며 코드 서명을 대신하지 않습니다.</p>
      <h3>제3자 구성요소</h3><p>배포 ZIP에 THIRD_PARTY_NOTICES.md와 라이선스 폴더를 포함합니다. Qt for Python, FFmpeg, TinyTag, libass와 그 런타임 의존 구성요소를 사용합니다.</p>
    </section><p><Link href="/tools/omniplayer/terms">소프트웨어 이용 조건</Link> · <Link href="/contact">문제 제보</Link></p>
  </div>;
}

