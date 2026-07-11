'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Search,
  SlidersHorizontal,
  Building2,
  Cpu,
  Sprout,
  Zap,
  Coins,
  HeartPulse,
  Info,
  ChevronRight,
  TrendingUp
} from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

type Offering = {
  id: string
  name: string
  sector: string
  pricePerShare: number
  totalShares: number
  soldShares: number
  minInvest: number
  description: string
  riskLevel: string
  isOpen: boolean
  _count: { subs: number }
}

const riskColor: Record<string, string> = {
  Faible: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  Moyen: 'bg-amber-50 text-amber-800 border border-amber-200',
  Élevé: 'bg-rose-50 text-rose-800 border border-rose-200',
}

const sectorIcon: Record<string, any> = {
  Technologie: Cpu,
  Agriculture: Sprout,
  Énergie: Zap,
  Finance: Coins,
  Santé: HeartPulse,
}

export default function CataloguePage() {
  const [offerings, setOfferings] = useState<Offering[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('')
  const [risk, setRisk] = useState('')

  useEffect(() => {
    fetch(`${API}/offerings`)
      .then(r => r.json())
      .then(data => {
        setOfferings(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  const filtered = offerings.filter(o => {
    const matchSearch =
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.sector.toLowerCase().includes(search.toLowerCase())
    const matchSector = sector ? o.sector === sector : true
    const matchRisk = risk ? o.riskLevel === risk : true
    return matchSearch && matchSector && matchRisk
  })

  const sectors = [...new Set(offerings.map(o => o.sector))]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Catalogue des offres</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">{offerings.length} opportunité(s) de financement disponible(s)</p>
      </div>

      {/* Filter Section Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm uppercase tracking-wider">
          <SlidersHorizontal className="w-5 h-5 text-brand-600" />
          Filtres de recherche
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              placeholder="Rechercher une entreprise ou un secteur..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition bg-slate-50/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 md:w-[350px]">
            <select
              title="Filtrer par secteur"
              value={sector}
              onChange={e => setSector(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition bg-white text-slate-700"
            >
              <option value="">Tous secteurs</option>
              {sectors.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              title="Filtrer par niveau de risque"
              value={risk}
              onChange={e => setRisk(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition bg-white text-slate-700"
            >
              <option value="">Tous risques</option>
              <option value="Faible">Risque Faible</option>
              <option value="Moyen">Risque Moyen</option>
              <option value="Élevé">Risque Élevé</option>
            </select>
          </div>

          {(search || sector || risk) && (
            <button
              onClick={() => {
                setSearch('')
                setSector('')
                setRisk('')
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition px-5 py-3 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Offerings Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm flex flex-col items-center">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 mb-4">
            <Info className="w-6 h-6" />
          </div>
          <p className="text-slate-700 font-extrabold text-base">Aucune offre trouvée</p>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Essayez de modifier ou de réinitialiser vos filtres de recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
          {filtered.map(o => {
            const pct = Math.round((o.soldShares / o.totalShares) * 100)
            const IconComponent = sectorIcon[o.sector] || Building2

            return (
              <div
                key={o.id}
                className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-md hover:border-brand-200 transition duration-300 flex flex-col justify-between gap-5 relative overflow-hidden"
              >
                {/* Status Badges */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-brand-50 border border-brand-100 rounded-2xl flex items-center justify-center text-brand-700">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base group-hover:text-brand-700 transition">
                        {o.name}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{o.sector}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${riskColor[o.riskLevel] || riskColor['Moyen']}`}>
                      {o.riskLevel}
                    </span>
                    {!o.isOpen && (
                      <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
                        Fermé
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 h-8">{o.description}</p>

                {/* Progression Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                    <span>{pct}% collectés</span>
                    <span>{(o.totalShares - o.soldShares).toLocaleString()} actions restantes</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, pct)}%` } as React.CSSProperties}
                    />
                  </div>
                </div>

                {/* Footer and Price info */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <div>
                    <p className="text-lg font-extrabold text-brand-700 tracking-tight">
                      {o.pricePerShare.toLocaleString()} FCFA
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
                      Par part · Min {o.minInvest.toLocaleString()} F
                    </p>
                  </div>

                  {o.isOpen ? (
                    <Link
                      href={`/catalogue/${o.id}`}
                      className="bg-brand-700 hover:bg-brand-800 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center gap-1 shadow-sm"
                    >
                      Détails <ChevronRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
                      Indisponible
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
