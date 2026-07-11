'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Wallet,
  TrendingUp,
  Briefcase,
  Activity,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  ArrowUpRight,
  TrendingDown,
  Building2,
  BadgeAlert,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

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
  Faible: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  Moyen: 'bg-amber-50 text-amber-700 border border-amber-100',
  Élevé: 'bg-rose-50 text-rose-700 border border-rose-100',
}

const sectorColor: Record<string, string> = {
  Technologie: '#3B82F6',
  Agriculture: '#10B981',
  Énergie: '#F59E0B',
  Finance: '#8B5CF6',
  Santé: '#EF4444',
  Services: '#EC4899',
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [subs, setSubs] = useState<Sub[]>([])
  const [offers, setOffers] = useState<Offering[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (!token || !u) {
      router.push('/auth/login')
      return
    }
    const parsed = JSON.parse(u)
    setUser(parsed)
    const headers = { 'Authorization': `Bearer ${token}` }
    Promise.all([
      fetch(`${API}/subscriptions/me`, { headers }).then(r => r.json()),
      fetch(`${API}/offerings`).then(r => r.json()),
      fetch(`${API}/auth/me`, { headers }).then(r => {
        if (r.ok) return r.json()
        return null
      }),
    ]).then(([subsData, offersData, freshUser]) => {
      const subsArr = Array.isArray(subsData) ? subsData : (subsData.data || [])
      setSubs(subsArr)
      setOffers(Array.isArray(offersData) ? offersData.slice(0, 3) : [])
      if (freshUser) {
        setUser(freshUser)
        localStorage.setItem('user', JSON.stringify(freshUser))
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [router])

  if (loading || !mounted) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  const totalInvesti = subs.reduce((acc, s) => acc + s.totalAmount, 0)
  const totalActions = subs.reduce((acc, s) => acc + s.shares, 0)

  const kycBadge: Record<string, { label: string; color: string; icon: any }> = {
    PENDING: { label: 'KYC en attente', color: 'bg-amber-50 text-amber-700 border border-amber-200', icon: AlertTriangle },
    APPROVED: { label: 'Compte vérifié', color: 'bg-brand-50 text-brand-800 border border-brand-200', icon: ShieldCheck },
    REJECTED: { label: 'KYC rejeté', color: 'bg-rose-50 text-rose-700 border border-rose-200', icon: BadgeAlert },
  }
  const kyc = kycBadge[user?.kycStatus] || kycBadge['PENDING']
  const KycIcon = kyc.icon

  // Sector Pie Chart Prep
  const sectorDataMap = subs.reduce((acc: Record<string, number>, s) => {
    const sector = s.offering.sector || 'Autre'
    acc[sector] = (acc[sector] || 0) + s.totalAmount
    return acc
  }, {})

  const chartPieData = Object.entries(sectorDataMap).map(([name, value]) => ({
    name,
    value,
    color: sectorColor[name] || '#6B7280'
  }))

  // Bar Chart Prep
  const chartBarData = subs.slice(0, 5).map(s => ({
    name: s.offering.name.length > 12 ? s.offering.name.substring(0, 12) + '...' : s.offering.name,
    Investi: s.totalAmount,
  })).reverse()

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner Welcome */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-md overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full filter blur-2xl"></div>
        <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👋</span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Bonjour, {user?.firstName}
              </h1>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm font-medium">
              Ravi de vous revoir. Voici le récapitulatif en temps réel de votre activité d&apos;investisseur.
            </p>
          </div>
          <div className="flex-shrink-0 self-start sm:self-auto">
            <span className={`text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-2xs ${kyc.color}`}>
              <KycIcon className="w-4 h-4" />
              {kyc.label}
            </span>
          </div>
        </div>
      </div>

      {/* KYC Warning alert */}
      {user?.kycStatus !== 'APPROVED' && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <p className="font-extrabold text-amber-900 text-sm sm:text-base">Vérification de compte obligatoire</p>
              <p className="text-amber-700 text-xs sm:text-sm mt-0.5 max-w-xl leading-relaxed">
                Veuillez soumettre vos pièces justificatives d&apos;identité et de domicile (KYC) afin de pouvoir souscrire à des offres d&apos;investissement.
              </p>
            </div>
          </div>
          <Link
            href="/kyc"
            className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all hover:scale-[1.01] active:scale-[0.98] text-center shadow-sm"
          >
            Vérifier mon identité →
          </Link>
        </div>
      )}

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            label: 'Solde disponible',
            value: `${user?.balance?.toLocaleString() || 0} FCFA`,
            icon: Wallet,
            iconColor: 'text-brand-700 bg-brand-50 border border-brand-100',
            detail: 'Prêt à être investi'
          },
          {
            label: 'Total investi',
            value: `${totalInvesti.toLocaleString()} FCFA`,
            icon: TrendingUp,
            iconColor: 'text-blue-700 bg-blue-50 border border-blue-100',
            detail: `${subs.length} souscription(s)`
          },
          {
            label: 'Nombre d\'actions',
            value: totalActions.toLocaleString(),
            icon: Briefcase,
            iconColor: 'text-indigo-700 bg-indigo-50 border border-indigo-100',
            detail: 'Parts globales détenues'
          },
          {
            label: 'Secteurs d\'actifs',
            value: `${chartPieData.length} secteurs`,
            icon: Activity,
            iconColor: 'text-purple-700 bg-purple-50 border border-purple-100',
            detail: 'Répartition sectorielle'
          },
        ].map((k, i) => {
          const Icon = k.icon
          return (
            <div
              key={i}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow transition duration-300 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{k.label}</span>
                <div className={`p-2.5 rounded-xl ${k.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-none mb-2">{k.value}</p>
                <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  {k.detail}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Section */}
      {subs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm tracking-wider uppercase mb-5">Diversification</h3>
              <div className="h-48 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={72}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${(val ?? 0).toLocaleString()} FCFA`, 'Investi']}
                      contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #F1F5F9', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-2 mt-4 max-h-32 overflow-y-auto hide-scrollbar pt-2 border-t border-slate-50">
              {chartPieData.map((d, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color } as React.CSSProperties}></span>
                    <span className="font-semibold text-slate-500 truncate max-w-28">{d.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">
                    {Math.round((d.value / totalInvesti) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm lg:col-span-2">
            <h3 className="font-extrabold text-slate-800 text-sm tracking-wider uppercase mb-5">
              Historique des volumes d&apos;investissements (FCFA)
            </h3>
            <div className="h-56 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartBarData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: '10px', fill: '#94A3B8', fontWeight: 600 }} />
                  <YAxis tickLine={false} axisLine={false} style={{ fontSize: '10px', fill: '#94A3B8', fontWeight: 600 }} />
                  <Tooltip
                    formatter={(val: any) => [`${(val ?? 0).toLocaleString()} FCFA`, 'Volume']}
                    contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #F1F5F9', fontSize: '12px' }}
                  />
                  <Bar dataKey="Investi" fill="#10B981" radius={[6, 6, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Grid Bottom: Activity & Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        {/* Recent subscriptions */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-50">
              <h3 className="font-extrabold text-slate-900 text-sm tracking-wider uppercase">Dernières transactions</h3>
              <Link
                href="/portefeuille"
                className="text-xs text-brand-700 hover:text-brand-900 font-bold flex items-center gap-0.5"
              >
                Voir tout <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {subs.length === 0 ? (
              <div className="py-16 text-center px-6">
                <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-700 font-extrabold text-sm mb-1">Aucun investissement actif</p>
                <p className="text-slate-500 text-xs mt-1 max-w-xs mx-auto">
                  Devenez actionnaire de PME locales et suivez vos rendements ici.
                </p>
                <Link
                  href="/catalogue"
                  className="inline-flex mt-5 bg-brand-700 hover:bg-brand-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow"
                >
                  Découvrir les offres
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {subs.slice(0, 4).map(s => (
                  <div key={s.id} className="flex justify-between items-center px-6 py-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
                        <TrendingDown className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 truncate max-w-[150px] sm:max-w-xs">{s.offering.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                          {s.shares} actions · {new Date(s.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-slate-900">-{s.totalAmount.toLocaleString()} FCFA</p>
                      <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase mt-1 inline-block">
                        Souscription
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Opportunities */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-50">
              <h3 className="font-extrabold text-slate-900 text-sm tracking-wider uppercase">Opportunités du moment</h3>
              <Link
                href="/catalogue"
                className="text-xs text-brand-700 hover:text-brand-900 font-bold flex items-center gap-0.5"
              >
                Tout explorer <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {offers.map(o => (
                <Link href={`/catalogue/${o.id}`} key={o.id} className="block group">
                  <div className="flex justify-between items-center px-6 py-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 flex-shrink-0 group-hover:scale-105 transition">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition truncate max-w-[150px] sm:max-w-xs">
                          {o.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">{o.sector}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1.5">
                      <p className="text-sm font-extrabold text-brand-700 flex items-center gap-0.5">
                        {o.pricePerShare.toLocaleString()} FCFA
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </p>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${riskColor[o.riskLevel] || riskColor['Moyen']}`}>
                        Risque {o.riskLevel}
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
