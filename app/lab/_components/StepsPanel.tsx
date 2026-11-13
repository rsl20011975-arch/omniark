"use client";

import type { Step } from "../_lib/types";
import { useBench } from "./DemoWorkbench";

/** 만드는 순서. 단계별 보기가 있는 예제는 ‘여기까지 적용한 모습 보기’ 로 위의 데모를 그 단계까지의 상태로 바꾼다. */
export default function StepsPanel({ steps, levels }: { steps: Step[]; levels: number }) {
  const { level, showLevel } = useBench();
  return (
    <ol className="steps">
      {steps.map((st, k) => {
        const lv = k + 1;
        const viewable = levels > 0 && k < levels - 1;
        const on = level === lv;
        return (
          <li key={st.t} className={on ? "on" : undefined}>
            <b>{st.t}</b>
            <p>{st.d}</p>
            {st.code && <pre className="steps-code">{st.code}</pre>}
            {viewable && (
              <button type="button" className="btn small" aria-pressed={on} onClick={() => showLevel(on ? null : lv)}>
                {on ? "단계별 보기 끄기" : "여기까지 적용한 모습 보기"}
              </button>
            )}
          </li>
        );
      })}
    </ol>
  );
}
