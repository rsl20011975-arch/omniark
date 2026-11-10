"use client";

import ArtDemo from "./ArtDemo";
import { useBench } from "./DemoWorkbench";
import { LOADERS } from "../_demos/art";

/** 용어 페이지의 데모 자리. 지금 적용 중인 응용 팁이 있으면 그 팁을 적용한 데모를, 없으면 원본 데모를 불러온다(필요한 것만 내려받는다). */
export default function DemoSlot({ demo, label, tipTitle }: { demo: string; label: string; tipTitle?: Record<string, string> }) {
  const { variant, apply } = useBench();
  const set = LOADERS[demo];
  if (!set) return null;
  const key = variant && set[variant] ? variant : "base";
  return (
    <>
      <ArtDemo key={`${demo}-${key}`} load={set[key]} label={label} />
      {key !== "base" && (
        <div className="tipnow" role="status">
          <span>응용 팁 적용 중 — {tipTitle?.[key] ?? key}</span>
          <button type="button" className="btn small" onClick={() => apply(null)}>원래대로</button>
        </div>
      )}
    </>
  );
}
