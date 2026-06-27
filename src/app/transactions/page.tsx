'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

type Sub = {
  id: string
  shares: number
  totalAmount: number
  createdAt: string
  offering: { name: string; sector: string; riskLevel: string }
}

const riskColor: Record<string, string> = {
  Faible: 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]',
  Moyen: 'bg-amber-50 text-amber-800 border border-amber-200',
  Élevé: 'bg-red-50 text-red-800 border border-red-200',
}

export default function TransactionsPage() {
  const router = useRouter()
  const [subs, setSubs] = useState<Sub[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Tous')

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

  const sectors = ['Tous', ...Array.from(new Set(subs.map(s => s.offering.sector)))]
  const filtered = filter === 'Tous' ? subs : subs.filter(s => s.offering.sector === filter)
  const total = filtered.reduce((a, s) => a + s.totalAmount, 0)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Historique des transactions</h1>
          <p className="text-slate-500 text-sm">{subs.length} transaction(s) au total</p>
        </div>

        <div className="flex gap-2 mb-5 flex-wrap">
          {sectors.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === s
                  ? 'bg-[#15803D] text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-[#BBF7D0] hover:text-[#15803D]'
              }`}>
              {s}
            </button>
          ))}
        </div>

        <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-5 flex justify-between items-center mb-6">
          <div>
            <p className="text-xs text-[#166534] font-medium mb-0.5">Total investi</p>
            <p className="text-xs text-[#15803D]">{filter === 'Tous' ? 'Tous secteurs' : `Secteur : ${filter}`}</p>
          </div>
          <p className="text-xl font-semibold text-[#15803D]">{total.toLocaleString()} FCFA</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-center text-slate-400 py-12 text-sm">Aucune transaction</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Entreprise', 'Secteur', 'Actions', 'Montant', 'Risque', 'Date'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-slate-800">{s.offering.name}</td>
                    <td className="px-5 py-4 text-slate-500 text-xs">{s.offering.sector}</td>
                    <td className="px-5 py-4 font-semibold text-[#15803D]">{s.shares}</td>
                    <td className="px-5 py-4 font-semibold text-red-500">−{s.totalAmount.toLocaleString()} FCFA</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${riskColor[s.offering.riskLevel] || riskColor['Moyen']}`}>
                        {s.offering.riskLevel}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs">
                      {new Date(s.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
