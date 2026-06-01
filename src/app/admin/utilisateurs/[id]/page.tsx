'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

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
    fetch(`http://localhost:3001/api/users/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()).then(data => { setUser(data); setLoading(false) })
  }, [id])

  const save = async () => {
    setSaving(true)
    const token = localStorage.getItem('token')
    await fetch(`http://localhost:3001/api/users/${id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: user.firstName, lastName: user.lastName, kycStatus: user.kycStatus, balance: user.balance }),
    })
    setMsg('Modifications enregistrées ✔')
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <Link href="/admin/utilisateurs" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
          ← Retour à la liste
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Infos & édition */}
          <div className="bg-white rounded-2xl border p-6">
            <h2 className="font-bold text-gray-800 mb-5">Informations du compte</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Prénom</label>
                <input value={user.firstName} onChange={e => setUser({...user, firstName: e.target.value})}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Nom</label>
                <input value={user.lastName} onChange={e => setUser({...user, lastName: e.target.value})}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                <input value={user.email} disabled
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Statut KYC</label>
                <select value={user.kycStatus} onChange={e => setUser({...user, kycStatus: e.target.value})}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="PENDING">En attente</option>
                  <option value="APPROVED">Validé</option>
                  <option value="REJECTED">Rejeté</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Solde (FCFA)</label>
                <input type="number" value={user.balance}
                  onChange={e => setUser({...user, balance: parseFloat(e.target.value)})}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              {msg && <p className="text-green-600 text-sm font-medium">{msg}</p>}
              <button onClick={save} disabled={saving}
                className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition">
                {saving ? 'Sauvegarde...' : 'Enregistrer'}
              </button>
            </div>
          </div>

          {/* Stats rapides */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border p-6">
              <h2 className="font-bold text-gray-800 mb-4">Statistiques</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-blue-800">{user.subs?.length || 0}</p>
                  <p className="text-xs text-blue-600 mt-1">Souscriptions</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-800">
                    {user.subs?.reduce((a: number, s: any) => a + s.totalAmount, 0).toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-green-600 mt-1">FCFA investi</p>
                </div>
              </div>
            </div>

            {/* Souscriptions */}
            <div className="bg-white rounded-2xl border p-6">
              <h2 className="font-bold text-gray-800 mb-4">Souscriptions</h2>
              {user.subs?.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">Aucune souscription</p>
              ) : (
                <div className="space-y-2">
                  {user.subs?.map((s: any) => (
                    <div key={s.id} className="flex justify-between items-center py-2 border-b last:border-0 text-sm">
                      <div>
                        <p className="font-medium text-gray-800">{s.offering.name}</p>
                        <p className="text-xs text-gray-400">{s.shares} actions</p>
                      </div>
                      <p className="font-bold text-blue-600">{s.totalAmount.toLocaleString()} FCFA</p>
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
