"use client";

import { useState } from "react";

export default function CodeBlock({ text }: { text: string }) {
  const [label, setLabel] = useState("복사");
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setLabel("복사됨");
    } catch {
      setLabel("직접 선택해 복사해 주세요");
    }
    setTimeout(() => setLabel("복사"), 1600);
  }
  return (
    <div className="code">
      <div className="code-bar">
        <span>Claude Code · Codex에 그대로 붙여 넣기</span>
        <button type="button" className="btn small" onClick={copy}>{label}</button>
      </div>
      <pre>{text}</pre>
    </div>
  );
}
