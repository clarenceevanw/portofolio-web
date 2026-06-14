import type { Project } from '@/types'

export const projects: Project[] = [
  {
    id: '1',
    slug: 'banyuin',
    number: '01',
    title: 'BANYUIN',
    description:
    'IoT-powered water quality monitoring SaaS with real-time analytics, mobile notifications, and subscription management.',
    longDescription:
    'BanyuIn is an end-to-end IoT platform designed to monitor pond water quality in real time. The system combines ESP32-based hardware, a Golang backend, and a Flutter mobile application to provide continuous pH monitoring, anomaly detection, and automated alerts for fish farmers. Built using Clean Architecture principles, the platform supports multi-pond management, device provisioning, real-time data streaming through Server-Sent Events (SSE), PDF report generation, and subscription-based device activation. An integrated payment gateway and Firebase Cloud Messaging enable seamless billing and early warning notifications, creating a complete SaaS ecosystem for precision aquaculture monitoring.',
    thumbnail: '/assets/projects/banyuin/thumbnail.png',
    images: [
      '/assets/projects/banyuin/dashboard.jpeg',
      '/assets/projects/banyuin/splash.jpeg',
      '/assets/projects/banyuin/notif-history.jpeg',
      '/assets/projects/banyuin/early-warning-notif.jpeg',
      '/assets/projects/banyuin/login.jpeg',
      '/assets/projects/banyuin/pond.jpeg',
      '/assets/projects/banyuin/pond-detail.jpeg',
      '/assets/projects/banyuin/report.jpeg',
      '/assets/projects/banyuin/weekly-report.jpeg',
      '/assets/projects/banyuin/subscription.jpeg',
      '/assets/projects/banyuin/payment.jpeg',
      '/assets/projects/banyuin/payment-instruction.jpeg',
      '/assets/projects/banyuin/payment-success.jpeg',
    ],

    techStack: [
    'GOLANG',
    'FLUTTER',
    'ESP32',
    'MYSQL',
    'SSE',
    'FCM',
    ],
    category: 'MOBILE',
    year: '2026',

    role: 'Software Engineer',
    liveUrl: '#',
    githubUrl: 'https://github.com/orgs/BanyuIn/repositories',

    contributions: [
      'Designed and developed the complete end-to-end IoT ecosystem as a solo project',
      'Built ESP32 integration for real-time pH sensor data collection and transmission',
      'Architected the backend using Golang Clean Architecture with Domain, Repository, Service, and Handler layers',
      'Implemented Server-Sent Events (SSE) for real-time sensor monitoring in the mobile application',
      'Developed the Flutter mobile application using BLoC/Cubit state management and dependency injection',
      'Implemented anomaly detection and Firebase Cloud Messaging (FCM) based early warning notifications',
      'Built subscription management workflows and integrated midtrans payment gateway services for device activation',
      'Developed data visualization and multi-pond management features'
    ]
  },

  {
    id: '2',
    slug: 'petra-civil-expo-2026',
    number: '02',
    title: 'PETRA CIVIL EXPO 2026',
    description:
      'Real-time event platform supporting registrations, live games, attendance tracking, and administrative operations.',
    longDescription:
      'Engineered a full-stack event platform for Petra Civil Expo 2026, serving hundreds of participants through registration systems, real-time games, and centralized administration tools. Built registration workflows with Google Authentication, QR-based attendance, participant management, and automated reporting. Designed event-driven systems using Laravel Events and Ably WebSockets to power live leaderboards, synchronized game phases, and real-time resource updates. Developed infrastructure capable of supporting 200+ concurrent users for mini-games and 100+ concurrent users for rally game sessions while maintaining responsive user experiences.',
    thumbnail: '/assets/projects/pce/hero.png',
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
    githubUrl: 'https://github.com/orgs/PCE-26/repositories',
    contributions: [
      'Architected the database design and registration workflow for the event platform',
      'Implemented auto-save registration drafts using Laravel Livewire and database persistence',
      'Implemented Excel export functionality for participant data',
      'Engineered real-time game infrastructure using Laravel Events and Ably WebSockets',
      'Built batch-based click processing, emoji broadcasting, and live leaderboard synchronization',
      'Developed Rally Games modules and event management functionality with QR-based attendance tracking and realtime update systems',
      'Managed production deployment and coordinated a team of 4 developers'
    ]
  },

  {
    id: '3',
    slug: 'innofashion-show-8',
    number: '03',
    title: 'INNOFASHION SHOW 8',
    description:
      'Full-stack event management platform with QR ticketing, RBAC, dynamic forms, and authentication systems.',
    longDescription:
      'Developed the core backend and frontend architecture for Innofashion Show 8. Designed REST APIs using Laravel Sanctum and implemented Permission-Based Access Control (PBAC) with Spatie to support multiple divisions and administrative roles. Built dynamic form builders, QR-based attendance validation, participant reporting, and automated ticket generation delivered through email and user dashboards. Developed frontend services using a Backend-for-Frontend pattern in Next.js, integrated Google Authentication with NextAuth and Laravel Socialite, and deployed both Laravel APIs and Next.js applications through cPanel and Phusion Passenger.',
    thumbnail: '/assets/projects/innofashion/hero.png',
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
    githubUrl: 'https://github.com/orgs/innofashion-8/repositories',
    contributions: [
      'Architected the database schema and backend API structure using Laravel',
      'Implemented Permission-Based Access Control (PBAC) using Laravel Spatie',
      'Developed core admin features including registrations, QR attendance, and evaluation builders',
      'Developed form builders for dynamic evaluation forms and participant data collection',
      'Implemented Excel export functionality for registration and user reports',
      'Implemented email-based registration confirmation and QR code generation for event check-in',
      'Integrated Google Authentication using NextAuth and Laravel Socialite',
      'Developed high-impact frontend experiences using Next.js and GSAP, including Hero, About, and Competition sections',
      'Implemented ScrollTrigger-powered animations and pinned scrolling interactions to enhance user engagement',
      'Reviewed, refined, and integrated team contributions to ensure code quality and project consistency',
      'Managed production deployment for both frontend and backend services',
      'Led and coordinated a team of 3 developers'
    ]
  },
  {
    id: '4',
    slug: 'gudang-pintar',
    number: '04',
    title: 'GUDANGPINTAR',
    description:
      'Multi-tenant warehouse management SaaS with inventory tracking, subscriptions, and QR-based operations.',
    longDescription:
      'GudangPintar is a warehouse management SaaS platform designed to help warehouse operators manage inventory, storage locations, transactions, and operational workflows. The platform supports multiple user roles including Super Admins, Warehouse Administrators, and Warehouse Partners, each with dedicated access controls and dashboards. Features include inventory management, room allocation, transaction tracking, QR-based batch identification, item scanning, and subscription billing through Midtrans payment gateway. The platform was developed collaboratively using modern web technologies with a focus on scalability, maintainability, and operational efficiency.',
    thumbnail: '/assets/projects/gudang-pintar/hero.png',
    images: [
      '/assets/projects/gudang-pintar/hero.png',
      '/assets/projects/gudang-pintar/dashboard.png',
      '/assets/projects/gudang-pintar/midtrans.png',
      '/assets/projects/gudang-pintar/qr-scanner.png',
      '/assets/projects/gudang-pintar/qr-batch.png',
      '/assets/projects/gudang-pintar/batch-details.png',
      '/assets/projects/gudang-pintar/barang.png',
      '/assets/projects/gudang-pintar/transaction.png',
    ],
    techStack: [
      'PHP',
      'MYSQL',
      'MIDTRANS',
      'THREE.JS',
      'GSAP',
    ],
    category: 'FULLSTACK',
    year: '2025',
    role: 'Fullstack Developer',
    liveUrl: '#',
    githubUrl: 'https://github.com/clarenceevanw/project-tekweb-inventaris-brang',
    contributions: [
      'Developed inventory, batch management, and warehouse transaction modules',
      'Implemented QR-based tracking systems for warehouse assets and inventory batches',
      'Integrated Midtrans subscription billing for SaaS renewal workflows',
      'Built supply and purchase transaction management features',
      'Managed GitHub-based collaboration through pull requests and issue tracking',
      'Coordinated development efforts across a team of 4 developers'
    ]
  },
  {
    id: '5',
    slug: 'bem-petra-platform',
    number: '05',
    title: 'BEM PETRA PLATFORM',
    description:
      'Centralized administration platform powering multiple BEM Petra digital services.',
    longDescription:
      'Developed a centralized administration platform used to manage multiple BEM Petra services, including BEM Petra Store and BEM Intern. Built a role-based access control system with dynamic permissions and route protection, allowing different divisions to manage their respective resources securely. Integrated multiple backend APIs into a unified admin experience, simplifying operational workflows across the organization. Additionally contributed to the BEM Intern website development using Next.js, implementing modern frontend architecture, GSAP-powered animations, and SVG-based interactions.',
    thumbnail: '/assets/projects/bem/intern-hero.png',
    images: [
      '/assets/projects/bem/intern-hero.png',
      '/assets/projects/bem/intern-dep.png',
      '/assets/projects/bem/intern-berkas.png',
      '/assets/projects/bem/admin.png',
      '/assets/projects/bem/admin-dashboard.png',
      '/assets/projects/bem/admin-bps-transaction.png',
      '/assets/projects/bem/admin-bps-products.png',
      '/assets/projects/bem/admin-bps-product.png',
      '/assets/projects/bem/admin-bps-product-detail.png',
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
    githubUrl: 'https://github.com/clarenceevanw/',
    contributions: [
      'Developed a centralized administration platform with dynamic RBAC',
      'Integrated multiple backend APIs into a unified dashboard',
      'Built BEM Intern frontend using Next.js and GSAP',
      'Implemented SVG-based interactions for improved UX'
    ]
  },
  {
    id: '6',
    slug: 'youthentic-perfume',
    number: '06',
    title: 'YOUTHENTIC PERFUME',
    description:
      'Brand website and product catalog platform developed for a local perfume business.',
    longDescription:
      'Developed a modern product showcase and landing page website for Youthentic Perfume using React and Framer Motion. Built interactive product catalog experiences allowing visitors to browse product details, pricing information, and seamlessly navigate to external marketplaces including Shopee, Tokopedia, and TikTok Shop. Focused on responsive design, smooth animations, and user experience to help strengthen the brand’s online presence and product discoverability.',
    thumbnail: '/assets/projects/youthentic/hero.png',
    images: [
      '/assets/projects/youthentic/hero.png',
      '/assets/projects/youthentic/about.png',
      '/assets/projects/youthentic/product.png',
    ],
    techStack: [
      'REACT',
      'FRAMER MOTION',
      'TAILWINDCSS',
    ],
    category: 'FRONTEND',
    year: '2025',
    role: 'Frontend Developer',
    liveUrl: 'https://youthentic.vercel.app/',
    githubUrl: 'https://github.com/clarenceevanw/youthentic',
    contributions: [
      'Developed responsive landing pages using React and TailwindCSS',
      'Implemented smooth scroll and product animations using Framer Motion',
      'Built interactive product catalog with external marketplace routing',
      'Optimized frontend performance and accessibility'
    ]
  }
]