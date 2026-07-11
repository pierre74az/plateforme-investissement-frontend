'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, ShieldAlert, BadgeCheck, Coins, Briefcase, Calendar, ShieldCheck, Mail } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export default function UserDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }
    fetch(`${API}/users/${id}`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        setUser(data)
        setLoading(false)
      })
  }, [id, router])

  const save = async () => {
    setSaving(true)
    const token = localStorage.getItem('token')
    await fetch(`${API}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        kycStatus: user.kycStatus,
        balance: user.balance
      }),
    })
    setMsg('Modifications enregistrées avec succès !')
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  const kycConfig: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-800 border border-amber-200',
    APPROVED: 'bg-brand-50 text-brand-900 border border-brand-200',
    REJECTED: 'bg-rose-50 text-rose-800 border border-rose-200',
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* Back Link */}
      <Link
        href="/admin/utilisateurs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-700 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Retour à la liste
      </Link>

      {/* User Header Info Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
        <div className="flex items-center gap-4.5">
          <div className="w-14 h-14 bg-brand-50 border border-brand-100 rounded-2xl flex items-center justify-center text-brand-700 font-extrabold text-lg flex-shrink-0">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </p>
          </div>
        </div>
        <span className={`text-[10px] px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider self-start sm:self-auto flex items-center gap-1.5 ${kycConfig[user.kycStatus] || kycConfig['PENDING']}`}>
          <ShieldCheck className="w-4 h-4" />
          KYC : {user.kycStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Edition Form */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm lg:col-span-2 space-y-6">
          <div>
            <h2 className="font-extrabold text-slate-800 text-sm tracking-wider uppercase">Modifier les informations de l&apos;investisseur</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Édition des paramètres du compte</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fn" className="block text-xs font-bold text-slate-555 text-slate-500 uppercase tracking-wider mb-2">Prénom</label>
                <input
                  id="fn"
                  value={user.firstName}
                  onChange={e => setUser({ ...user, firstName: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition bg-slate-50/20"
                />
              </div>
              <div>
                <label htmlFor="ln" className="block text-xs font-bold text-slate-555 text-slate-500 uppercase tracking-wider mb-2">Nom</label>
                <input
                  id="ln"
                  value={user.lastName}
                  onChange={e => setUser({ ...user, lastName: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition bg-slate-50/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="kycs" className="block text-xs font-bold text-slate-555 text-slate-500 uppercase tracking-wider mb-2">Statut KYC</label>
                <select
                  id="kycs"
                  value={user.kycStatus}
                  onChange={e => setUser({ ...user, kycStatus: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition bg-white text-slate-700"
                >
                  <option value="PENDING">En attente</option>
                  <option value="APPROVED">Validé</option>
                  <option value="REJECTED">Rejeté</option>
                </select>
              </div>
              <div>
                <label htmlFor="bal" className="block text-xs font-bold text-slate-555 text-slate-500 uppercase tracking-wider mb-2">Solde (FCFA)</label>
                <input
                  id="bal"
                  type="number"
                  value={user.balance}
                  onChange={e => setUser({ ...user, balance: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition bg-slate-50/20"
                />
              </div>
            </div>

            {msg && (
              <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 text-brand-800 text-xs flex items-start gap-2.5 font-semibold">
                <BadgeCheck className="w-5 h-5 text-brand-600 flex-shrink-0" />
                <span>{msg}</span>
              </div>
            )}

            <button
              onClick={save}
              disabled={saving}
              className="w-full bg-brand-700 hover:bg-brand-800 text-white py-3.5 rounded-xl font-bold transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Enregistrer les modifications'
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Stats & Subscriptions */}
        <div className="space-y-6">
          {/* Stats Box */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-extrabold text-slate-800 text-sm tracking-wider uppercase mb-5">Statistiques globales</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 text-center">
                <p className="text-2xl font-extrabold text-brand-700">{user.subs?.length || 0}</p>
                <p className="text-[10px] text-brand-800 font-bold uppercase tracking-wider mt-1.5">Souscriptions</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                <p className="text-base sm:text-lg font-extrabold text-blue-700 truncate">
                  {user.subs?.reduce((a: number, s: any) => a + s.totalAmount, 0).toLocaleString() || 0}
                </p>
                <p className="text-[10px] text-blue-800 font-bold uppercase tracking-wider mt-1.5">FCFA investi</p>
              </div>
            </div>
          </div>

          {/* User Subscriptions List */}
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-50">
              <h3 className="font-extrabold text-slate-800 text-sm tracking-wider uppercase">Détail des actions</h3>
            </div>
            {!user.subs?.length ? (
              <div className="py-10 text-center px-4">
                <Briefcase className="w-10 h-10 text-slate-350 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-xs font-semibold">Aucune action souscrite</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50 max-h-[300px] overflow-y-auto hide-scrollbar">
                {user.subs.map((s: any) => (
                  <div key={s.id} className="flex justify-between items-center px-6 py-4 hover:bg-slate-50/20 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-slate-800 truncate max-w-40">{s.offering.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{s.shares} actions</p>
                    </div>
                    <p className="text-sm font-extrabold text-brand-700">{s.totalAmount.toLocaleString()} F</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
