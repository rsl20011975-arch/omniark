import Link from "next/link";
import StudioShell from "../components/StudioShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 | OMNIARK",
  description: "옴니아크 웹사이트 및 서비스 이용약관입니다.",
  alternates: {
    canonical: "https://omniark.co/terms",
  },
};

export default function TermsPage() {
  return (
    <StudioShell current="/terms">
      <main className="journal">
        <div className="post-head">
          <div className="crumbs">
            <span>옴니아크</span>
            <span>›</span>
            <span>이용약관</span>
          </div>
          <p className="post-kind">TERMS OF USE</p>
          <h1>이용약관</h1>
          <p className="post-lead">
            이 이용약관은 옴니아크 웹사이트 및 제공되는 서비스 이용에 관한 일반적인 조건을 설명합니다.
          </p>
        </div>

        <div className="post-body">
          <h2>웹사이트 이용</h2>
          <p>
            사용자는 합법적인 개인적 및 정보 제공 목적으로 옴니아크 웹사이트를 이용할 수 있습니다.
            웹사이트의 운영을 방해하거나 시스템에 과부하를 주는 행위, 또는 웹사이트를 손상시키는 행위를 해서는 안 됩니다.
          </p>

          <h2>OmniZip 소프트웨어</h2>
          <p>
            다운로드 가능한 OmniZip 애플리케이션은 허용된 사용 범위, 재배포 정책, 타사 구성 요소,
            그리고 프리뷰 버전에 대한 제한 사항 등을 다루는 별도의 <Link href="/tools/omnizip/terms">소프트웨어 이용약관</Link>이 적용됩니다.
          </p>

          <h2>Sseugi 학습 서비스</h2>
          <p>
            Sseugi는 학습 연습 문제와 선택적인 AI 생성 글쓰기 제안을 제공합니다.
            자동화된 검사 및 AI 피드백은 오류를 놓치거나 부적절한 표현을 제안할 수 있습니다.
            이는 공식 시험 점수가 아니며 언어 능력을 보장하지 않으므로 제안을 사용하기 전에 항상 검토해야 합니다.
            현재 사용 가능 여부와 무료 이용 한도는 연습 페이지에 표시됩니다.
          </p>

          <h2>정보성 콘텐츠</h2>
          <p>
            옴니아크는 기술, AI 및 디지털 도구, 생산성, 웹에 관한 교육적이고 정보성 있는 일반 콘텐츠를 발행합니다.
            유용하고 정확한 정보를 제공하기 위해 합리적인 노력을 기울이고 있으나, 기술과 온라인 서비스는 시간이 지남에 따라 변할 수 있습니다.
            따라서 웹사이트의 정보는 특정 결과를 보장하지 않으며, 일반적인 정보로만 간주되어야 합니다.
          </p>

          <h2>외부 서비스 및 링크</h2>
          <p>
            웹사이트에는 타사 웹사이트 또는 서비스로 연결되는 링크가 포함될 수 있습니다.
            이러한 웹사이트는 독립적으로 운영되며 자체적인 이용약관 및 개인정보 처리방침을 가질 수 있습니다.
          </p>

          <h2>지식재산권</h2>
          <p>
            달리 명시되지 않는 한, 옴니아크에 게시된 모든 콘텐츠는 관련 지식재산권법의 보호를 받습니다.
            적절한 허가 없이 웹사이트 콘텐츠를 복제, 재게시, 배포하거나 상업적으로 이용할 수 없습니다.
          </p>

          <h2>약관 변경</h2>
          <p>
            본 이용약관은 필요한 경우 업데이트될 수 있으며, 변경 사항은 이 페이지에 반영됩니다.
          </p>

          <h2>문의</h2>
          <p>
            본 이용약관과 관련하여 궁금한 점이 있으시면 언제든지 <a href="mailto:soare.bloom@gmail.com">soare.bloom@gmail.com</a>으로 문의해 주시기 바랍니다.
          </p>
        </div>
      </main>
    </StudioShell>
  );
}
