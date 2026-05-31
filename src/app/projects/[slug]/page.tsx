import { projects } from '@/data/projects'
import { notFound } from 'next/navigation'
import ProjectDetailClient from '@/components/projects/ProjectDetailClient'

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()
  
  const currentIndex = projects.findIndex((p) => p.slug === slug)
  const nextProject = projects[(currentIndex + 1) % projects.length]
  
  return <ProjectDetailClient project={project} nextProject={nextProject} />
}
