import type { Metadata } from 'next'
import './globals.css'
import AppLayout from '@/components/AppLayout'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'InvestBF — Plateforme d\'investissement',
  description: 'Investissez dans les entreprises burkinabè. Accédez à des PME locales à fort potentiel depuis 10 000 FCFA.',
  keywords: ['investissement', 'Burkina Faso', 'PME', 'actions', 'financement participatif'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="antialiased font-sans">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  )
}
