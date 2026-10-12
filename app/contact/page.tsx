import StudioShell from "../components/StudioShell";

export const metadata = {
  title: "문의 | OMNIARK",
  description: "옴니아크 서비스와 관련된 질문, 피드백 및 제휴 문의를 남겨주세요.",
};

export default function ContactPage() {
  return (
    <StudioShell current="/contact">
      <main className="journal">
        <div className="post-head">
          <div className="crumbs">
            <span>옴니아크</span>
            <span>›</span>
            <span>문의</span>
          </div>
          <p className="post-kind">CONTACT</p>
          <h1>문의하기</h1>
          <p className="post-lead">
            옴니아크 서비스에 대한 궁금한 점, 기능 제안 또는 오류 신고가 있다면 언제든 연락해 주세요.
          </p>
        </div>

        <div className="post-body">
          <h2>이메일 문의</h2>
          <p>
            <a href="mailto:soare.bloom@gmail.com">soare.bloom@gmail.com</a>
          </p>

          <h2>OmniZip 고객 지원</h2>
          <p>
            OmniZip 이용 중 발생하는 문제에 대해 문의하실 때는 앱 버전, Windows 또는 Mac 버전, 압축 파일의 형식,
            그리고 구체적인 오류 메시지를 함께 보내주시면 더 빠른 확인이 가능합니다.
          </p>
          <div className="callout">
            <div className="callout-title">주의 사항</div>
            <p>
              보안을 위해 비밀번호가 설정된 파일이나 개인정보가 포함된 문서는 원본 그대로 첨부하지 마세요.
              오류 증상 확인이 필요할 경우, 저희가 문제를 재현할 수 있는 안전한 테스트 파일을 별도로 요청드리겠습니다.
            </p>
          </div>

          <h2>콘텐츠 피드백</h2>
          <p>
            사이트 내에서 잘못된 정보나 수정이 필요한 부분을 발견하셨다면, 해당 페이지 주소와 함께 이메일로 알려주시면
            빠르게 검토 후 반영하겠습니다.
          </p>
        </div>
      </main>
    </StudioShell>
  );
}
