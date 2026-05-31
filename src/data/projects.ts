import type { Project } from '@/types'

export const projects: Project[] = [
  {
    id: '1',
    slug: 'petra-civil-expo-2026',
    number: '01',
    title: 'PETRA CIVIL EXPO 2026',
    description:
      'Real-time event platform supporting registrations, live games, attendance tracking, and administrative operations.',

    longDescription:
      'Engineered a full-stack event platform for Petra Civil Expo 2026, serving hundreds of participants through registration systems, real-time games, and centralized administration tools. Built registration workflows with Google Authentication, QR-based attendance, participant management, and automated reporting. Designed event-driven systems using Laravel Events and Ably WebSockets to power live leaderboards, synchronized game phases, and real-time resource updates. Developed infrastructure capable of supporting 200+ concurrent users for mini-games and 100+ concurrent users for rally game sessions while maintaining responsive user experiences.',

    thumbnail: '/projects/pce-2026.jpg',

    images: [
      '/assets/projects/pce/hero.png',
      '/assets/projects/pce/leaderboard.png',
      '/assets/projects/pce/tap-tap.png',
      '/assets/projects/pce/rally.png',
      '/assets/projects/pce/rally-qr.png',
      '/assets/projects/pce/dashboard.png',
    ],

    techStack: [
      'LARAVEL',
      'LIVEWIRE',
      'ALPINE JS',
      'MYSQL',
      'ABLY',
      'TAILWINDCSS',
    ],

    category: 'FULLSTACK',
    year: '2026',
    role: 'IT Coordinator',
    liveUrl: 'https://pce.petra.ac.id/',
    githubUrl: '#',
  },

  {
    id: '2',
    slug: 'innofashion-show-8',
    number: '02',
    title: 'INNOFASHION SHOW 8',
    description:
      'Full-stack event management platform with QR ticketing, RBAC, dynamic forms, and authentication systems.',

    longDescription:
      'Developed the core backend and frontend architecture for Innofashion Show 8. Designed REST APIs using Laravel Sanctum and implemented Permission-Based Access Control (PBAC) with Spatie to support multiple divisions and administrative roles. Built dynamic form builders, QR-based attendance validation, participant reporting, and automated ticket generation delivered through email and user dashboards. Developed frontend services using a Backend-for-Frontend pattern in Next.js, integrated Google Authentication with NextAuth and Laravel Socialite, and deployed both Laravel APIs and Next.js applications through cPanel and Phusion Passenger.',

    thumbnail: '/projects/innofashion-8.jpg',

    images: [
      '/assets/projects/innofashion/hero.png',
      '/assets/projects/innofashion/user-dashboard.png',
      '/assets/projects/innofashion/pbac.png',
      '/assets/projects/innofashion/qr-generator.png',
      '/assets/projects/innofashion/qr-event.png',
      '/assets/projects/innofashion/form-builder.png',
      '/assets/projects/innofashion/evaluation-form.png',
      '/assets/projects/innofashion/admin-dashboard.png',
    ],

    techStack: [
      'NEXT.JS',
      'LARAVEL',
      'MYSQL',
      'SANCTUM',
      'SPATIE',
      'NEXTAUTH',
    ],

    category: 'FULLSTACK',
    year: '2026',
    role: 'Vice IT Coordinator',
    liveUrl: 'https://innofashionshow.petra.ac.id/',
    githubUrl: '#',
  },
  {
    id: '3',
    slug: 'bem-petra-platform',
    number: '03',
    title: 'BEM PETRA PLATFORM',

    description:
      'Centralized administration platform powering multiple BEM Petra digital services.',

    longDescription:
      'Developed a centralized administration platform used to manage multiple BEM Petra services, including BEM Petra Store and BEM Intern. Built a role-based access control system with dynamic permissions and route protection, allowing different divisions to manage their respective resources securely. Integrated multiple backend APIs into a unified admin experience, simplifying operational workflows across the organization. Additionally contributed to the BEM Intern website development using Next.js, implementing modern frontend architecture, GSAP-powered animations, and SVG-based interactions.',

    thumbnail: '/projects/bem-admin.jpg',

    images: [
      '/assets/projects/bem/intern-hero.png',
    ],

    techStack: [
      'NEXT.JS',
      'LARAVEL',
      'MYSQL',
      'GSAP',
      'TAILWINDCSS',
      'RBAC',
    ],

    category: 'FULLSTACK',

    year: '2025',

    role: 'Fullstack Developer',

    liveUrl: '#',
    githubUrl: '#',
  }
]