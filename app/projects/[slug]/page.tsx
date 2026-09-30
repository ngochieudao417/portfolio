import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectPage } from "@/components/projects/ProjectPage";
import { getProject, projects } from "@/content/projects";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary.en,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.title, description: project.summary.en, url: `/projects/${project.slug}`, type: "article" },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  if (!getProject(slug)) notFound();
  return <ProjectPage slug={slug} />;
}
