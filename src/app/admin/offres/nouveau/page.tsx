'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NouvelleOffrePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', sector: 'Technologie', pricePerShare: '',
    totalShares: '', minInvest: '', description: '', riskLevel: 'Moyen',
  })

  const handleSubmit = async () => {
    if (!form.name || !form.pricePerShare || !form.totalShares || !form.minInvest || !form.description) {
      setError('Tous les champs sont obligatoires')
      return
    }
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('http://localhost:3001/api/offerings', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          pricePerShare: parseFloat(form.pricePerShare),
          totalShares: parseInt(form.totalShares),
          minInvest: parseFloat(form.minInvest),
        }),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error); setLoading(false); return }
      router.push('/admin')
    } catch { setError('Erreur serveur'); setLoading(false) }
  }

  const field = (label: string, key: string, type = 'text', placeholder = '') => (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input type={type} value={(form as any)[key]} placeholder={placeholder}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin" className="text-sm text-blue-600 hover:underline mb-6 inline-block">← Retour</Link>
        <div className="bg-white rounded-2xl border p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Nouvelle offre d'actions</h1>
          <div className="space-y-4">
            {field("Nom de l'entreprise", 'name', 'text', 'Ex: TechBF SA')}
            <div>
              <label className="text-sm font-medium text-gray-700">Secteur</label>
              <select value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['Technologie', 'Agriculture', 'Énergie', 'Finance', 'Santé'].map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field('Prix par action (FCFA)', 'pricePerShare', 'number', '5000')}
              {field("Nombre total d'actions", 'totalShares', 'number', '1000')}
            </div>
            {field('Investissement minimum (FCFA)', 'minInvest', 'number', '25000')}
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3} placeholder="Décrivez l'entreprise et son activité..."
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
            <button onClick={handleSubmit} disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition">
              {loading ? 'Création...' : 'Créer l\'offre'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
