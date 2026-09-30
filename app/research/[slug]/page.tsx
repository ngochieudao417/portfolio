import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResearchPage } from "@/components/research/ResearchPage";
import { getResearch, research } from "@/content/research";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return research.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getResearch(slug);
  if (!entry) return {};
  return {
    title: entry.title.en,
    description: entry.abstract.en,
    alternates: { canonical: `/research/${entry.slug}` },
    openGraph: { title: entry.title.en, description: entry.abstract.en, url: `/research/${entry.slug}`, type: "article" },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  if (!getResearch(slug)) notFound();
  return <ResearchPage slug={slug} />;
}
