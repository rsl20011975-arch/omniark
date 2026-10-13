import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "OmniPDF 무료 이용 조건", description: "OmniPDF 0.7.1의 무료 사용 범위, 데이터 처리와 재배포 조건.", alternates: { canonical: "https://omniark.co/tools/omnipdf/terms" } };

export default function TermsPage(){return <article className="article-page" lang="ko"><p><Link href="/tools/omnipdf">← OmniPDF 소개 및 다운로드</Link></p><h1>OmniPDF 소프트웨어 이용 조건</h1><p>적용일: 2026년 10월 14일 · 적용 대상: OMNIARK가 배포하는 OmniPDF 0.7.1</p>
  <h2>사용 범위와 비용</h2><p>개인과 조직은 개인용·업무용으로 이 버전을 무료로 사용할 수 있습니다. 계정 가입, 구독 결제, 자동 갱신, 기능별 추가 결제가 없습니다. 이 버전의 무료 사용 허락을 나중에 소급하여 유료로 바꾸지 않습니다.</p>
  <h2>권리와 재배포</h2><p>OmniPDF 자체의 권리는 OMNIARK에 있습니다. 공식 제품 페이지 링크는 자유롭게 공유할 수 있습니다. 프로그램을 재판매하거나 수정본 또는 다른 설치 묶음으로 재배포하려면 먼저 허락을 받아 주세요. 법과 제3자 구성요소 라이선스가 허용하는 권리는 제한하지 않습니다.</p>
  <h2>데이터 처리</h2><p>웹과 데스크톱 버전은 PDF와 이미지를 사용자의 기기에서 처리합니다. 앱에는 문서 업로드, 로그인, 사용 분석 전송 기능이 없습니다. 웹사이트 접속과 다운로드에는 호스팅 서비스의 통상적인 요청 처리가 적용되며 자세한 내용은 <Link href="/privacy">개인정보 안내</Link>를 따릅니다.</p>
  <h2>지원 범위</h2><p>지원되는 원래 글자 객체는 문서 위에서 한 줄씩 직접 수정할 수 있습니다. 원래 글꼴·문자표·객체 위치를 확인하며 문단 재배치와 자동 글꼴 대체, 스캔 이미지 속 글자, 복잡하게 겹친 글자 객체는 지원하지 않습니다. 전자서명, 암호화 문서, 입력 양식과 Office 변환은 지원하지 않습니다. 영역 수정과 압축은 페이지를 이미지로 바꿀 수 있습니다. 중요한 문서는 원본을 보관하고 사본으로 먼저 확인해 주세요.</p>
  <h2>코드 서명</h2><p>무료 배포를 유지하기 위해 현재 Windows 제작자 인증서와 Apple Developer ID 유료 등록을 적용하지 않았습니다. 운영체제 보안 안내가 나타날 수 있습니다. 시스템 전체 보안 기능을 끄도록 요구하지 않습니다. 출처와 SHA-256을 확인하고 신뢰하는 경우에만 실행하세요.</p>
  <h2>제3자 소프트웨어와 문의</h2><p>함께 제공하는 pdf-lib, PDF.js, Electron, Tesseract.js, 나눔고딕 등에는 각 구성요소의 라이선스가 적용됩니다. 오류 제보와 재배포 문의는 <Link href="/contact">OMNIARK 문의 페이지</Link>를 이용하세요.</p>
</article>}
