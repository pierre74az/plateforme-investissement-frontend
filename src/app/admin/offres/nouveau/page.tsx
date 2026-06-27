'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export default function NewOffrePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', sector: '', pricePerShare: '', totalShares: '',
    minInvest: '', description: '', riskLevel: 'Moyen',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API}/offerings`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          pricePerShare: parseFloat(form.pricePerShare),
          totalShares: parseInt(form.totalShares),
          minInvest: parseFloat(form.minInvest),
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
      router.push('/admin')
    } catch {
      setError('Erreur lors de la création')
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition"

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto p-8">

        <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition mb-6">
          ← Retour au dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Créer une nouvelle offre</h1>
          <p className="text-slate-500 text-sm">Remplissez les informations de l&apos;offre d&apos;actions</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">Nom de l&apos;entreprise</label>
                <input id="name" required placeholder="ex: TechBF SA" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label htmlFor="sector" className="block text-sm font-medium text-slate-700 mb-1.5">Secteur</label>
                <select id="sector" required value={form.sector}
                  onChange={e => setForm({ ...form, sector: e.target.value })}
                  className={inputClass + ' bg-white'}>
                  <option value="">Choisir un secteur</option>
                  {['Technologie', 'Agriculture', 'Énergie', 'Finance', 'Santé'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1.5">Prix / action (FCFA)</label>
                <input id="price" type="number" required placeholder="5000" value={form.pricePerShare}
                  onChange={e => setForm({ ...form, pricePerShare: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label htmlFor="total" className="block text-sm font-medium text-slate-700 mb-1.5">Nombre d&apos;actions</label>
                <input id="total" type="number" required placeholder="1000" value={form.totalShares}
                  onChange={e => setForm({ ...form, totalShares: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label htmlFor="min" className="block text-sm font-medium text-slate-700 mb-1.5">Invest. minimum (FCFA)</label>
                <input id="min" type="number" required placeholder="25000" value={form.minInvest}
                  onChange={e => setForm({ ...form, minInvest: e.target.value })} className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="risk" className="block text-sm font-medium text-slate-700 mb-1.5">Niveau de risque</label>
              <div className="flex gap-3">
                {['Faible', 'Moyen', 'Élevé'].map(r => (
                  <button key={r} type="button"
                    onClick={() => setForm({ ...form, riskLevel: r })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                      form.riskLevel === r
                        ? r === 'Faible' ? 'bg-[#F0FDF4] text-[#166534] border-[#16A34A]'
                          : r === 'Moyen' ? 'bg-amber-50 text-amber-800 border-amber-400'
                          : 'bg-red-50 text-red-800 border-red-400'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="desc" className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea id="desc" required rows={4} placeholder="Décrivez l'entreprise et l'opportunité d'investissement..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className={inputClass + ' resize-none'} />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">{error}</div>
            )}

            <div className="flex gap-3 pt-2">
              <Link href="/admin"
                className="flex-1 text-center border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition">
                Annuler
              </Link>
              <button type="submit" disabled={loading}
                className="flex-1 bg-[#15803D] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#166534] disabled:opacity-50 transition-all active:scale-[.97]">
                {loading ? 'Création...' : 'Créer l\'offre'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
