import type { Metadata } from 'next'
import { Anton, Space_Mono } from 'next/font/google'
import './globals.css'
import { CursorGlow } from '@/components/ui/CursorGlow'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import PageTransition from '@/components/ui/PageTransition'

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Evan Portofolio',
  description: 'Clarence Evan Wijaya - Software Engineer Portfolio',
}

import { SmoothScroll } from '@/components/ui/SmoothScroll'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${anton.variable} ${spaceMono.variable} antialiased min-h-screen flex flex-col font-mono selection:bg-teal selection:text-black`}>
        <SmoothScroll>
          <CursorGlow />
          <PageTransition />
          <Navbar />
          <main className="flex-grow flex flex-col z-10 relative">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}
