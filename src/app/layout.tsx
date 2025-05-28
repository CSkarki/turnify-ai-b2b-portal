import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReLoop AI B2B Return Portal',
  description: 'B2B Return Management Portal for ReLoop AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
