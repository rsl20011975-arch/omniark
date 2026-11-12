import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Rail from "../_components/Rail";
import TermBrowser from "../_components/TermBrowser";
import { allFields, getField, openFields, publishedTerms, termsOfField } from "../_lib/data";

interface Props {
  params: Promise<{ field: string }>;
}

/** 공개된 용어가 있는 분야만 길이 열린다. 그 밖의 주소는 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return openFields().map((f) => ({ field: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { field } = await params;
  const f = getField(field);
  if (!f) return { title: "페이지를 찾을 수 없습니다", robots: { index: false } };
  return {
    title: f.name,
    description: `${f.name}(${f.desc}) 용어 모음. 데모와 지시문을 직접 시험한 것만 올립니다.`,
    alternates: { canonical: `/lab/${f.slug}` },
  };
}

export default async function FieldPage({ params }: Props) {
  const { field } = await params;
  const f = getField(field);
  const terms = termsOfField(field);
  if (!f || terms.length === 0) notFound();

  return (
    <div className="shell">
      <Rail fields={allFields()} terms={publishedTerms()} />
      <div className="pg">
        <nav className="crumb" aria-label="경로">
          <Link href="/lab">Visual Lab</Link><i>›</i><span>{f.name}</span>
        </nav>
        <span className="kicker ko">{f.group === "기초" ? "기초 요소" : f.group === "연출" ? "연출 분야" : "제작 참고"} · 분야</span>
        <h1>{f.name}</h1>
        <p className="lead">{f.desc}. 용어를 고르면 데모와 지시문이 있습니다.</p>
        <TermBrowser terms={terms} />
      </div>
    </div>
  );
}
