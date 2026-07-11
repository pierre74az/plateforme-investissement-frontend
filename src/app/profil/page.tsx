'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  User,
  Mail,
  ShieldCheck,
  AlertTriangle,
  BadgeAlert,
  Save,
  CheckCircle,
  Calendar,
  Wallet
} from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

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
    if (!token || !u) {
      router.push('/auth/login')
      return
    }
    const parsed = JSON.parse(u)
    setUser(parsed)
    setForm({ firstName: parsed.firstName, lastName: parsed.lastName })

    fetch(`${API}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => {
      if (r.ok) return r.json()
      return null
    })
    .then(freshUser => {
      if (freshUser) {
        setUser(freshUser)
        setForm({ firstName: freshUser.firstName, lastName: freshUser.lastName })
        localStorage.setItem('user', JSON.stringify(freshUser))
      }
    })
  }, [router])

  const save = async () => {
    setSaving(true)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API}/users/me/profile`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const updated = await res.json()
      const newUser = { ...user, ...updated }
      localStorage.setItem('user', JSON.stringify(newUser))
      setUser(newUser)
      setMsg('Profil mis à jour avec succès.')
      setTimeout(() => setMsg(''), 4000)
    } catch {
      setMsg('Une erreur est survenue lors de la mise à jour.')
    } finally {
      setSaving(false)
    }
  }

  if (!mounted || !user) return null

  const kycBadge: Record<string, { label: string; color: string; icon: any }> = {
    PENDING: { label: 'En attente de validation', color: 'bg-amber-50 text-amber-800 border border-amber-200', icon: AlertTriangle },
    APPROVED: { label: 'Identité vérifiée', color: 'bg-brand-50 text-brand-800 border border-brand-200', icon: ShieldCheck },
    REJECTED: { label: 'Dossier rejeté', color: 'bg-rose-50 text-rose-800 border border-rose-200', icon: BadgeAlert },
  }
  const kyc = kycBadge[user.kycStatus] || kycBadge['PENDING']
  const KycIcon = kyc.icon

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : 'N/A'

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Mon profil</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Gérer vos informations personnelles et les paramètres du compte</p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-5 mb-8 text-center sm:text-left">
          <div className="w-16 h-16 bg-brand-700 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-sm">
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </div>
          <div className="flex-1 space-y-1.5">
            <h2 className="text-xl font-extrabold text-slate-900">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-slate-500 text-xs font-semibold flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-4 h-4 text-slate-400" /> {user.email}
            </p>
            <div className="pt-0.5">
              <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1 ${kyc.color}`}>
                <KycIcon className="w-3.5 h-3.5" />
                {kyc.label}
              </span>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100 my-6"></div>

        {/* Edit Info Form */}
        <div className="space-y-5">
          <h3 className="text-sm font-extrabold text-slate-800 tracking-wider uppercase mb-2">Modifier mon profil</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="firstName" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Prénom</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="firstName"
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition bg-slate-50/20"
                />
              </div>
            </div>
            <div>
              <label htmlFor="lastName" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nom</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="lastName"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition bg-slate-50/20"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email (non modifiable)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                value={user.email}
                disabled
                className="w-full border border-slate-100 rounded-xl pl-10 pr-4 py-3 text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          {msg && (
            <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 text-brand-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-brand-600 flex-shrink-0" />
              <span className="font-semibold">{msg}</span>
            </div>
          )}

          <button
            onClick={save}
            disabled={saving}
            className="w-full bg-brand-700 hover:bg-brand-800 text-white py-3.5 rounded-xl font-bold transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-5 h-5" /> Enregistrer les modifications
              </>
            )}
          </button>
        </div>
      </div>

      {/* Account Info Cards */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <h3 className="text-sm font-extrabold text-slate-800 tracking-wider uppercase mb-2">Métriques du compte</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-brand-50/50 border border-brand-100 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-white border border-brand-100 text-brand-700 shadow-sm flex-shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Solde disponible</p>
              <p className="text-base sm:text-lg font-extrabold text-brand-900 tracking-tight">{user.balance?.toLocaleString()} FCFA</p>
            </div>
          </div>
          <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-white border border-slate-100 text-slate-600 shadow-sm flex-shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Membre depuis</p>
              <p className="text-base sm:text-lg font-extrabold text-slate-700 tracking-tight capitalize">{memberSince}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
