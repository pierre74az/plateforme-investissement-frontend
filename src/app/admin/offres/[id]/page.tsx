'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, CheckCircle, AlertTriangle } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition bg-slate-50/20"
const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2"

const RISK_LEVELS = [
  { value: 'Faible', active: 'bg-brand-50 text-brand-800 border-brand-600', inactive: 'border-slate-200 text-slate-500' },
  { value: 'Moyen',  active: 'bg-amber-50 text-amber-800 border-amber-600',  inactive: 'border-slate-200 text-slate-500' },
  { value: 'Élevé',  active: 'bg-rose-50 text-rose-800 border-rose-600',     inactive: 'border-slate-200 text-slate-500' },
]

export default function EditOffrePage() {
  const { id } = useParams()
  const router = useRouter()
  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API}/offerings/${id}`)
      .then(r => r.json())
      .then(data => { setForm(data); setLoading(false) })
  }, [id])

  const save = async () => {
    setSaving(true)
    setError('')
    const token = localStorage.getItem('token')
    const res = await fetch(`${API}/offerings/${id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name, sector: form.sector,
        pricePerShare: parseFloat(form.pricePerShare),
        totalShares: parseInt(form.totalShares),
        minInvest: parseFloat(form.minInvest),
        description: form.description,
        riskLevel: form.riskLevel,
        isOpen: form.isOpen,
      }),
    })
    if (res.ok) {
      setMsg('Offre mise à jour avec succès.')
      setTimeout(() => { setMsg(''); router.push('/admin/offres') }, 1800)
    } else {
      const data = await res.json()
      setError(data.error || 'Erreur lors de la sauvegarde.')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    )
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Modifier l&apos;offre</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-semibold">{form.name}</p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow space-y-6">

        {/* Name + Sector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="ename" className={labelClass}>Nom de l&apos;entreprise</label>
            <input
              id="ename"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="esector" className={labelClass}>Secteur d&apos;activité</label>
            <select
              id="esector"
              value={form.sector}
              onChange={e => setForm({ ...form, sector: e.target.value })}
              className={inputClass + ' bg-white'}
            >
              {['Technologie', 'Agriculture', 'Énergie', 'Finance', 'Santé'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price + Shares + Min */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label htmlFor="eprice" className={labelClass}>Prix / action (FCFA)</label>
            <input
              id="eprice" type="number"
              value={form.pricePerShare}
              onChange={e => setForm({ ...form, pricePerShare: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="etotal" className={labelClass}>Nombre d&apos;actions</label>
            <input
              id="etotal" type="number"
              value={form.totalShares}
              onChange={e => setForm({ ...form, totalShares: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="emin" className={labelClass}>Invest. minimum (FCFA)</label>
            <input
              id="emin" type="number"
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
          <label htmlFor="edesc" className={labelClass}>Description de l&apos;offre</label>
          <textarea
            id="edesc" rows={5}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className={inputClass + ' resize-none'}
          />
        </div>

        {/* Toggle Open/Closed */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-5">
          <div>
            <p className="text-sm font-bold text-slate-800">Offre ouverte aux souscriptions</p>
            <p className="text-xs text-slate-400 mt-0.5">Désactivez pour fermer temporairement la campagne</p>
          </div>
          <button
            type="button"
            role="switch"
            onClick={() => setForm({ ...form, isOpen: !form.isOpen })}
            aria-label={form.isOpen ? 'Fermer l\'offre aux souscriptions' : 'Ouvrir l\'offre aux souscriptions'}
            title={form.isOpen ? 'Fermer l\'offre aux souscriptions' : 'Ouvrir l\'offre aux souscriptions'}
            aria-checked={form.isOpen}
            className={`w-12 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${form.isOpen ? 'bg-brand-700' : 'bg-slate-200'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${form.isOpen ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        {/* Success Message */}
        {msg && (
          <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 text-brand-800 text-xs flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-brand-600 flex-shrink-0" />
            <span className="font-semibold">{msg}</span>
          </div>
        )}

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
            onClick={save} disabled={saving}
            className="flex-1 bg-brand-700 hover:bg-brand-800 text-white py-3.5 rounded-xl text-xs font-bold disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <><Save className="w-4 h-4" /> Enregistrer</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
