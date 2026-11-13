"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** 아티팩트에서 그대로 가져온 데모(_demos/art/dNN.js)의 모양. 화면은 시간 t 의 순수한 함수다. */
type Demo = {
  dur: number;
  rest: number;
  noCompare: boolean;
  mount: (stage: HTMLElement) => unknown;
  /** level: 만드는 순서 1~level 단계까지만 적용(없으면 전부). 단계별 보기가 있는 데모만 쓴다 */
  render: (state: unknown, t: number, after: boolean, level?: number | null) => void;
};
type Loader = () => Promise<{ default: Demo }>;

/** 3D 데모의 WebGL 화면을 돌려준다. 브라우저는 동시에 열 수 있는 수가 정해져 있어서, 페이지를 오가다 보면 막힌다. */
function releaseGl(s: unknown) {
  const seen = new Set<unknown>();
  const walk = (o: unknown, depth: number) => {
    if (!o || typeof o !== "object" || seen.has(o) || depth > 2) return;
    seen.add(o);
    const rr = (o as { renderer?: { dispose?: () => void; forceContextLoss?: () => void } }).renderer;
    if (rr?.forceContextLoss) {
      rr.dispose?.();
      rr.forceContextLoss();
    }
    for (const v of Object.values(o)) walk(v, depth + 1);
  };
  walk(s, 0);
}

export default function ArtDemo({ load, label, level = null }: { load: Loader; label: string; level?: number | null }) {
  const stage = useRef<HTMLDivElement>(null);
  const sp = useRef<HTMLDivElement>(null);
  const badge = useRef<HTMLDivElement>(null);
  const scrub = useRef<HTMLInputElement>(null);
  const timeEl = useRef<HTMLSpanElement>(null);
  const run = useRef({
    demo: null as Demo | null, s: null as unknown, t: 0, playing: true, speed: 1, after: true, visible: true, reduce: false,
    level: null as number | null,
  });
  const [after, setAfter] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [meta, setMeta] = useState({ dur: 4, noCompare: false });

  const draw = useCallback(() => {
    const r = run.current;
    if (!r.demo || !scrub.current || !timeEl.current || !badge.current) return;
    r.demo.render(r.s, r.t, r.after, r.level);
    scrub.current.value = String(r.t);
    timeEl.current.textContent = `${r.t.toFixed(2)}초 / ${r.demo.dur.toFixed(1)}초`;
    badge.current.className = r.demo.noCompare ? "artbadge off" : r.after ? "artbadge after" : "artbadge";
    badge.current.textContent = !r.after ? "연출 전 · 흔한 첫 결과" : r.level != null ? `만드는 순서 1~${r.level}단계까지 적용` : "연출 후";
  }, []);

  useEffect(() => {
    let alive = true;
    let raf = 0;
    let ro: ResizeObserver | undefined;
    let io: IntersectionObserver | undefined;
    const r = run.current;
    r.level = level; // 단계가 바뀌면 부모가 key 를 바꿔 새로 시작하므로, 처음 한 번만 읽는다.
    const spEl = sp.current;
    load().then((m) => {
      if (!alive || !sp.current || !stage.current) return;
      const d = m.default;
      r.demo = d;
      r.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (r.reduce) {
        r.playing = false;
        r.t = d.rest;
      }
      r.s = d.mount(sp.current);
      setMeta({ dur: d.dur, noCompare: d.noCompare });
      setPlaying(r.playing);
      const el = sp.current;
      const box = stage.current;
      ro = new ResizeObserver(() => {
        el.style.transform = `scale(${box.clientWidth / 640})`;
      });
      ro.observe(box);
      io = new IntersectionObserver((es) => es.forEach((e) => (r.visible = e.isIntersecting)), { rootMargin: "100px" });
      io.observe(box);
      let last = performance.now();
      const tick = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (r.playing && r.visible) {
          r.t += dt * r.speed;
          if (r.t > d.dur) r.t = 0;
          draw();
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      draw();
      // 캔버스 글자는 글꼴이 도착한 뒤에 다시 그려야 맞는 글꼴로 보인다.
      document.fonts?.ready.then(() => alive && draw());
    });
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      io?.disconnect();
      releaseGl(r.s);
      if (spEl) spEl.textContent = "";
      r.demo = null;
    };
  }, [load, draw, level]);

  function pickMode(v: boolean) {
    run.current.after = v;
    setAfter(v);
    draw();
  }
  function pickSpeed(v: number) {
    run.current.speed = v;
    setSpeed(v);
  }
  function togglePlay() {
    const r = run.current;
    r.playing = !r.playing;
    setPlaying(r.playing);
  }
  function replay() {
    const r = run.current;
    r.t = 0;
    r.playing = true;
    setPlaying(true);
    draw();
  }

  return (
    <div className="demo">
      <div className="artstage" ref={stage} role="img" aria-label={`${label} 움직이는 예제`}>
        <div className="artsp" ref={sp} />
        <div className="artbadge" ref={badge} />
      </div>
      <div className="ctrl">
        {!meta.noCompare && (
          <div className="seg" role="group" aria-label="비교">
            <button type="button" aria-pressed={!after} onClick={() => pickMode(false)}>연출 전</button>
            <button type="button" aria-pressed={after} onClick={() => pickMode(true)}>연출 후</button>
          </div>
        )}
        <div className="seg" role="group" aria-label="재생 속도">
          {[1, 0.5, 0.25].map((v) => (
            <button key={v} type="button" aria-pressed={speed === v} onClick={() => pickSpeed(v)}>{v}×</button>
          ))}
        </div>
        <button type="button" className="btn small" onClick={togglePlay}>{playing ? "일시정지" : "재생"}</button>
        <button type="button" className="btn small" onClick={replay}>처음부터</button>
        <div className="scrubwrap">
          <label className="scrub">
            <span className="sr">타임라인</span>
            <input
              type="range"
              min={0}
              max={meta.dur}
              step={0.01}
              defaultValue={0}
              ref={scrub}
              onInput={(ev) => {
                const r = run.current;
                r.playing = false;
                setPlaying(false);
                r.t = parseFloat(ev.currentTarget.value);
                draw();
              }}
            />
          </label>
          <span className="time" ref={timeEl}>0.00초 / {meta.dur.toFixed(1)}초</span>
        </div>
      </div>
    </div>
  );
}
