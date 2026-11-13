"use client";

import { useState } from "react";

/** 문장 한 줄을 복사하는 작은 버튼. 복사에 실패하면 직접 선택하라고 알린다(조용히 넘어가지 않는다). */
export default function CopyButton({ text, label = "복사" }: { text: string; label?: string }) {
  const [state, setState] = useState<"idle" | "done" | "fail">("idle");
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("done");
    } catch {
      setState("fail");
    }
    setTimeout(() => setState("idle"), 1600);
  }
  return (
    <button type="button" className="btn small" onClick={copy} aria-live="polite">
      {state === "done" ? "복사됨" : state === "fail" ? "직접 선택해 복사" : label}
    </button>
  );
}
