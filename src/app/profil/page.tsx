'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [form, setForm] = useState({ firstName: '', lastName: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (!token || !u) { router.push('/auth/login'); return }
    const parsed = JSON.parse(u)
    setUser(parsed)
    setForm({ firstName: parsed.firstName, lastName: parsed.lastName })
  }, [router])

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

  if (!mounted || !user) return null

  const kycBadge: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'En attente de validation', color: 'bg-amber-50 text-amber-800 border border-amber-200' },
    APPROVED: { label: 'Identité vérifiée', color: 'bg-brand-50 text-brand-800 border border-brand-200' },
    REJECTED: { label: 'Rejeté — à soumettre à nouveau', color: 'bg-red-50 text-red-800 border border-red-200' },
  }
  const kyc = kycBadge[user.kycStatus] || kycBadge['PENDING']

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : 'N/A'

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-8">Mon profil</h1>

        <div className="bg-white border border-slate-100 rounded-2xl p-8 mb-5">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 bg-brand-700 rounded-full flex items-center justify-center text-white font-semibold text-xl">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div>
              <p className="text-xl font-semibold text-slate-900">{user.firstName} {user.lastName}</p>
              <p className="text-slate-500 text-sm">{user.email}</p>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium mt-1.5 inline-block ${kyc.color}`}>
                KYC : {kyc.label}
              </span>
            </div>
          </div>

          <h2 className="font-semibold text-slate-700 mb-4 text-sm">Modifier mes informations</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                <input
                  id="firstName"
                  value={form.firstName}
                  onChange={e => setForm({...form, firstName: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                <input
                  id="lastName"
                  value={form.lastName}
                  onChange={e => setForm({...form, lastName: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                id="email"
                value={user.email}
                disabled
                className="w-full border border-slate-100 rounded-xl px-3 py-2.5 text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1">L'email ne peut pas être modifié</p>
            </div>
            {msg && <p className="text-brand-700 text-sm font-medium">{msg}</p>}
            <button
              onClick={save}
              disabled={saving}
              className="w-full bg-brand-700 text-white py-2.5 rounded-xl font-semibold hover:bg-brand-800 disabled:opacity-50 transition active:scale-[.97]">
              {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6">
          <h2 className="font-semibold text-slate-700 mb-4 text-sm">Informations du compte</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-brand-50 rounded-xl p-4">
              <p className="text-xs text-brand-700 font-medium mb-1">Solde disponible</p>
              <p className="text-xl font-semibold text-brand-900">{user.balance?.toLocaleString()} FCFA</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 font-medium mb-1">Membre depuis</p>
              <p className="text-sm font-semibold text-slate-700">{memberSince}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
