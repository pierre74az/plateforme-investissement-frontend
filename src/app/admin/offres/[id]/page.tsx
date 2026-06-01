'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ModifierOffrePage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', sector: '', pricePerShare: '',
    totalShares: '', minInvest: '', description: '', riskLevel: '',
  })

  useEffect(() => {
    fetch(`http://localhost:3001/api/offerings/${id}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          name: data.name,
          sector: data.sector,
          pricePerShare: data.pricePerShare.toString(),
          totalShares: data.totalShares.toString(),
          minInvest: data.minInvest.toString(),
          description: data.description,
          riskLevel: data.riskLevel,
        })
        setLoading(false)
      })
  }, [id])

  const handleSubmit = async () => {
    setSaving(true)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`http://localhost:3001/api/offerings/${id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          pricePerShare: parseFloat(form.pricePerShare),
          totalShares: parseInt(form.totalShares),
          minInvest: parseFloat(form.minInvest),
        }),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error); setSaving(false); return }
      router.push('/admin')
    } catch { setError('Erreur serveur'); setSaving(false) }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin" className="text-sm text-blue-600 hover:underline mb-6 inline-block">← Retour</Link>
        <div className="bg-white rounded-2xl border p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Modifier l'offre</h1>
          <div className="space-y-4">
            {[
              { label: "Nom de l'entreprise", key: 'name' },
              { label: 'Prix par action (FCFA)', key: 'pricePerShare', type: 'number' },
              { label: "Nombre total d'actions", key: 'totalShares', type: 'number' },
              { label: 'Investissement minimum (FCFA)', key: 'minInvest', type: 'number' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-sm font-medium text-gray-700">{f.label}</label>
                <input type={f.type || 'text'} value={(form as any)[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea value={form.description} rows={3}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Niveau de risque</label>
              <select value={form.riskLevel} onChange={e => setForm({ ...form, riskLevel: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['Faible', 'Moyen', 'Élevé'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            {error && <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-600 text-sm">{error}</div>}
            <button onClick={handleSubmit} disabled={saving}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition">
              {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
