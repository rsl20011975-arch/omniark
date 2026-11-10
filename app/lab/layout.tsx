import type { Metadata } from "next";
import "./lab.css";
import LabFrame from "./_components/LabFrame";
import { LAB_INDEXABLE } from "./_lib/config";

export const metadata: Metadata = {
  title: { default: "Visual Lab · 시각 용어 사전", template: "%s | Visual Lab · OMNIARK" },
  description:
    "AI에게 시각 표현을 이름으로 시키는 법. 용어마다 직접 돌려 보는 데모, 연출 전·후, 그대로 붙여 넣을 지시문을 담았습니다.",
  robots: LAB_INDEXABLE ? undefined : { index: false, follow: false },
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return <LabFrame>{children}</LabFrame>;
}
