"use client";

import type { Tip } from "../_lib/types";
import { useBench } from "./DemoWorkbench";

/** 응용 팁 카드. 초보가 막히는 말로 시작해서, 지시문의 어느 부분을 어떻게 바꾸는지, 그러면 무엇이 달라지는지를 보여 준다. */
export default function TipsPanel({ tips }: { tips: Tip[] }) {
  const { variant, apply } = useBench();
  return (
    <div className="tips">
      {tips.map((t, i) => {
        const on = variant === t.id;
        return (
          <article key={t.id} className={on ? "tip on" : "tip"}>
            <div className="tip-n">{i + 1}</div>
            <div className="tip-b">
              <h3>{t.title}</h3>
              <p className="tip-s">{t.situation}</p>
              <dl className="tip-d">
                <div><dt>지시문에서</dt><dd>{t.from}</dd></div>
                <div><dt>이렇게 바꾸세요</dt><dd className="to">{t.to}</dd></div>
                <div><dt>그러면</dt><dd>{t.effect}</dd></div>
              </dl>
              <div className="tip-f">
                <button type="button" className="btn small" aria-pressed={on} onClick={() => apply(on ? null : t.id)}>
                  {on ? "적용 끄기" : "이 팁 적용해서 보기"}
                </button>
                <span className="badge ok">확인</span>
                <span className="tip-v">데모에서 이 값만 바꿔 같은 장면을 나란히 비교해 확인했습니다</span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
