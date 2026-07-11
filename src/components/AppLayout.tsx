'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { clearAuth } from '@/lib/auth'
import {
  LayoutDashboard,
  Compass,
  Briefcase,
  History,
  FileCheck,
  User,
  LogOut,
  Menu,
  X,
  Wallet,
  ShieldCheck,
  AlertTriangle,
  BadgeAlert,
  ChevronRight,
  TrendingUp,
  Building2,
  Users,
  PlusCircle,
  BookOpen,
  HelpCircle,
  Mail,
  Home
} from 'lucide-react'

const PUBLIC_PATHS = ['/', '/about', '/faq', '/contact']

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (u) {
      setUser(JSON.parse(u))
    } else {
      setUser(null)
    }

    if (token) {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      fetch(`${API}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (res.ok) return res.json()
        throw new Error('Unauthorized')
      })
      .then(freshUser => {
        setUser(freshUser)
        localStorage.setItem('user', JSON.stringify(freshUser))
      })
      .catch(() => {})
    }

    setMobileMenuOpen(false) // Fermer le menu mobile lors d'un changement de page
  }, [pathname])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  const isPublicPage = PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/auth')
  const isAdmin = user?.role === 'ADMIN'

  const logout = () => {
    clearAuth()
    setUser(null)
    router.push('/')
  }

  // Navigation Links
  const userLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/catalogue', label: 'Catalogue', icon: Compass },
    { href: '/portefeuille', label: 'Portefeuille', icon: Briefcase },
    { href: '/transactions', label: 'Transactions', icon: History },
    { href: '/kyc', label: 'Mon KYC', icon: FileCheck },
    { href: '/profil', label: 'Profil', icon: User },
  ]

  const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/kyc', label: 'Validation KYC', icon: ShieldCheck },
    { href: '/admin/utilisateurs', label: 'Investisseurs', icon: Users },
    { href: '/admin/offres', label: 'Offres', icon: Building2 },
    { href: '/admin/offres/nouveau', label: 'Créer une Offre', icon: PlusCircle },
  ]

  const publicLinks = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/about', label: 'À propos', icon: BookOpen },
    { href: '/faq', label: 'FAQ', icon: HelpCircle },
    { href: '/contact', label: 'Contact', icon: Mail },
  ]

  const activeLinks = isAdmin ? adminLinks : userLinks

  // Render Public Layout
  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        {/* Public Header */}
        <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-slate-900 text-xl tracking-tight">
            <span className="w-3.5 h-3.5 rounded-full bg-brand-600 shadow-sm inline-block"></span>
            InvestBF
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            {publicLinks.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={`transition-all font-medium py-1 ${
                  pathname === l.href
                    ? 'text-brand-700 border-b-2 border-brand-600'
                    : 'text-slate-500 hover:text-brand-600'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link
                href={isAdmin ? '/admin' : '/dashboard'}
                className="bg-brand-700 hover:bg-brand-800 text-white px-5 py-2.5 rounded-xl transition duration-300 font-semibold text-sm shadow hover:shadow-md hover:scale-[1.01] active:scale-[0.98] flex items-center gap-1.5"
              >
                Mon espace <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/login"
                  className="text-slate-600 hover:text-brand-700 transition font-semibold text-sm"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-brand-700 hover:bg-brand-800 text-white px-5 py-2.5 rounded-xl transition duration-300 font-semibold text-sm shadow hover:shadow-md hover:scale-[1.01] active:scale-[0.98]"
                >
                  S&apos;inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border-t border-slate-100 absolute top-[64px] left-0 right-0 z-40 p-6 flex flex-col gap-5 shadow-lg animate-in fade-in slide-in-from-top-4 duration-200">
            {publicLinks.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-base font-semibold px-4 py-2.5 rounded-xl transition-all ${
                  pathname === l.href
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="h-px bg-slate-100 my-2"></div>
            {user ? (
              <Link
                href={isAdmin ? '/admin' : '/dashboard'}
                className="bg-brand-700 hover:bg-brand-800 text-white text-center py-3 rounded-xl transition font-semibold text-base shadow-sm"
              >
                Mon espace →
              </Link>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/auth/login"
                  className="text-slate-700 text-center py-3 rounded-xl hover:bg-slate-50 transition font-semibold text-base border border-slate-200"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-brand-700 hover:bg-brand-800 text-white text-center py-3 rounded-xl transition font-semibold text-base shadow-sm"
                >
                  S&apos;inscrire
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Main Content Area for Public */}
        <main className="flex-grow">{children}</main>

        {/* Public Footer */}
        <footer className="bg-slate-900 border-t border-slate-800 py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <span className="w-3 h-3 rounded-full bg-brand-500 inline-block"></span>
              InvestBF
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
              {publicLinks.map(l => (
                <Link key={l.href} href={l.href} className="hover:text-white transition">
                  {l.label}
                </Link>
              ))}
            </div>
            <span className="text-xs text-slate-500">© 2026 InvestBF — Tous droits réservés.</span>
          </div>
        </footer>
      </div>
    )
  }

  // Render Dashboard Layout for Connected Users / Admins
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-slate-100 z-30 shadow-2xs">
        {/* Brand */}
        <div className="h-20 px-6 border-b border-slate-50 flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full bg-brand-600 shadow-sm inline-block"></span>
          <span className="font-extrabold text-slate-900 text-xl tracking-tight">InvestBF</span>
          {isAdmin && (
            <span className="text-[10px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Admin
            </span>
          )}
        </div>

        {/* Investor mini-profile & Balance */}
        {!isAdmin && user && (
          <div className="p-4 mx-4 mt-6 bg-slate-50 border border-slate-100 rounded-2xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Solde disponible
            </p>
            <p className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-brand-600" />
              {user.balance?.toLocaleString() || 0} FCFA
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Statut KYC</span>
              <span
                className={`px-2 py-0.5 rounded-full font-bold ${
                  user.kycStatus === 'APPROVED'
                    ? 'bg-brand-100 text-brand-800'
                    : user.kycStatus === 'REJECTED'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {user.kycStatus === 'APPROVED' ? 'Vérifié' : 'Attente'}
              </span>
            </div>
          </div>
        )}

        {/* Sidebar Nav Links */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {activeLinks.map(l => {
            const Icon = l.icon
            const isActive = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-700 text-white shadow-sm shadow-brand-200/50'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {l.label}
              </Link>
            )
          })}
        </nav>

        {/* User profile details bottom */}
        <div className="p-4 border-t border-slate-50 bg-slate-50/50">
          <div className="flex items-center gap-3 px-2 py-1.5 mb-3">
            <div className="w-9 h-9 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center font-bold text-brand-700 text-sm">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-100 bg-white text-rose-600 hover:bg-rose-50 hover:border-rose-100 text-xs font-bold transition-all"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile Drawer (Sidebar on Mobile) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Drawer Panel */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white border-r border-slate-100 pt-5 pb-4 animate-in slide-in-from-left duration-200">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>

            {/* Brand */}
            <div className="flex flex-shrink-0 items-center px-6 gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-brand-600 shadow-sm inline-block"></span>
              <span className="font-extrabold text-slate-900 text-xl tracking-tight">InvestBF</span>
              {isAdmin && (
                <span className="text-[10px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Admin
                </span>
              )}
            </div>

            {/* Balance panel for investor on mobile */}
            {!isAdmin && user && (
              <div className="p-4 mx-6 mt-6 bg-slate-50 border border-slate-100 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Solde disponible
                </p>
                <p className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-brand-600" />
                  {user.balance?.toLocaleString() || 0} FCFA
                </p>
              </div>
            )}

            {/* Mobile Sidebar Nav */}
            <div className="mt-6 flex-1 h-0 overflow-y-auto px-4">
              <nav className="space-y-1">
                {activeLinks.map(l => {
                  const Icon = l.icon
                  const isActive = pathname === l.href
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={`group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                        isActive
                          ? 'bg-brand-700 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-500'}`} aria-hidden="true" />
                      {l.label}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Mobile profile footer */}
            <div className="flex flex-shrink-0 border-t border-slate-100 p-4 bg-slate-50/50">
              <div className="flex items-center gap-3 w-full">
                <div className="w-9 h-9 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center font-bold text-brand-700 text-sm">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl border border-slate-100 bg-white text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Column */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0 min-h-screen">
        {/* Mobile Header / Top bar */}
        <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-50 transition"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-extrabold text-slate-900 text-lg tracking-tight">InvestBF</span>
          </div>

          <div className="flex items-center gap-3">
            {!isAdmin && user && (
              <span className="text-xs font-bold bg-brand-50 text-brand-700 px-3 py-1.5 rounded-xl flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5" />
                {user.balance?.toLocaleString()} F
              </span>
            )}
            <Link
              href="/profil"
              className="w-8 h-8 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs"
            >
              {user?.firstName?.[0]}
            </Link>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
          {children}
        </main>

        {/* Mobile Bottom Navigation for Quick Actions (Investor Only) */}
        {!isAdmin && user && (
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 py-2.5 flex justify-around items-center z-40 shadow-lg">
            {[
              { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { href: '/catalogue', label: 'Catalogue', icon: Compass },
              { href: '/portefeuille', label: 'Portefeuille', icon: Briefcase },
              { href: '/profil', label: 'Profil', icon: User },
            ].map(l => {
              const Icon = l.icon
              const isActive = pathname === l.href
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition ${
                    isActive ? 'text-brand-700 font-bold' : 'text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] tracking-tight">{l.label}</span>
                </Link>
              )
            })}
          </nav>
        )}
      </div>
    </div>
  )
}
