"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Bench = { variant: string | null; apply: (id: string | null) => void };
const Ctx = createContext<Bench>({ variant: null, apply: () => {} });

/** 데모와 응용 팁이 같은 '지금 적용 중인 팁'을 보게 묶는다. 팁의 '적용해서 보기'를 누르면 위의 데모가 그 값으로 바뀐다. */
export function DemoWorkbench({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = useState<string | null>(null);
  const apply = useCallback((id: string | null) => {
    setVariant(id);
    if (id) document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);
  const value = useMemo(() => ({ variant, apply }), [variant, apply]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useBench = () => useContext(Ctx);
