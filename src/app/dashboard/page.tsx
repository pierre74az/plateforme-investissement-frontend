'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

type Sub = {
  id: string
  shares: number
  totalAmount: number
  createdAt: string
  offering: { id: string; name: string; sector: string; riskLevel: string }
}

type Offering = {
  id: string
  name: string
  sector: string
  pricePerShare: number
  riskLevel: string
  soldShares: number
  totalShares: number
}

const riskColor: Record<string, string> = {
  Faible: 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]',
  Moyen: 'bg-amber-50 text-amber-800 border border-amber-200',
  Élevé: 'bg-red-50 text-red-800 border border-red-200',
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [subs, setSubs] = useState<Sub[]>([])
  const [offers, setOffers] = useState<Offering[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (!token || !u) { router.push('/auth/login'); return }
    const parsed = JSON.parse(u)
    setUser(parsed)
    const headers = { 'Authorization': `Bearer ${token}` }
    Promise.all([
      fetch(`${API}/subscriptions/me`, { headers }).then(r => r.json()),
      fetch(`${API}/offerings`).then(r => r.json()),
    ]).then(([subsData, offersData]) => {
      const subsArr = Array.isArray(subsData) ? subsData : (subsData.data || [])
      setSubs(subsArr)
      setOffers(Array.isArray(offersData) ? offersData.slice(0, 3) : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [router])

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#BBF7D0] border-t-[#15803D] rounded-full animate-spin"></div>
    </div>
  )

  const totalInvesti = subs.reduce((acc, s) => acc + s.totalAmount, 0)
  const totalActions = subs.reduce((acc, s) => acc + s.shares, 0)

  const kycBadge: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'KYC en attente', color: 'bg-amber-50 text-amber-800 border border-amber-200' },
    APPROVED: { label: 'KYC validé', color: 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]' },
    REJECTED: { label: 'KYC rejeté', color: 'bg-red-50 text-red-800 border border-red-200' },
  }
  const kyc = kycBadge[user?.kycStatus] || kycBadge['PENDING']

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Bonjour, {user?.firstName} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">{user?.email}</p>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${kyc.color}`}>
            {kyc.label}
          </span>
        </div>

        {/* Alerte KYC */}
        {user?.kycStatus !== 'APPROVED' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex justify-between items-center mb-8">
            <div>
              <p className="font-medium text-amber-800 text-sm">Complétez votre vérification KYC</p>
              <p className="text-amber-600 text-xs mt-0.5">Validez votre identité pour pouvoir souscrire aux offres</p>
            </div>
            <Link href="/kyc"
              className="bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-amber-600 transition active:scale-[.97] flex-shrink-0">
              Compléter →
            </Link>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Solde disponible', value: `${user?.balance?.toLocaleString() || 0} FCFA`, accent: '#16A34A', badge: 'Actif', badgeColor: 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]' },
            { label: 'Total investi', value: `${totalInvesti.toLocaleString()} FCFA`, accent: '#F59E0B', badge: `${subs.length} souscriptions`, badgeColor: 'bg-amber-50 text-amber-800 border border-amber-200' },
            { label: 'Nombre d\'actions', value: totalActions.toLocaleString(), accent: '#3B82F6', badge: `${new Set(subs.map(s => s.offering.id)).size} offres`, badgeColor: 'bg-blue-50 text-blue-800 border border-blue-200' },
            { label: 'Portefeuille', value: `${subs.length} position${subs.length > 1 ? 's' : ''}`, accent: '#8B5CF6', badge: 'Actif', badgeColor: 'bg-purple-50 text-purple-800 border border-purple-200' },
          ].map(k => (
            <div key={k.label}
              className="bg-white border border-slate-100 rounded-2xl p-5"
              style={{ borderLeftWidth: '3px', borderLeftColor: k.accent }}>
              <p className="text-xs text-slate-500 mb-2">{k.label}</p>
              <p className="text-xl font-semibold text-slate-900 mb-2">{k.value}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${k.badgeColor}`}>{k.badge}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Dernières transactions */}
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">Dernières transactions</h3>
              <Link href="/portefeuille" className="text-xs text-[#15803D] hover:underline">Voir tout</Link>
            </div>
            {subs.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-slate-400 text-sm">Aucune transaction</p>
                <Link href="/catalogue"
                  className="inline-block mt-3 text-xs text-[#15803D] font-medium hover:underline">
                  Explorer le catalogue →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {subs.slice(0, 4).map(s => (
                  <div key={s.id} className="flex justify-between items-center px-6 py-3.5 hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{s.offering.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {s.shares} actions · {new Date(s.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-500">−{s.totalAmount.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">FCFA</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Opportunités */}
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">Opportunités du moment</h3>
              <Link href="/catalogue" className="text-xs text-[#15803D] hover:underline">Voir tout</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {offers.map(o => (
                <Link href={`/catalogue/${o.id}`} key={o.id}>
                  <div className="flex justify-between items-center px-6 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{o.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{o.sector}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className="text-sm font-semibold text-[#15803D]">{o.pricePerShare.toLocaleString()} FCFA</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${riskColor[o.riskLevel] || riskColor['Moyen']}`}>
                        {o.riskLevel}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
