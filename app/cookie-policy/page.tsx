import type { Metadata } from "next";
import StudioShell from "../components/StudioShell";

export const metadata: Metadata = {
  title: "쿠키 정책 | OMNIARK",
  description: "옴니아크 웹사이트의 쿠키 및 유사 기술 사용에 대한 안내입니다.",
  alternates: {
    canonical: "https://omniark.co/cookie-policy",
  },
};

export default function CookiePolicyPage() {
  return (
    <StudioShell current="/cookie-policy">
      <main className="journal">
        <div className="post-head">
          <div className="crumbs">
            <span>옴니아크</span>
            <span>›</span>
            <span>쿠키 정책</span>
          </div>
          <p className="post-kind">COOKIE POLICY</p>
          <h1>쿠키 정책</h1>
          <p className="post-lead">
            이 쿠키 정책은 옴니아크 웹사이트에서 쿠키 및 유사한 기술이 어떻게 사용되는지 설명합니다.
          </p>
        </div>

        <div className="post-body">
          <h2>쿠키란 무엇인가요?</h2>
          <p>
            쿠키는 웹사이트가 방문자의 기기에 저장할 수 있는 작은 정보 조각입니다.
            쿠키는 설정을 기억하거나 웹사이트 사용 패턴을 이해하고, 보안을 유지하거나 기타 웹사이트 기능을 제공하는 데 사용될 수 있습니다.
          </p>

          <h2>옴니아크의 쿠키 사용</h2>
          <p>
            웹사이트에서 사용하는 기능과 서비스에 따라, 쿠키는 웹사이트 기능 제공, 분석, 보안, 성능 측정 또는 광고 등의 목적으로 사용될 수 있습니다.
          </p>

          <h2>Sseugi의 현재 데이터 저장 방식</h2>
          <p>
            Sseugi는 브라우저의 로컬 스토리지를 활용하여 연습 문제 완료 기록, 시도 횟수, 학습 집중 횟수 등을 저장합니다.
            작성 중인 텍스트나 AI 피드백 내용은 해당 기록에 저장되지 않습니다. 이 웹사이트의 브라우저 데이터를 지우면
            로컬 연습 기록이 모두 삭제되며, AI 코치를 통해서도 연습 기록을 초기화할 수 있습니다.
          </p>
          <p>
            기술적인 용도로 사용되는 <code>sseugi_coach_day</code> 쿠키는 AI 코칭 요청 횟수를 제한하며 24시간 후에 만료됩니다.
            이 쿠키를 차단하거나 사이트 데이터를 삭제하면 사용 한도 제한이나 진행 상황 관련 기능이 정상적으로 작동하지 않을 수 있습니다.
          </p>

          <h2>타사 서비스</h2>
          <p>
            웹사이트에서 사용되는 타사 서비스는 자체적인 쿠키나 유사한 기술을 사용할 수 있으며, 이들의 정보 처리는 각 타사 서비스의 정책에 따릅니다.
          </p>

          <h2>광고 쿠키</h2>
          <p>
            옴니아크에 광고 서비스가 적용되는 경우, 관련 정책과 사용자 설정이 허용하는 범위 내에서 광고 제공, 측정 또는 맞춤 설정을 지원하기 위해
            광고 제공업체가 쿠키 또는 유사 기술을 사용할 수 있습니다.
          </p>

          <h2>쿠키 관리</h2>
          <p>
            대부분의 최신 웹 브라우저에서는 브라우저 설정을 통해 쿠키를 관리, 차단 또는 삭제할 수 있습니다.
            단, 쿠키를 제한할 경우 웹사이트의 일부 기능이 제대로 작동하지 않을 수 있습니다.
          </p>

          <h2>정책 변경</h2>
          <p>
            이 쿠키 정책은 웹사이트의 기술, 기능 또는 타사 서비스가 변경될 경우 업데이트될 수 있습니다.
          </p>

          <h2>문의</h2>
          <p>
            이 쿠키 정책과 관련하여 궁금한 점이 있으시다면 언제든지 <a href="mailto:soare.bloom@gmail.com">soare.bloom@gmail.com</a>으로 문의해 주시기 바랍니다.
          </p>
        </div>
      </main>
    </StudioShell>
  );
}
