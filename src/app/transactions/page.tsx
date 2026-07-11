'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { History, Search, FileText, ArrowDownRight, Filter, AlertTriangle } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

type Sub = {
  id: string
  shares: number
  totalAmount: number
  createdAt: string
  offering: { name: string; sector: string; riskLevel: string }
}

const riskColor: Record<string, string> = {
  Faible: 'bg-emerald-50 text-emerald-800 border border-emerald-100',
  Moyen: 'bg-amber-50 text-amber-800 border border-amber-100',
  Élevé: 'bg-rose-50 text-rose-800 border border-rose-100',
}

export default function TransactionsPage() {
  const router = useRouter()
  const [subs, setSubs] = useState<Sub[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Tous')

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

  const sectors = ['Tous', ...Array.from(new Set(subs.map(s => s.offering.sector)))]
  const filtered = filter === 'Tous' ? subs : subs.filter(s => s.offering.sector === filter)
  const total = filtered.reduce((a, s) => a + s.totalAmount, 0)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Historique des transactions</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">{subs.length} transaction(s) au total</p>
      </div>

      {/* Sector filter tabs */}
      <div className="flex gap-2 pb-2 overflow-x-auto hide-scrollbar flex-nowrap sm:flex-wrap items-center">
        <div className="text-slate-400 p-2 mr-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5" />
          Filtrer
        </div>
        {sectors.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
              filter === s
                ? 'bg-brand-700 text-white shadow'
                : 'bg-white border border-slate-100 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Total card */}
      <div className="bg-brand-50/60 border border-brand-100 rounded-3xl p-5 flex justify-between items-center shadow-sm">
        <div>
          <p className="text-[10px] font-bold text-brand-900 uppercase tracking-wider mb-0.5">Montant cumulé</p>
          <p className="text-xs text-brand-700 font-semibold">
            Filtre actif : {filter === 'Tous' ? 'Tous les secteurs d\'activité' : `Secteur ${filter}`}
          </p>
        </div>
        <p className="text-xl sm:text-2xl font-extrabold text-brand-700 tracking-tight">
          {total.toLocaleString()} FCFA
        </p>
      </div>

      {/* Transactions Table Container */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center px-6 flex flex-col items-center">
            <History className="w-12 h-12 text-slate-400 mb-3" />
            <p className="text-slate-700 font-extrabold text-sm mb-0.5">Aucune transaction enregistrée</p>
            <p className="text-slate-400 text-xs mt-1">Les opérations liées au filtre sélectionné apparaîtront ici.</p>
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-50">
                    {['Détail', 'Secteur', 'Actions', 'Montant', 'Risque', 'Date'].map(h => (
                      <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-slate-800 text-sm truncate max-w-[160px] sm:max-w-xs">{s.offering.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-500">{s.offering.sector}</td>
                      <td className="px-6 py-4 font-bold text-brand-700">{s.shares} parts</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 font-extrabold text-rose-600 text-sm">
                          <ArrowDownRight className="w-3.5 h-3.5 flex-shrink-0" />
                          -{s.totalAmount.toLocaleString()} FCFA
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider inline-block ${riskColor[s.offering.riskLevel] || riskColor['Moyen']}`}>
                          {s.offering.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                        {new Date(s.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filtered.map(s => (
                <div key={s.id} className="p-5 space-y-3 hover:bg-slate-50/20 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-850 text-slate-800 text-sm truncate max-w-[170px]">{s.offering.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{s.offering.sector}</p>
                      </div>
                    </div>
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${riskColor[s.offering.riskLevel] || riskColor['Moyen']}`}>
                      {s.offering.riskLevel}
                    </span>
                  </div>

                  <div className="flex justify-between items-end pt-1">
                    <div className="text-[10px] font-semibold text-slate-500">
                      <p className="font-bold text-brand-700">{s.shares} parts</p>
                      <p className="text-slate-400 mt-0.5">
                        {new Date(s.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 font-extrabold text-rose-650 text-rose-600 text-sm">
                      <ArrowDownRight className="w-3.5 h-3.5 flex-shrink-0" />
                      -{s.totalAmount.toLocaleString()} FCFA
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
