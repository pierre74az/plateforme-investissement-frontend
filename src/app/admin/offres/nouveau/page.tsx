'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Building2, AlertTriangle, PlusCircle } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition bg-slate-50/20"
const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2"

const RISK_LEVELS = [
  { value: 'Faible', active: 'bg-brand-50 text-brand-800 border-brand-600', inactive: 'border-slate-200 text-slate-500' },
  { value: 'Moyen',  active: 'bg-amber-50 text-amber-800 border-amber-600',  inactive: 'border-slate-200 text-slate-500' },
  { value: 'Élevé',  active: 'bg-rose-50 text-rose-800 border-rose-600',     inactive: 'border-slate-200 text-slate-500' },
]

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
      router.push('/admin/offres')
    } catch {
      setError('Erreur lors de la création de l\'offre.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 pb-8">
      {/* Back */}
      <Link
        href="/admin/offres"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-700 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Retour aux offres
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Créer une nouvelle offre</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Renseignez les caractéristiques de la campagne d&apos;actions</p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name + Sector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className={labelClass}>Nom de l&apos;entreprise</label>
              <input
                id="name" required placeholder="ex: TechBF SA"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="sector" className={labelClass}>Secteur d&apos;activité</label>
              <select
                id="sector" required
                value={form.sector}
                onChange={e => setForm({ ...form, sector: e.target.value })}
                className={inputClass + ' bg-white'}
              >
                <option value="">Choisir un secteur</option>
                {['Technologie', 'Agriculture', 'Énergie', 'Finance', 'Santé'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price + Shares + Min */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label htmlFor="price" className={labelClass}>Prix / action (FCFA)</label>
              <input
                id="price" type="number" required placeholder="5000"
                value={form.pricePerShare}
                onChange={e => setForm({ ...form, pricePerShare: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="total" className={labelClass}>Nombre d&apos;actions</label>
              <input
                id="total" type="number" required placeholder="1000"
                value={form.totalShares}
                onChange={e => setForm({ ...form, totalShares: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="min" className={labelClass}>Invest. minimum (FCFA)</label>
              <input
                id="min" type="number" required placeholder="25000"
                value={form.minInvest}
                onChange={e => setForm({ ...form, minInvest: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          {/* Risk Level */}
          <div>
            <label className={labelClass}>Niveau de risque</label>
            <div className="flex gap-3">
              {RISK_LEVELS.map(r => (
                <button
                  key={r.value} type="button"
                  onClick={() => setForm({ ...form, riskLevel: r.value })}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold border-2 transition-all ${
                    form.riskLevel === r.value ? r.active : r.inactive + ' hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {r.value}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="desc" className={labelClass}>Description de l&apos;offre</label>
            <textarea
              id="desc" required rows={5}
              placeholder="Décrivez l'entreprise, son modèle économique et l'opportunité d'investissement..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className={inputClass + ' resize-none'}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <span className="font-semibold leading-relaxed">{error}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <Link
              href="/admin/offres"
              className="flex-1 text-center border border-slate-200 text-slate-600 hover:bg-slate-50 py-3.5 rounded-xl text-xs font-bold transition"
            >
              Annuler
            </Link>
            <button
              type="submit" disabled={loading}
              className="flex-1 bg-brand-700 hover:bg-brand-800 text-white py-3.5 rounded-xl text-xs font-bold disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <><PlusCircle className="w-4 h-4" /> Créer l&apos;offre</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
