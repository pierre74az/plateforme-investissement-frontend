'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Briefcase,
  TrendingUp,
  Building2,
  TrendingDown,
  Layers,
  ArrowRight,
  ShieldCheck,
  Award,
  Wallet
} from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

type Sub = {
  id: string
  shares: number
  totalAmount: number
  createdAt: string
  offering: { id: string; name: string; sector: string; pricePerShare: number; riskLevel: string }
}

const riskColor: Record<string, string> = {
  Faible: 'bg-emerald-50 text-emerald-800 border border-emerald-100',
  Moyen: 'bg-amber-50 text-amber-800 border border-amber-100',
  Élevé: 'bg-rose-50 text-rose-800 border border-rose-100',
}

const sectorColor: Record<string, string> = {
  Technologie: '#3B82F6',
  Agriculture: '#10B981',
  Énergie: '#F59E0B',
  Finance: '#8B5CF6',
  Santé: '#EF4444',
  Services: '#EC4899',
}

export default function PortefeuillePage() {
  const router = useRouter()
  const [subs, setSubs] = useState<Sub[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }
    fetch(`${API}/subscriptions/me`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        setSubs(Array.isArray(data) ? data : (data.data || []))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  const totalInvesti = subs.reduce((acc, s) => acc + s.totalAmount, 0)
  const totalActions = subs.reduce((acc, s) => acc + s.shares, 0)

  // Group by offering for company summary
  const byOffering = subs.reduce((acc: Record<string, { name: string; sector: string; shares: number; total: number }>, s) => {
    const key = s.offering.id
    if (!acc[key]) acc[key] = { name: s.offering.name, sector: s.offering.sector, shares: 0, total: 0 }
    acc[key].shares += s.shares
    acc[key].total += s.totalAmount
    return acc
  }, {})

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Mon portefeuille</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Analyse détaillée de vos actifs et investissements</p>
      </div>

      {subs.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm flex flex-col items-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mb-5 shadow-sm">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-slate-700 font-extrabold text-base mb-1.5">Votre portefeuille est vide</h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xs mx-auto mb-6">
            Découvrez nos entreprises partenaires en cours de financement et devenez actionnaire dès 10 000 FCFA.
          </p>
          <Link
            href="/catalogue"
            className="bg-brand-700 hover:bg-brand-900 text-white px-6 py-3 rounded-xl font-bold text-xs transition-all hover:scale-[1.01] active:scale-[0.98] shadow"
          >
            Découvrir les offres
          </Link>
        </div>
      ) : (
        <>
          {/* KPIs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { label: 'Total investi', value: `${totalInvesti.toLocaleString()} FCFA`, icon: TrendingUp, color: 'text-brand-700 bg-brand-50 border border-brand-100' },
              { label: 'Actions acquises', value: totalActions.toLocaleString(), icon: Award, color: 'text-blue-700 bg-blue-50 border border-blue-100' },
              { label: 'Entreprises en portefeuille', value: Object.keys(byOffering).length.toLocaleString(), icon: Building2, color: 'text-purple-700 bg-purple-50 border border-purple-100' },
            ].map((k, i) => {
              const Icon = k.icon
              return (
                <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${k.color} flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{k.label}</p>
                    <p className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">{k.value}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Allocation & History layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
            {/* Allocation Box */}
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="px-6 py-5 border-b border-slate-50">
                  <h3 className="font-extrabold text-slate-800 text-sm tracking-wider uppercase">Répartition par entreprise</h3>
                </div>
                <div className="divide-y divide-slate-50">
                  {Object.entries(byOffering).map(([id, data]) => {
                    const pct = totalInvesti > 0 ? Math.round((data.total / totalInvesti) * 100) : 0
                    return (
                      <div key={id} className="px-6 py-5 hover:bg-slate-50/20 transition-colors">
                        <div className="flex justify-between items-center mb-2.5">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: sectorColor[data.sector] || '#6B7280' } as React.CSSProperties}
                            />
                            <span className="text-sm font-bold text-slate-800">{data.name}</span>
                          </div>
                          <span className="text-xs font-bold text-brand-700">{pct}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: sectorColor[data.sector] || '#16A34A'
                            } as React.CSSProperties}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold mt-2">
                          <span>{data.shares} actions</span>
                          <span>{data.total.toLocaleString()} FCFA</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Subscriptions feed */}
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="px-6 py-5 border-b border-slate-50">
                  <h3 className="font-extrabold text-slate-800 text-sm tracking-wider uppercase">Historique des souscriptions</h3>
                </div>
                <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto hide-scrollbar">
                  {subs.map(s => (
                    <div key={s.id} className="px-6 py-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-rose-500">
                            <TrendingDown className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 truncate max-w-[150px] sm:max-w-xs">{s.offering.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                              {s.shares} actions · {new Date(s.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-extrabold text-slate-900">-{s.totalAmount.toLocaleString()} FCFA</p>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mt-1.5 inline-block ${riskColor[s.offering.riskLevel] || riskColor['Moyen']}`}>
                            Risque {s.offering.riskLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
