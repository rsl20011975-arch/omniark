import type { Term } from "../_lib/types";
import Pv from "./Pv";

/** 목록 카드 대표 그림: 움직이는 CSS 미리보기가 있으면 그것을, 없으면 데모의 대표 장면 이미지를 쓴다. */
export default function Thumb({ term }: { term: Term }) {
  if (term.preview) return <Pv kind={term.preview} />;
  if (!term.poster) return null;
  return (
    <div className="pv pv-poster" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={term.poster} alt="" loading="lazy" width={960} height={540} />
    </div>
  );
}
