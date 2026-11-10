import type { CSSProperties } from "react";

/** 움직임을 그 자체로 보여 주는 반복 미리보기(CSS 만 사용). 영상 파일이 아니다. */
export default function Pv({ kind }: { kind: string | null }) {
  if (!kind) return null;
  let inner: React.ReactNode = null;
  if (kind === "ease") {
    const rows: [string, string][] = [["직선", "lin"], ["감속", "out"], ["가속→감속", "io"]];
    inner = rows.map(([label, cls], i) => (
      <div key={cls} className={`trk ${cls}`} style={{ top: `${30 + i * 26}%` }}>
        <b>{label}</b>
        <i />
      </div>
    ));
  } else if (kind === "stagger") {
    inner = (
      <div className="row">
        {["단어가", "박자에", "맞춰", "등장"].map((w, i) => (
          <span key={w} style={{ "--i": i } as CSSProperties}>
            {w}
          </span>
        ))}
      </div>
    );
  } else if (kind === "mask" || kind === "fade") {
    inner = (
      <div className="w">
        <span>MOTION</span>
        <i />
      </div>
    );
  } else if (kind === "wipe") {
    inner = (
      <>
        <div className="layer b"><span>전</span></div>
        <div className="layer a"><span>후</span></div>
        <i className="line" />
      </>
    );
  } else if (kind === "spot") {
    inner = (
      <>
        <div className="lns">
          <div className="ln">첫째, 지금 볼 곳</div>
          <div className="ln">둘째, 다음 설명</div>
          <div className="ln">셋째, 마무리</div>
        </div>
        <i className="sp" />
      </>
    );
  }
  return <div className={`pv pv-${kind}`} aria-hidden="true">{inner}</div>;
}
