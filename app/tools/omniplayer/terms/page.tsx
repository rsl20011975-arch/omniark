import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Omni Player 소프트웨어 이용 조건",
  description: "Omni Player 0.3.8 개발 프리뷰의 무료 사용 범위, 재배포, 로컬 데이터 처리와 현재 제한 안내.",
  alternates: { canonical: "https://omniark.co/tools/omniplayer/terms" },
};

export default function OmniPlayerTermsPage() {
  return <article className="article-page" lang="ko">
    <p><Link href="/tools/omniplayer">← Omni Player 소개 및 다운로드</Link></p><h1>Omni Player 소프트웨어 이용 조건</h1>
    <p>적용일: 2026년 10월 8일 · 적용 대상: OMNIARK가 배포하는 Omni Player 0.3.8 개발 프리뷰</p>
    <h2>사용 범위와 비용</h2><p>개인과 조직은 이 버전을 개인용·업무용으로 무료로 내려받아 실행할 수 있습니다. 이 버전에 계정 가입, 구독 결제, 자동 갱신은 없습니다. 향후 다른 버전의 조건이 달라지더라도 이 버전의 사용 허락을 소급하여 유료로 바꾸지 않습니다.</p>
    <h2>권리와 재배포</h2><p>Omni Player 자체의 권리는 OMNIARK에 있습니다. 이 허락은 소유권 양도가 아닙니다. Omni Player 자체를 재판매하거나 수정본·다른 설치 묶음으로 재배포하려면 먼저 OMNIARK의 허락을 받아 주세요. 공식 제품 페이지 링크는 자유롭게 공유할 수 있습니다.</p><p>함께 제공하는 제3자 구성요소에는 각 라이선스가 우선 적용됩니다. 위 문장은 해당 라이선스가 허용하는 권리를 제한하지 않습니다. ZIP의 THIRD_PARTY_NOTICES.md와 licenses 폴더를 확인하세요.</p>
    <h2>개발 프리뷰의 범위</h2><p>이 버전은 Windows 10/11 x64를 대상으로 한 개발 프리뷰입니다. 모든 미디어·코덱·자막·장치에서의 동작, 오류 없는 재생 또는 데이터 복구를 보장하지 않습니다. 중요한 파일은 별도 백업을 유지하세요. 법률상 배제할 수 없는 이용자의 권리나 책임은 이 안내로 배제되지 않습니다.</p>
    <h2>설치와 제거</h2><p>ZIP 전체를 풀고 ‘OmniPlayer 실행.exe’로 설치 없이 사용할 수 있습니다. ‘OmniPlayer 설치.exe’는 현재 사용자 앱 폴더, 시작 메뉴의 실행·제거 바로가기, Windows 설치된 앱 제거 정보와 지원 미디어 형식의 연결 프로그램 목록을 등록합니다. ‘OmniPlayer 제거.exe’는 배포 목록에 있는 프로그램 파일과 해당 등록을 정리하며 설정과 사용자가 추가한 파일은 보존하도록 설계했습니다. 자세한 절차는 ZIP의 README.md를 확인하세요.</p>
    <h2>개인정보와 로컬 데이터</h2><p>이 버전에는 미디어 업로드, 계정 로그인, 광고, 원격 사용 분석 기능이 없습니다. 재생목록·이어보기·라이브러리·음량·자막 설정에는 로컬 파일 경로가 포함될 수 있으며 현재 Windows 사용자 폴더에 저장됩니다. 앱을 제거해도 설정은 자동 삭제되지 않습니다.</p><p>홈페이지 방문과 다운로드에는 호스팅 서비스의 통상적인 요청 처리가 적용됩니다. <Link href="/privacy">OMNIARK 개인정보 안내</Link>를 확인하세요.</p>
    <h2>보안과 업데이트</h2><p>현재 실행 파일에는 게시자 코드 서명이 없습니다. 출처를 확인할 수 없거나 실행이 차단되면 운영체제 보안 기능을 끄지 마세요. 공식 업데이트 채널이 구성되기 전에는 이 제품 페이지의 버전과 SHA256을 확인하세요.</p>
    <h2>문의</h2><p>오류 제보와 재배포 문의는 <Link href="/contact">문의 페이지</Link>를 이용해 주세요. 개인 영상·음악·자막 파일 자체는 보내지 말고 버전, 운영체제, 형식, 오류 메시지를 먼저 알려 주세요.</p>
  </article>;
}
