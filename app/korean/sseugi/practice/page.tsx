import type { Metadata } from "next";
import SseugiPractice from "../sseugi-practice";
import RealWritingCoach from "../real-writing-coach";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Sseugi | Real-life Korean Writing Coach",
  description: "Practice the Korean messages you actually need with a short starting check, focused feedback, rewriting, and spaced review.",
  alternates: { canonical: "https://omniark.co/korean/sseugi/practice" },
};
export const dynamic = "force-dynamic";

export default function SseugiPage() {
  const aiCoachEnabled = process.env.SSEUGI_AI_ENABLED === "true" && Boolean(process.env.SSEUGI_GEMINI_API_KEY);
  return <div className={styles.page}><RealWritingCoach available={aiCoachEnabled} /><SseugiPractice /></div>;
}
