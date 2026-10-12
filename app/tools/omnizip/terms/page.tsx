import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "OmniZip 소프트웨어 이용 조건",
  description: "OmniZip 0.2.3 개발 프리뷰의 무료 사용 범위, 재배포 조건, 데이터 처리와 제한 안내.",
  alternates: { canonical: "https://omniark.co/tools/omnizip/terms" },
};

export default function OmniZipTermsPage() {
  return <article className="article-page" lang="ko">
    <p><Link href="/tools/omnizip">← OmniZip 소개 및 다운로드</Link></p>
    <h1>OmniZip 소프트웨어 이용 조건</h1>
    <p>적용일: 2026년 10월 8일 · 적용 대상: OMNIARK가 배포하는 OmniZip 0.2.3 개발 프리뷰</p>
    <h2>사용 범위와 비용</h2>
    <p>개인 및 조직은 개인용·업무용으로 이 버전을 무료로 내려받아 실행할 수 있습니다. 이 버전에 계정 가입, 구독 결제, 자동 갱신은 없습니다. 향후 다른 버전의 조건이 달라지더라도 이 버전에 대한 사용 허락을 소급하여 유료로 바꾸지 않습니다.</p>
    <h2>권리와 재배포</h2>
    <p>OmniZip 자체의 권리는 OMNIARK에 있습니다. 이 사용 허락은 소유권의 양도가 아닙니다. OmniZip 자체를 재판매하거나 수정본·설치 묶음으로 재배포하려면 먼저 연락해 허락을 받아 주세요. 공식 제품 페이지 링크는 공유할 수 있습니다. 법에서 허용하는 이용은 제한하지 않습니다.</p>
    <p>함께 제공하는 7-Zip 엔진과 기타 제3자 구성요소에는 각 구성요소의 라이선스가 우선 적용됩니다. 위 재배포 제한은 해당 라이선스가 허용한 권리를 제한하지 않습니다. ZIP 안의 THIRD-PARTY.md, engine/License.txt 및 포함된 엔진 소스를 확인하세요.</p>
    <h2>개발 프리뷰의 범위</h2>
    <p>현재 버전은 Windows x64와 .NET Framework 4.5 이상을 대상으로 한 개발 프리뷰입니다. 모든 장치·압축 형식에서의 동작, 오류 없는 처리 또는 데이터 복구를 보장하지 않습니다. 중요한 파일은 별도 백업을 만들고 복사본으로 먼저 시험하세요. 법률상 배제할 수 없는 이용자의 권리나 책임은 이 안내로 배제되지 않습니다.</p>
    <h2>설치·제거와 파일 보존</h2>
    <p>ZIP을 풀어 OmniZip.exe를 직접 실행할 수 있습니다. 선택 설치 스크립트는 현재 사용자 앱 폴더와 시작 메뉴 바로가기를 사용하며, 탐색기 메뉴는 별도 옵션입니다. 자세한 절차는 ZIP 안의 README를 확인하세요.</p>
    <p>직접 실행한 경우 앱을 종료하고 프로그램 폴더를 제거할 수 있습니다. 선택 설치를 사용했다면 제공된 Uninstall-OmniZip.ps1을 사용하세요. 보관할 문서와 해제 결과, 되돌리기 백업은 삭제하기 전에 따로 보존하세요. 앱을 종료하면 자동 되돌리기 목록은 사라집니다.</p>
    <h2>개인정보와 보안</h2>
    <p>이 버전에는 파일 업로드·로그인·사용 분석 전송 기능이 없습니다. 웹사이트 접속과 다운로드의 요청 처리는 <Link href="/privacy">개인정보 안내</Link>를 따릅니다. 코드 서명이 적용되지 않았으므로 Windows에서 경고가 나타날 수 있습니다. 보안 기능을 끄도록 요구하지 않습니다.</p>
    <h2>문의</h2>
    <p>이용 조건, 재배포 허락, 오류 제보는 <Link href="/contact">OMNIARK 문의 페이지</Link>를 이용하세요. 암호나 개인 문서를 보내지 마세요.</p>
  </article>;
}
