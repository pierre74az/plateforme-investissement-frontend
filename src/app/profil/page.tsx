'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [form, setForm] = useState({ firstName: '', lastName: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (!token || !u) { router.push('/auth/login'); return }
    const parsed = JSON.parse(u)
    setUser(parsed)
    setForm({ firstName: parsed.firstName, lastName: parsed.lastName })
  }, [])

  const save = async () => {
    setSaving(true)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('http://localhost:3001/api/users/me/profile', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const updated = await res.json()
      const newUser = { ...user, ...updated }
      localStorage.setItem('user', JSON.stringify(newUser))
      setUser(newUser)
      setMsg('Profil mis à jour ✔')
      setTimeout(() => setMsg(''), 3000)
    } catch {
      setMsg('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  const kycBadge: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'En attente de validation', color: 'bg-yellow-100 text-yellow-700' },
    APPROVED: { label: 'Identité vérifiée', color: 'bg-green-100 text-green-700' },
    REJECTED: { label: 'Rejeté — à soumettre à nouveau', color: 'bg-red-100 text-red-700' },
  }
  const kyc = kycBadge[user.kycStatus] || kycBadge['PENDING']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Mon profil</h1>

        <div className="bg-white rounded-2xl border p-8 mb-5">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{user.firstName} {user.lastName}</p>
              <p className="text-gray-500 text-sm">{user.email}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${kyc.color}`}>
                KYC : {kyc.label}
              </span>
            </div>
          </div>

          <h2 className="font-bold text-gray-700 mb-4">Modifier mes informations</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Prénom</label>
                <input value={form.firstName}
                  onChange={e => setForm({...form, firstName: e.target.value})}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Nom</label>
                <input value={form.lastName}
                  onChange={e => setForm({...form, lastName: e.target.value})}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input value={user.email} disabled
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400" />
              <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié</p>
            </div>
            {msg && <p className="text-green-600 text-sm font-medium">{msg}</p>}
            <button onClick={save} disabled={saving}
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition">
              {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-bold text-gray-700 mb-4">Informations du compte</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs text-blue-600 font-medium mb-1">Solde disponible</p>
              <p className="text-xl font-bold text-blue-800">{user.balance?.toLocaleString()} FCFA</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 font-medium mb-1">Membre depuis</p>
              <p className="text-sm font-bold text-gray-700">
                {new Date(user.createdAt || Date.now()).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
