import Link from "next/link";
import StudioShell from "../components/StudioShell";

export const metadata = {
  title: "개인정보 처리방침 | OMNIARK",
  description: "옴니아크의 개인정보 처리방침과 수집 정보에 대한 안내입니다.",
};

export default function PrivacyPage() {
  return (
    <StudioShell current="/privacy">
      <main className="journal">
        <div className="post-head">
          <div className="crumbs">
            <span>옴니아크</span>
            <span>›</span>
            <span>개인정보 처리방침</span>
          </div>
          <p className="post-kind">PRIVACY POLICY</p>
          <h1>개인정보 처리방침</h1>
          <p className="post-lead">
            이 개인정보 처리방침은 옴니아크 웹사이트를 통해 제공되는 정보가 어떻게 처리되는지 설명합니다.
          </p>
        </div>

        <div className="post-body">
          <h2>수집하는 정보</h2>
          <p>
            옴니아크 웹사이트의 일반적인 글과 가이드를 읽기 위해 별도의 계정을 생성할 필요는 없습니다.
            사용자가 자발적으로 이메일을 통해 문의를 보낼 경우, 메시지에 포함된 정보는 문의에 답변하기 위한 목적으로만 사용될 수 있습니다.
          </p>

          <h2>Sseugi AI 글쓰기 코치</h2>
          <p>
            선택적으로 사용할 수 있는 Sseugi AI 글쓰기 코치 기능은 사용자가 제출에 동의한 초안과 문맥 정보만을 서버로 전송합니다.
            이 정보는 오직 글쓰기 피드백을 생성하는 데에만 사용됩니다. 작성하는 글에 이름, 연락처, 계정 정보 등 민감한 개인정보를 포함하지 않도록 주의해 주세요.
          </p>
          <p>
            Sseugi는 사용자가 제출한 초안이나 코치와의 대화 내용을 브라우저나 서버에 영구적으로 저장하지 않습니다.
            단, 무료 일일 코칭 횟수 제한을 관리하기 위해 기술적인 쿠키가 사용될 수 있습니다. AI 처리는 Google Gemini 모델을 통해 이루어지며,
            이는 Google의 관련 데이터 정책을 따릅니다.
          </p>

          <h2>Sseugi 학습 계정</h2>
          <p>
            Sseugi 계정 생성은 선택 사항입니다. 계정을 생성할 경우, 다른 기기에서도 학습을 이어갈 수 있도록 이메일 주소, 안전하게 암호화된 비밀번호,
            선택한 학습 단계, 학습 완료 기록, 복습 일정 등의 데이터가 안전한 서버에 저장됩니다. 사용자가 작성한 글이나 코치와의 대화 내용은 학습 기록에 저장되지 않습니다.
          </p>
          <p>
            사용자는 설정 화면에서 자신의 학습 기록을 다운로드하거나, 계정 및 데이터를 영구적으로 삭제할 수 있습니다.
          </p>

          <h2>웹사이트 이용 데이터</h2>
          <p>
            옴니아크는 웹사이트의 원활한 운영과 보안 유지를 위해 필수적인 기술적 정보(서버 로그 등)를 제한적으로 수집할 수 있습니다.
            이는 웹사이트에서 사용하는 호스팅 및 기술 서비스의 정책에 따라 달라질 수 있습니다.
          </p>

          <h2>타사 광고 및 쿠키</h2>
          <p>
            옴니아크는 웹사이트에 광고를 게재하기 위해 Google을 포함한 타사 광고 회사의 서비스를 사용합니다.
            이 회사들은 사용자의 이전 웹사이트 방문 기록이나 인터넷 상의 다른 웹사이트 방문 기록을 기반으로 맞춤형 광고를 제공하기 위해 쿠키를 사용합니다.
          </p>
          <p>
            사용자는 <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">Google 광고 설정</a>을 방문하여 맞춤형 광고를 취소할 수 있습니다.
            또한, <a href="https://youradchoices.com/" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>를 방문하여 타사 광고 제공업체의 쿠키 사용을 거부할 수도 있습니다.
          </p>

          <h2>정책 변경</h2>
          <p>
            이 개인정보 처리방침은 웹사이트의 기능, 서비스 또는 데이터 처리 방식이 변경될 때 업데이트될 수 있습니다.
          </p>

          <h2>연락처</h2>
          <p>
            이 개인정보 처리방침에 대해 궁금한 점이 있으시다면 <Link href="/contact">문의 페이지</Link>를 통해 연락해 주시기 바랍니다.
          </p>
        </div>
      </main>
    </StudioShell>
  );
}
