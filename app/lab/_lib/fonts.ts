import { statSync } from "node:fs";
import { join } from "node:path";

/** /lab 에서 쓰는 글꼴 목록(결정 #74). 묶음 파일은 public/lab/fonts/<slug>.zip — 공식 TTF + OFL.txt + 읽어보기.txt */
export type LabFont = {
  slug: string;
  name: string;
  /** CSS font-family 이름(미리보기에 그대로 쓴다) */
  family: string;
  where: string;
  sample: string;
  files: string;
  source: string;
  italic?: boolean;
};

export const LAB_FONTS: LabFont[] = [
  {
    slug: "wanted-sans",
    name: "Wanted Sans",
    family: "Wanted Sans Variable",
    where: "Visual Lab 페이지의 제목과 본문 전체",
    sample: "AI에게 시각 표현을 이름으로 시키는 법",
    files: "가변 글꼴 1개(굵기 400~1000을 한 파일에)",
    source: "https://github.com/wanteddev/wanted-sans",
  },
  {
    slug: "instrument-serif",
    name: "Instrument Serif",
    family: "Instrument Serif",
    where: "영문 제목과 숫자 강조(기울임)",
    sample: "Visual Lab — 92 practices",
    files: "보통 · 기울임 2개",
    source: "https://github.com/google/fonts/tree/main/ofl/instrumentserif",
    italic: true,
  },
  {
    slug: "black-han-sans",
    name: "Black Han Sans(검은고딕)",
    family: "Black Han Sans",
    where: "데모 속 큰 제목·자막(키네틱 타이포, 쇼츠 자막)",
    sample: "0.2초 차이로 광고처럼",
    files: "보통 1개",
    source: "https://github.com/google/fonts/tree/main/ofl/blackhansans",
  },
  {
    slug: "ibm-plex-sans-kr",
    name: "IBM Plex Sans KR",
    family: "IBM Plex Sans KR",
    where: "데모 속 설명 글자·이름표·차트 글자",
    sample: "매출이 3개월 만에 두 배로",
    files: "보통 · 중간 · 굵게 3개(사이트에서 쓰는 굵기)",
    source: "https://github.com/google/fonts/tree/main/ofl/ibmplexsanskr",
  },
  {
    slug: "jetbrains-mono",
    name: "JetBrains Mono",
    family: "JetBrains Mono",
    where: "데모 속 숫자·타임코드·코드, 지시문의 값",
    sample: "00:01.50  ease-out  #FF8A3D",
    files: "가변 글꼴 2개(보통 · 기울임)",
    source: "https://github.com/google/fonts/tree/main/ofl/jetbrainsmono",
  },
];

/** 묶음 크기(빌드 때 실제 파일에서 잰다). 파일이 없으면 빌드가 멈춰야 하므로 오류를 그대로 올린다. */
export function zipSize(slug: string): string {
  const bytes = statSync(join(process.cwd(), "public", "lab", "fonts", `${slug}.zip`)).size;
  return bytes >= 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)}MB` : `${Math.round(bytes / 1000)}KB`;
}
