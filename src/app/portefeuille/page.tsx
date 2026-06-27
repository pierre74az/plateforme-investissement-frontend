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
  offering: { id: string; name: string; sector: string; pricePerShare: number; riskLevel: string }
}

const riskColor: Record<string, string> = {
  Faible: 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]',
  Moyen: 'bg-amber-50 text-amber-800 border border-amber-200',
  Élevé: 'bg-red-50 text-red-800 border border-red-200',
}

const sectorColor: Record<string, string> = {
  Technologie: '#3B82F6', Agriculture: '#16A34A', Énergie: '#F59E0B',
  Finance: '#8B5CF6', Santé: '#EF4444',
}

export default function PortefeuillePage() {
  const router = useRouter()
  const [subs, setSubs] = useState<Sub[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/auth/login'); return }
    fetch(`${API}/subscriptions/me`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setSubs(Array.isArray(data) ? data : (data.data || [])); setLoading(false) })
      .catch(() => setLoading(false))
  }, [router])

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#BBF7D0] border-t-[#15803D] rounded-full animate-spin"></div>
    </div>
  )

  const totalInvesti = subs.reduce((acc, s) => acc + s.totalAmount, 0)
  const totalActions = subs.reduce((acc, s) => acc + s.shares, 0)

  // Regrouper par offre pour le résumé
  const byOffering = subs.reduce((acc: Record<string, { name: string; sector: string; shares: number; total: number }>, s) => {
    const key = s.offering.id
    if (!acc[key]) acc[key] = { name: s.offering.name, sector: s.offering.sector, shares: 0, total: 0 }
    acc[key].shares += s.shares
    acc[key].total += s.totalAmount
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-8">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Mon portefeuille</h1>
          <p className="text-slate-500 text-sm">{subs.length} souscription(s) au total</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-slate-100 rounded-2xl p-5" style={{ borderLeftWidth: '3px', borderLeftColor: '#16A34A' }}>
            <p className="text-xs text-slate-500 mb-2">Total investi</p>
            <p className="text-xl font-semibold text-slate-900">{totalInvesti.toLocaleString()} FCFA</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-5" style={{ borderLeftWidth: '3px', borderLeftColor: '#3B82F6' }}>
            <p className="text-xs text-slate-500 mb-2">Nombre d&apos;actions</p>
            <p className="text-xl font-semibold text-slate-900">{totalActions.toLocaleString()}</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-5" style={{ borderLeftWidth: '3px', borderLeftColor: '#8B5CF6' }}>
            <p className="text-xs text-slate-500 mb-2">Entreprises</p>
            <p className="text-xl font-semibold text-slate-900">{Object.keys(byOffering).length}</p>
          </div>
        </div>

        {subs.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center">
            <p className="text-3xl mb-3">📭</p>
            <p className="text-slate-600 font-medium mb-1">Votre portefeuille est vide</p>
            <p className="text-slate-400 text-sm mb-5">Commencez par souscrire à une offre du catalogue</p>
            <Link href="/catalogue"
              className="inline-block bg-[#15803D] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#166534] transition-all active:scale-[.97]">
              Explorer le catalogue →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Répartition par entreprise */}
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800 text-sm">Répartition par entreprise</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {Object.entries(byOffering).map(([id, data]) => {
                  const pct = totalInvesti > 0 ? Math.round((data.total / totalInvesti) * 100) : 0
                  return (
                    <div key={id} className="px-6 py-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ background: sectorColor[data.sector] || '#6B7280' }} />
                          <span className="text-sm font-medium text-slate-800">{data.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-[#15803D]">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: sectorColor[data.sector] || '#16A34A' }} />
                      </div>
                      <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                        <span>{data.shares} actions</span>
                        <span>{data.total.toLocaleString()} FCFA</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Liste des souscriptions */}
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800 text-sm">Toutes les souscriptions</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {subs.map(s => (
                  <div key={s.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{s.offering.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{s.offering.sector} · {s.shares} actions</p>
                        <p className="text-xs text-slate-400">{new Date(s.createdAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{s.totalAmount.toLocaleString()} FCFA</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${riskColor[s.offering.riskLevel] || riskColor['Moyen']}`}>
                          {s.offering.riskLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
