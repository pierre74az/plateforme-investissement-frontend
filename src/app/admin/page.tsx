'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

type Stats = {
  totalInvestors: number
  kycPending: number
  kycApproved: number
  kycRejected: number
  totalSubscriptions: number
  totalVolume: number
  activeOfferings: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (!token || !u) { router.push('/auth/login'); return }
    if (JSON.parse(u).role !== 'ADMIN') { router.push('/dashboard'); return }

    fetch(`${API}/users/stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [router])

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#BBF7D0] border-t-[#15803D] rounded-full animate-spin"></div>
    </div>
  )

  if (!stats) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-slate-400">Impossible de charger les statistiques</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-8">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Tableau de bord</h1>
          <p className="text-slate-500 text-sm">Vue d&apos;ensemble de la plateforme InvestBF</p>
        </div>

        {/* Alerte KYC en attente */}
        {stats.kycPending > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex justify-between items-center mb-8">
            <div>
              <p className="font-medium text-amber-800 text-sm">
                {stats.kycPending} dossier(s) KYC en attente de validation
              </p>
              <p className="text-amber-600 text-xs mt-0.5">
                Des investisseurs attendent la validation de leur identité
              </p>
            </div>
            <Link href="/admin/kyc"
              className="bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-amber-600 transition active:scale-[.97] flex-shrink-0">
              Traiter →
            </Link>
          </div>
        )}

        {/* KPIs principaux */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: 'Investisseurs inscrits',
              value: stats.totalInvestors,
              icon: '👥',
              accent: '#16A34A',
              badge: 'Total',
              badgeColor: 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]',
            },
            {
              label: 'Souscriptions réalisées',
              value: stats.totalSubscriptions,
              icon: '📋',
              accent: '#3B82F6',
              badge: 'Paiements Stripe',
              badgeColor: 'bg-blue-50 text-blue-800 border border-blue-200',
            },
            {
              label: 'Volume levé',
              value: `${stats.totalVolume.toLocaleString()} FCFA`,
              icon: '💰',
              accent: '#F59E0B',
              badge: 'Cumulé',
              badgeColor: 'bg-amber-50 text-amber-800 border border-amber-200',
            },
            {
              label: 'Offres actives',
              value: stats.activeOfferings,
              icon: '📈',
              accent: '#8B5CF6',
              badge: 'En cours',
              badgeColor: 'bg-purple-50 text-purple-800 border border-purple-200',
            },
          ].map(k => (
            <div key={k.label}
              className="bg-white border border-slate-100 rounded-2xl p-5"
              style={{ borderLeftWidth: '3px', borderLeftColor: k.accent }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-500">{k.label}</p>
                <span className="text-xl">{k.icon}</span>
              </div>
              <p className="text-xl font-semibold text-slate-900 mb-2">{k.value}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${k.badgeColor}`}>
                {k.badge}
              </span>
            </div>
          ))}
        </div>

        {/* KYC détail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div className="bg-white border border-slate-100 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-800 text-sm mb-5">Statut des dossiers KYC</h3>
            <div className="space-y-4">
              {[
                { label: 'Validés', value: stats.kycApproved, color: '#16A34A', bg: 'bg-[#F0FDF4]', text: 'text-[#166534]' },
                { label: 'En attente', value: stats.kycPending, color: '#F59E0B', bg: 'bg-amber-50', text: 'text-amber-800' },
                { label: 'Rejetés', value: stats.kycRejected, color: '#EF4444', bg: 'bg-red-50', text: 'text-red-800' },
              ].map(k => {
                const total = stats.kycApproved + stats.kycPending + stats.kycRejected
                const pct = total > 0 ? Math.round((k.value / total) * 100) : 0
                return (
                  <div key={k.label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm text-slate-600">{k.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${k.bg} ${k.text}`}>
                          {k.value} dossier(s)
                        </span>
                        <span className="text-xs text-slate-400">{pct}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: k.color }} />
                    </div>
                  </div>
                )
              })}
            </div>
            <Link href="/admin/kyc"
              className="inline-block mt-5 text-xs text-[#15803D] font-medium hover:underline">
              Gérer les dossiers KYC →
            </Link>
          </div>

          {/* Accès rapides */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-800 text-sm mb-5">Accès rapides</h3>
            <div className="space-y-3">
              {[
                { href: '/admin/kyc', icon: '🪪', label: 'Valider les dossiers KYC', desc: `${stats.kycPending} en attente`, color: 'hover:border-amber-200 hover:bg-amber-50' },
                { href: '/admin/utilisateurs', icon: '👥', label: 'Gérer les investisseurs', desc: `${stats.totalInvestors} inscrits`, color: 'hover:border-[#BBF7D0] hover:bg-[#F0FDF4]' },
                { href: '/admin/offres/nouveau', icon: '➕', label: 'Créer une nouvelle offre', desc: `${stats.activeOfferings} offres actives`, color: 'hover:border-blue-200 hover:bg-blue-50' },
              ].map(a => (
                <Link key={a.href} href={a.href}
                  className={`flex items-center gap-4 p-4 border border-slate-100 rounded-xl transition-all ${a.color}`}>
                  <span className="text-2xl">{a.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{a.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{a.desc}</p>
                  </div>
                  <span className="ml-auto text-slate-300 text-sm">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
