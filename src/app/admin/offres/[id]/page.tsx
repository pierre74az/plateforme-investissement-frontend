'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

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
        name: form.name, sector: form.sector, pricePerShare: parseFloat(form.pricePerShare),
        totalShares: parseInt(form.totalShares), minInvest: parseFloat(form.minInvest),
        description: form.description, riskLevel: form.riskLevel, isOpen: form.isOpen,
      }),
    })
    if (res.ok) {
      setMsg('Offre mise à jour ✔')
      setTimeout(() => { setMsg(''); router.push('/admin') }, 1500)
    } else {
      const data = await res.json()
      setError(data.error || 'Erreur lors de la sauvegarde')
    }
    setSaving(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#BBF7D0] border-t-[#15803D] rounded-full animate-spin"></div>
    </div>
  )

  const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition"

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto p-8">

        <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition mb-6">
          ← Retour au dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Modifier l&apos;offre</h1>
          <p className="text-slate-500 text-sm">{form.name}</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-8">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="ename" className="block text-sm font-medium text-slate-700 mb-1.5">Nom</label>
                <input id="ename" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label htmlFor="esector" className="block text-sm font-medium text-slate-700 mb-1.5">Secteur</label>
                <select id="esector" value={form.sector}
                  onChange={e => setForm({ ...form, sector: e.target.value })}
                  className={inputClass + ' bg-white'}>
                  {['Technologie', 'Agriculture', 'Énergie', 'Finance', 'Santé'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="eprice" className="block text-sm font-medium text-slate-700 mb-1.5">Prix / action</label>
                <input id="eprice" type="number" value={form.pricePerShare}
                  onChange={e => setForm({ ...form, pricePerShare: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label htmlFor="etotal" className="block text-sm font-medium text-slate-700 mb-1.5">Nb actions</label>
                <input id="etotal" type="number" value={form.totalShares}
                  onChange={e => setForm({ ...form, totalShares: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label htmlFor="emin" className="block text-sm font-medium text-slate-700 mb-1.5">Min. invest.</label>
                <input id="emin" type="number" value={form.minInvest}
                  onChange={e => setForm({ ...form, minInvest: e.target.value })} className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Niveau de risque</label>
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
              <label htmlFor="edesc" className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea id="edesc" rows={4} value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className={inputClass + ' resize-none'} />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-slate-700">Offre ouverte aux souscriptions</p>
                <p className="text-xs text-slate-400 mt-0.5">Désactivez pour fermer temporairement l&apos;offre</p>
              </div>
              <button type="button" onClick={() => setForm({ ...form, isOpen: !form.isOpen })}
                className={`w-12 h-6 rounded-full transition-all ${form.isOpen ? 'bg-[#15803D]' : 'bg-slate-300'} relative`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.isOpen ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {msg && <p className="text-[#15803D] text-sm font-medium">{msg}</p>}
            {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">{error}</div>}

            <div className="flex gap-3 pt-2">
              <Link href="/admin"
                className="flex-1 text-center border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition">
                Annuler
              </Link>
              <button onClick={save} disabled={saving}
                className="flex-1 bg-[#15803D] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#166534] disabled:opacity-50 transition-all active:scale-[.97]">
                {saving ? 'Sauvegarde...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
