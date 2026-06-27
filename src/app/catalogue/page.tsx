'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

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
  Faible: 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]',
  Moyen: 'bg-amber-50 text-amber-800 border border-amber-200',
  Élevé: 'bg-red-50 text-red-800 border border-red-200',
}

const sectorIcon: Record<string, string> = {
  Technologie: '💻', Agriculture: '🌾', Énergie: '⚡', Finance: '🏦', Santé: '🏥',
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
      .then(data => { setOfferings(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  const filtered = offerings.filter(o => {
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.sector.toLowerCase().includes(search.toLowerCase())
    const matchSector = sector ? o.sector === sector : true
    const matchRisk = risk ? o.riskLevel === risk : true
    return matchSearch && matchSector && matchRisk
  })

  const sectors = [...new Set(offerings.map(o => o.sector))]

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#BBF7D0] border-t-[#15803D] rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Catalogue des offres</h1>
          <p className="text-slate-500 text-sm">{offerings.length} offre(s) disponible(s)</p>
        </div>

        {/* Filtres */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 mb-6 flex gap-4 flex-wrap">
          <input
            placeholder="Rechercher une entreprise ou un secteur..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-48 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition"
          />
          <select
            title="Filtrer par secteur"
            value={sector}
            onChange={e => setSector(e.target.value)}
            className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition bg-white text-slate-700">
            <option value="">Tous les secteurs</option>
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            title="Filtrer par niveau de risque"
            value={risk}
            onChange={e => setRisk(e.target.value)}
            className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition bg-white text-slate-700">
            <option value="">Tous les risques</option>
            <option value="Faible">Faible</option>
            <option value="Moyen">Moyen</option>
            <option value="Élevé">Élevé</option>
          </select>
          {(search || sector || risk) && (
            <button
              onClick={() => { setSearch(''); setSector(''); setRisk('') }}
              className="text-xs text-slate-500 hover:text-slate-800 transition px-3 py-2.5 border border-slate-200 rounded-xl">
              Réinitialiser
            </button>
          )}
        </div>

        {/* Grille */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center">
            <p className="text-slate-400">Aucune offre ne correspond à votre recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map(o => {
              const pct = Math.round((o.soldShares / o.totalShares) * 100)
              return (
                <div key={o.id}
                  className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-sm hover:border-[#BBF7D0] transition-all flex flex-col gap-4">

                  {/* Top */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-xl">
                        {sectorIcon[o.sector] || '🏢'}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{o.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{o.sector}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${riskColor[o.riskLevel] || riskColor['Moyen']}`}>
                        {o.riskLevel}
                      </span>
                      {!o.isOpen && (
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-500">
                          Fermé
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{o.description}</p>

                  {/* Progression */}
                  <div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#16A34A] transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                      <span>{o.soldShares.toLocaleString()} / {o.totalShares.toLocaleString()} actions</span>
                      <span className="font-medium text-[#15803D]">{pct}%</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <div>
                      <p className="text-base font-semibold text-[#15803D]">
                        {o.pricePerShare.toLocaleString()} FCFA
                      </p>
                      <p className="text-xs text-slate-400">/ action · min {o.minInvest.toLocaleString()} FCFA</p>
                    </div>
                    {o.isOpen ? (
                      <Link href={`/souscrire/${o.id}`}
                        className="bg-[#15803D] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#166534] transition-all active:scale-[.97]">
                        Investir →
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Indisponible</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
