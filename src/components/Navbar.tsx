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
    setUser(u ? JSON.parse(u) : null)
  }, [pathname])

  if (!mounted) return null

  const isPublicPage = PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/auth')
  const isAdmin = user?.role === 'ADMIN'
  const logout = () => { clearAuth(); router.push('/') }

  if (isPublicPage) {
    return (
      <nav className="bg-white border-b-2 border-[#16A34A] px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900 text-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] inline-block"></span>
          InvestBF
        </Link>
        <div className="flex items-center gap-6 text-sm">
          {[
            { href: '/', label: 'Accueil' },
            { href: '/about', label: 'À propos' },
            { href: '/faq', label: 'FAQ' },
            { href: '/contact', label: 'Contact' },
          ].map(l => (
            <Link key={l.href} href={l.href}
              className={`transition-colors font-medium ${
                pathname === l.href
                  ? 'text-[#15803D] border-b-2 border-[#16A34A] pb-0.5'
                  : 'text-slate-500 hover:text-[#15803D]'
              }`}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <Link href={isAdmin ? '/admin' : '/dashboard'}
              className="bg-[#15803D] text-white px-4 py-2 rounded-lg hover:bg-[#166534] transition font-medium text-sm active:scale-[.97]">
              Mon espace →
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="text-slate-600 hover:text-[#15803D] transition text-sm font-medium">
                Connexion
              </Link>
              <Link href="/auth/register"
                className="bg-[#15803D] text-white px-4 py-2 rounded-lg hover:bg-[#166534] transition font-medium text-sm active:scale-[.97]">
                S&apos;inscrire
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
    { href: '/admin/offres', label: 'Offres' },
  ] : [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/catalogue', label: 'Catalogue' },
    { href: '/portefeuille', label: 'Portefeuille' },
    { href: '/transactions', label: 'Transactions' },
    { href: '/kyc', label: 'Mon KYC' },
    { href: '/profil', label: 'Profil' },
  ]

  return (
    <nav className="bg-white border-b border-slate-100 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      <Link href={isAdmin ? '/admin' : '/dashboard'}
        className="flex items-center gap-2 font-semibold text-slate-900 text-base">
        <span className="w-2 h-2 rounded-full bg-[#16A34A] inline-block"></span>
        InvestBF
        {isAdmin && (
          <span className="text-xs bg-[#F0FDF4] text-[#15803D] px-2 py-0.5 rounded-full font-medium ml-1">
            Admin
          </span>
        )}
      </Link>
      <div className="flex items-center gap-5 text-sm">
        {navLinks.map(l => (
          <Link key={l.href} href={l.href}
            className={`transition-colors ${
              pathname === l.href
                ? 'text-[#15803D] font-medium'
                : 'text-slate-500 hover:text-slate-800'
            }`}>
            {l.label}
          </Link>
        ))}
        <div className="flex items-center gap-3 ml-2 pl-3 border-l border-slate-200">
          <span className="text-slate-800 font-medium text-sm">{user.firstName}</span>
          <button onClick={logout} className="text-red-400 hover:text-red-600 text-xs transition">
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  )
}
