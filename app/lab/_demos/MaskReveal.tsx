"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DUR = 4.2;
const HOLD = 1.2;
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const E = {
  outC: (x: number) => 1 - Math.pow(1 - x, 3),
  inC: (x: number) => x * x * x,
  inOutC: (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  outExpo: (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
};

/** 마스크 리빌 데모. 화면은 시간 t 의 순수한 함수라서 슬라이더로 어느 순간에서든 멈출 수 있다. */
export default function MaskReveal() {
  const word = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLElement>(null);
  const sub = useRef<HTMLDivElement>(null);
  const ul = useRef<HTMLElement>(null);
  const status = useRef<HTMLDivElement>(null);
  const scrub = useRef<HTMLInputElement>(null);
  const timeEl = useRef<HTMLSpanElement>(null);
  const run = useRef({ t: 0, playing: true, speed: 1, after: true, reduce: false });
  const [after, setAfter] = useState(true);
  const [speed, setSpeed] = useState(1);

  const render = useCallback(() => {
    const s = run.current;
    const w = word.current, b = bar.current, sb = sub.current, u = ul.current;
    if (!w || !b || !sb || !u || !status.current || !scrub.current || !timeEl.current) return;
    const t = s.t;
    let text: string;
    if (!s.after) {
      const p0 = seg(t, 0.4, 0.8);
      w.style.clipPath = "none";
      w.style.opacity = String(p0);
      b.style.opacity = "0";
      sb.style.transform = "none";
      sb.style.opacity = String(p0);
      u.style.transform = "scaleX(1)";
      u.style.opacity = String(p0);
      text = t < 0.4 ? "빈 화면" : t < 0.8 ? "페이드 인" : "그냥 나타남 — 시선이 갈 곳이 없다";
    } else {
      const W = w.offsetWidth || 420;
      const p = E.inOutC(seg(t, 0.4, 1.6));
      w.style.opacity = "1";
      w.style.clipPath = `inset(-10% ${((1 - p) * 100).toFixed(2)}% -10% 0)`;
      const g = E.outC(seg(t, 0.1, 0.35)) * (1 - E.inC(seg(t, 1.6, 1.9)));
      b.style.opacity = g > 0 ? "1" : "0";
      b.style.left = `${p * W - 3}px`;
      b.style.transform = `scaleY(${g})`;
      const q = E.outExpo(seg(t, 1.8, 2.5));
      sb.style.opacity = "1";
      sb.style.transform = `translateY(${((1 - q) * 110).toFixed(1)}%)`;
      u.style.opacity = "1";
      u.style.transform = `scaleX(${E.inOutC(seg(t, 2.4, 3.0))})`;
      text = t < 0.4 ? "가려진 상태" : t < 1.6 ? "드러나는 중 — 막대가 지나간 곳만 보임" : "완성";
    }
    const shown = Math.min(t, DUR);
    status.current.textContent = text;
    scrub.current.value = String(shown);
    timeEl.current.textContent = `${shown.toFixed(2)} / ${DUR.toFixed(2)}초`;
  }, []);

  useEffect(() => {
    const s = run.current;
    s.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (s.reduce) {
      s.playing = false;
      s.t = DUR;
    }
    let last = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const dt = (now - last) / 1000;
      last = now;
      if (s.playing) {
        s.t += dt * s.speed;
        if (s.t > DUR + HOLD) s.t = 0;
      }
      render();
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [render]);

  function pickMode(next: boolean) {
    const s = run.current;
    s.after = next;
    s.t = 0;
    s.playing = !s.reduce;
    setAfter(next);
    render();
  }
  function pickSpeed(v: number) {
    run.current.speed = v;
    setSpeed(v);
  }
  function replay() {
    run.current.t = 0;
    run.current.playing = true;
    render();
  }

  return (
    <div className="demo">
      <div className="stage" role="img" aria-label="마스크 리빌 데모. 막대가 지나간 자리만 글자가 보입니다.">
        <div className="mr-wrap">
          <div className="mr-line">
            <span className="mr-word" ref={word}>MOTION</span>
            <i className="mr-bar" ref={bar} />
          </div>
          <div className="mr-subwrap">
            <div className="mr-subbox"><div className="mr-sub" ref={sub}>가렸다가 드러내면, 시선이 따라온다</div></div>
            <i className="mr-ul" ref={ul} />
          </div>
        </div>
        <div className="stage-status" ref={status} aria-live="off" />
      </div>
      <div className="ctrl">
        <div className="seg" role="group" aria-label="비교">
          <button type="button" aria-pressed={!after} onClick={() => pickMode(false)}>연출 전</button>
          <button type="button" aria-pressed={after} onClick={() => pickMode(true)}>연출 후</button>
        </div>
        <div className="seg" role="group" aria-label="재생 속도">
          {[1, 0.5, 0.25].map((v) => (
            <button key={v} type="button" aria-pressed={speed === v} onClick={() => pickSpeed(v)}>{v}×</button>
          ))}
        </div>
        <button type="button" className="btn small" onClick={replay}>처음부터</button>
        <div className="scrubwrap">
          <label className="scrub">
            <span className="sr">타임라인</span>
            <input
              type="range"
              min={0}
              max={DUR}
              step={0.01}
              defaultValue={0}
              ref={scrub}
              onInput={(ev) => {
                run.current.playing = false;
                run.current.t = parseFloat(ev.currentTarget.value);
                render();
              }}
            />
          </label>
          <span className="time" ref={timeEl}>0.00 / 4.20초</span>
        </div>
      </div>
    </div>
  );
}
