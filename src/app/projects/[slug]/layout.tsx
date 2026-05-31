import { projects } from '@/data/projects'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return {}
  
  return {
    title: `${project.title} — Clarence Evan Wijaya`,
    description: project.description,
  }
}

export default function ProjectDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
