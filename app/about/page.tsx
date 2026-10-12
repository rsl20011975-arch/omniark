import Link from "next/link";
import StudioShell from "../components/StudioShell";

export const metadata = {
  title: "소개 | OMNIARK",
  description: "일상에 쓸모를 더하는 소프트웨어 스튜디오 옴니아크를 소개합니다.",
};

export default function AboutPage() {
  return (
    <StudioShell current="/about">
      <main className="journal">
        <div className="post-head">
          <div className="crumbs">
            <span>옴니아크</span>
            <span>›</span>
            <span>소개</span>
          </div>
          <p className="post-kind">ABOUT</p>
          <h1>옴니아크 소개</h1>
          <p className="post-lead">
            옴니아크는 일상을 편하게 만드는 도구와 한국어로 세상을 넓히는 서비스를 만듭니다.
          </p>
        </div>

        <div className="post-body">
          <p>
            매일 마주치는 불편에서 아이디어를 발견합니다. 파일을 정리하는 일, 문서를 다루는 일, 새로운 언어로 생각을 표현하는 일. 옴니아크는 유용한 앱과 서비스를 만들며 더 나은 방법을 찾아갑니다.
          </p>

          <h2>우리가 만드는 것들</h2>

          <h3>한국어 서비스 (Language & Learning)</h3>
          <p>
            <strong>Sseugi (쓰기)</strong>는 한국어 학습자를 위한 쓰기 연습 도구입니다. TOPIK 쓰기 시험을 대비한 표와 그래프 설명 훈련 기능이 포함되어 있으며, AI 글쓰기 코치의 도움을 받을 수 있습니다. 자세한 내용은 <Link href="/korean/sseugi">Sseugi 페이지</Link>에서 확인할 수 있습니다.
          </p>

          <h3>일상·업무 도구 (Tools for Everyday)</h3>
          <p>
            <strong>옴니집 (OmniZip)</strong>은 압축을 풀기 전에 미리 내용을 확인하고 필요한 파일만 깔끔하게 정리할 수 있는 Windows용 압축 파일 워크스페이스입니다.
          </p>
          <p>
            <strong>옴니플레이어 (OmniPlayer)</strong>는 영상과 음악을 한곳에서 편안하게 감상할 수 있는 미디어 플레이어입니다.
          </p>
          <p>
            <strong>옴니PDF (OmniPDF)</strong>는 브라우저에서 바로 동작하는 가볍고 빠른 무료 PDF 편집 도구입니다.
          </p>
          <p>
            전체 제품 목록은 <Link href="/products">제품·서비스 페이지</Link>에서 확인할 수 있습니다.
          </p>

          <h2>문의하기</h2>
          <p>
            서비스 이용에 대한 문의나 제안, 기타 궁금한 점이 있으시다면 언제든지 <Link href="/contact">문의 페이지</Link>를 통해 연락해 주시기 바랍니다.
          </p>
        </div>
      </main>
    </StudioShell>
  );
}
