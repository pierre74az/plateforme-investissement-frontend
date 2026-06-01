'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { clearAuth } from '@/lib/auth'

const PUBLIC_PATHS = ['/', '/about', '/faq', '/contact']

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
    else setUser(null)
  }, [pathname])

  if (!mounted) return null

  const isPublicPage = PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/auth')
  const isAdmin = user?.role === 'ADMIN'
  const logout = () => { clearAuth(); router.push('/') }

  if (isPublicPage) {
    return (
      <nav className="border-b bg-white px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="font-bold text-blue-600 text-xl">💼 InvestBF</Link>
        <div className="flex items-center gap-6 text-sm">
          {[
            { href: '/', label: 'Accueil' },
            { href: '/about', label: 'À propos' },
            { href: '/faq', label: 'FAQ' },
            { href: '/contact', label: 'Contact' },
          ].map(l => (
            <Link key={l.href} href={l.href}
              className={`hover:text-blue-600 transition ${pathname === l.href ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <Link href={isAdmin ? '/admin' : '/dashboard'}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
              Mon espace →
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="text-gray-700 font-medium hover:text-blue-600">Connexion</Link>
              <Link href="/auth/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </nav>
    )
  }

  if (!user) return null

  const navLinks = isAdmin ? [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/kyc', label: 'KYC' },
    { href: '/admin/utilisateurs', label: 'Investisseurs' },
    { href: '/admin/offres/nouveau', label: '+ Offre' },
  ] : [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/catalogue', label: 'Catalogue' },
    { href: '/portefeuille', label: 'Portefeuille' },
    { href: '/kyc', label: 'Mon KYC' },
    { href: '/profil', label: 'Profil' },
  ]

  return (
    <nav className="bg-white border-b px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      <Link href={isAdmin ? '/admin' : '/dashboard'} className="font-bold text-blue-600 text-lg">
        💼 InvestBF {isAdmin && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-1">Admin</span>}
      </Link>
      <div className="flex items-center gap-5 text-sm">
        {navLinks.map(l => (
          <Link key={l.href} href={l.href}
            className={`hover:text-blue-600 transition ${pathname === l.href ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
            {l.label}
          </Link>
        ))}
        <div className="flex items-center gap-3 ml-2 pl-3 border-l">
          <span className="text-gray-700 font-medium">{user.firstName}</span>
          <button onClick={logout} className="text-red-500 hover:underline text-xs">Déconnexion</button>
        </div>
      </div>
    </nav>
  )
}
