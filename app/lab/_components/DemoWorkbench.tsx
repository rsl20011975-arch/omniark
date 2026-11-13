"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Bench = {
  variant: string | null;
  /** null 이면 전부 적용한 완성본. 숫자면 만드는 순서 1~level 단계까지만 적용한 모습 */
  level: number | null;
  apply: (id: string | null) => void;
  showLevel: (n: number | null) => void;
};
const Ctx = createContext<Bench>({ variant: null, level: null, apply: () => {}, showLevel: () => {} });

const toDemo = () => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "center" });

/** 데모와 응용 팁·만드는 순서가 같은 '지금 적용 중인 것'을 보게 묶는다. 누르면 위의 데모가 그 상태로 바뀐다. */
export function DemoWorkbench({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = useState<string | null>(null);
  const [level, setLevel] = useState<number | null>(null);
  const apply = useCallback((id: string | null) => {
    setVariant(id);
    setLevel(null);
    if (id) toDemo();
  }, []);
  const showLevel = useCallback((n: number | null) => {
    setLevel(n);
    setVariant(null);
    if (n != null) toDemo();
  }, []);
  const value = useMemo(() => ({ variant, level, apply, showLevel }), [variant, level, apply, showLevel]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useBench = () => useContext(Ctx);
