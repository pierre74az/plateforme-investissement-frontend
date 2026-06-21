'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const API = 'http://localhost:3001/api'

const asArray = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload
  if (payload && typeof payload === 'object' && 'data' in payload && Array.isArray(payload.data)) {
    return payload.data as T[]
  }
  return []
}

type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  kycStatus: string
  balance: number
  createdAt: string
  _count: { subs: number }
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (!token || !u) { router.push('/auth/login'); return }
    if (JSON.parse(u).role !== 'ADMIN') { router.push('/dashboard'); return }

    fetch(`${API}/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json())
      .then(data => { setUsers(asArray<User>(data)); setLoading(false) })
      .catch(() => setLoading(false))
  }, [router])

  const filtered = users.filter(u =>
    u.firstName.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const kycBadge: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
  }
  const kycLabel: Record<string, string> = {
    PENDING: 'En attente', APPROVED: 'Validé', REJECTED: 'Rejeté',
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des investisseurs</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} investisseur(s) enregistré(s)</p>
        </div>

        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="p-5 border-b">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou email..."
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-12">Aucun utilisateur trouvé</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Investisseur', 'Email', 'KYC', 'Solde', 'Souscriptions', 'Inscrit le', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr key={u.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-5 py-4 font-medium text-gray-800">{u.firstName} {u.lastName}</td>
                      <td className="px-5 py-4 text-gray-500">{u.email}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${kycBadge[u.kycStatus]}`}>
                          {kycLabel[u.kycStatus]}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium">{u.balance.toLocaleString()} FCFA</td>
                      <td className="px-5 py-4 text-center font-bold text-blue-600">{u._count.subs}</td>
                      <td className="px-5 py-4 text-gray-400">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td className="px-5 py-4">
                        <Link href={`/admin/utilisateurs/${u.id}`} className="text-xs text-blue-600 hover:underline">
                          Voir fiche
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
