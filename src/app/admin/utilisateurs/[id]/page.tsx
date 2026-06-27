'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

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
    if (!token) { router.push('/auth/login'); return }
    fetch(`${API}/users/${id}`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setUser(data); setLoading(false) })
  }, [id, router])

  const save = async () => {
    setSaving(true)
    const token = localStorage.getItem('token')
    await fetch(`${API}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: user.firstName, lastName: user.lastName, kycStatus: user.kycStatus, balance: user.balance }),
    })
    setMsg('Modifications enregistrées ✔')
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#BBF7D0] border-t-[#15803D] rounded-full animate-spin"></div>
    </div>
  )

  const kycConfig: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-800 border border-amber-200',
    APPROVED: 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]',
    REJECTED: 'bg-red-50 text-red-800 border border-red-200',
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-8">

        <Link href="/admin/utilisateurs"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition mb-6">
          ← Retour à la liste
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-[#F0FDF4] border-2 border-[#BBF7D0] rounded-full flex items-center justify-center text-[#15803D] font-semibold text-lg">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{user.firstName} {user.lastName}</h1>
            <p className="text-slate-500 text-sm">{user.email}</p>
          </div>
          <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-medium ${kycConfig[user.kycStatus]}`}>
            KYC : {user.kycStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Édition */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6">
            <h2 className="font-semibold text-slate-800 text-sm mb-5">Modifier le compte</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="fn" className="block text-xs font-medium text-slate-600 mb-1.5">Prénom</label>
                <input id="fn" value={user.firstName}
                  onChange={e => setUser({ ...user, firstName: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] transition" />
              </div>
              <div>
                <label htmlFor="ln" className="block text-xs font-medium text-slate-600 mb-1.5">Nom</label>
                <input id="ln" value={user.lastName}
                  onChange={e => setUser({ ...user, lastName: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] transition" />
              </div>
              <div>
                <label htmlFor="kycs" className="block text-xs font-medium text-slate-600 mb-1.5">Statut KYC</label>
                <select id="kycs" value={user.kycStatus}
                  onChange={e => setUser({ ...user, kycStatus: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] transition bg-white">
                  <option value="PENDING">En attente</option>
                  <option value="APPROVED">Validé</option>
                  <option value="REJECTED">Rejeté</option>
                </select>
              </div>
              <div>
                <label htmlFor="bal" className="block text-xs font-medium text-slate-600 mb-1.5">Solde (FCFA)</label>
                <input id="bal" type="number" value={user.balance}
                  onChange={e => setUser({ ...user, balance: parseFloat(e.target.value) })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] transition" />
              </div>
              {msg && <p className="text-[#15803D] text-sm font-medium">{msg}</p>}
              <button onClick={save} disabled={saving}
                className="w-full bg-[#15803D] text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-[#166534] disabled:opacity-50 transition-all active:scale-[.97]">
                {saving ? 'Sauvegarde...' : 'Enregistrer'}
              </button>
            </div>
          </div>

          {/* Stats + souscriptions */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-6">
              <h2 className="font-semibold text-slate-800 text-sm mb-4">Statistiques</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F0FDF4] rounded-xl p-4 text-center">
                  <p className="text-2xl font-semibold text-[#15803D]">{user.subs?.length || 0}</p>
                  <p className="text-xs text-[#166534] mt-1">Souscriptions</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-lg font-semibold text-blue-800">
                    {user.subs?.reduce((a: number, s: any) => a + s.totalAmount, 0).toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">FCFA investi</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800 text-sm">Souscriptions</h2>
              </div>
              {!user.subs?.length ? (
                <p className="text-slate-400 text-sm text-center py-6">Aucune souscription</p>
              ) : (
                <div className="divide-y divide-slate-50">
                  {user.subs.map((s: any) => (
                    <div key={s.id} className="flex justify-between items-center px-5 py-3.5">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{s.offering.name}</p>
                        <p className="text-xs text-slate-400">{s.shares} actions</p>
                      </div>
                      <p className="text-sm font-semibold text-[#15803D]">{s.totalAmount.toLocaleString()} FCFA</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
