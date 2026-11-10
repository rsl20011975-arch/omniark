"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/** 용어마다 데모 코드는 그 페이지에 들어갈 때만 내려받는다(한 파일에 몰아 넣지 않는다). 새 데모는 여기 한 줄만 더한다. */
const DEMOS: Record<string, ComponentType> = {
  "mask-reveal": dynamic(() => import("../_demos/MaskReveal"), {
    ssr: false,
    loading: () => <p className="note">데모 불러오는 중…</p>,
  }),
};

export default function DemoSlot({ slug }: { slug: string }) {
  const Demo = DEMOS[slug];
  return Demo ? <Demo /> : null;
}
