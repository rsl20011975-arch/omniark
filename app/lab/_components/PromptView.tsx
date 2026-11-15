import type { ReactNode } from "react";

/** 복사용 지시문을 읽기 좋게 그린다. 글은 바꾸지 않고 모양만 나눈다(복사되는 원문은 그대로). */
type Block =
  | { t: "h"; lvl: number; s: string }
  | { t: "p"; s: string }
  | { t: "ul" | "ol"; items: string[] };

const CIRCLED = /[①-⑩]/;
const LABEL = /^([^:：()（）[\]]{1,20}?)(\s*[（(][^)）]*[)）])?\s*[:：]\s+([\s\S]+)$/;

function parse(text: string): Block[] {
  const out: Block[] = [];
  let list: { t: "ul" | "ol"; items: string[] } | null = null;
  const flush = () => { if (list) { out.push(list); list = null; } };
  for (const raw of text.split("\n")) {
    const s = raw.trim();
    if (!s) { flush(); continue; }
    const h = s.match(/^(#{1,3})\s+(.*)$/);
    const ul = s.match(/^-\s+(.*)$/);
    const ol = s.match(/^\d+[.)]\s+(.*)$/);
    if (h) { flush(); out.push({ t: "h", lvl: h[1].length, s: h[2] }); continue; }
    const item = ul ? { t: "ul" as const, s: ul[1] } : ol ? { t: "ol" as const, s: ol[1] } : null;
    if (item) {
      if (list && list.t !== item.t) flush();
      if (!list) list = { t: item.t, items: [] };
      list.items.push(item.s);
      continue;
    }
    flush();
    out.push({ t: "p", s });
  }
  flush();
  return out;
}

/** 본문 안의 ① ② ③ 을 작은 목록으로 나눈다. 두 개 이상 있을 때만. */
function body(s: string): ReactNode {
  if ((s.match(/[①-⑩]/g) ?? []).length < 2) return s;
  const parts = s.split(/(?=[①-⑩])/).map((x) => x.trim()).filter(Boolean);
  const head = CIRCLED.test(parts[0][0]) ? null : parts.shift();
  return (
    <>
      {head}
      <ol className="pmt-sub">
        {parts.map((x, i) => (
          <li key={i}><i>{x[0]}</i><span>{x.slice(1).trim()}</span></li>
        ))}
      </ol>
    </>
  );
}

function Item({ s }: { s: string }) {
  const m = s.match(LABEL);
  if (!m) return <>{body(s)}</>;
  return (
    <>
      <b className="pmt-k">{m[1]}</b>
      {m[2] ? <span className="pmt-n">{m[2].trim()}</span> : null}
      <span className="pmt-v">{body(m[3])}</span>
    </>
  );
}

export default function PromptView({ text }: { text: string }) {
  return (
    <div className="pmt">
      {parse(text).map((b, i) => {
        if (b.t === "h") return <p key={i} className={`pmt-h pmt-h${b.lvl}`}>{b.s}</p>;
        if (b.t === "p") return <p key={i} className={i === 0 ? "pmt-lead" : "pmt-p"}>{b.s}</p>;
        const L = b.t;
        return (
          <L key={i} className={`pmt-list pmt-${L}`}>
            {b.items.map((x, j) => <li key={j}><Item s={x} /></li>)}
          </L>
        );
      })}
    </div>
  );
}
