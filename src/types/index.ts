export interface Project {
  id: string
  slug: string
  number: string
  title: string
  description: string
  longDescription: string
  thumbnail: string
  images: string[]
  techStack: string[]
  category: 'FULLSTACK' | 'MOBILE' | 'BACKEND' | 'FRONTEND'
  year: string
  role: string
  liveUrl?: string
  githubUrl: string
}

export interface TechBadge {
  name: string
  iconSlug: string
  brandColor: string
  position: {
    top: string
    left: string
  }
  depth: number
}

export interface SocialLink {
  platform: string
  url: string
  icon: 'github' | 'linkedin' | 'instagram' | 'email'
}
