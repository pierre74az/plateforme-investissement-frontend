'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

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

const kycConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'En attente', color: 'bg-amber-50 text-amber-800 border border-amber-200' },
  APPROVED: { label: 'Validé', color: 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]' },
  REJECTED: { label: 'Rejeté', color: 'bg-red-50 text-red-800 border border-red-200' },
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
    fetch(`${API}/users`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setUsers(Array.isArray(data) ? data : (data.data || [])); setLoading(false) })
      .catch(() => setLoading(false))
  }, [router])

  const filtered = users.filter(u =>
    u.firstName.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#BBF7D0] border-t-[#15803D] rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-8">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Gestion des investisseurs</h1>
          <p className="text-slate-500 text-sm">{users.length} investisseur(s) enregistré(s)</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou email..."
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-slate-400 py-12 text-sm">Aucun utilisateur trouvé</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Investisseur', 'Email', 'KYC', 'Solde', 'Souscriptions', 'Inscrit le', ''].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#F0FDF4] border border-[#BBF7D0] rounded-full flex items-center justify-center text-[#15803D] text-xs font-semibold flex-shrink-0">
                            {u.firstName[0]}{u.lastName[0]}
                          </div>
                          <span className="font-medium text-slate-800">{u.firstName} {u.lastName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-500 text-xs">{u.email}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${kycConfig[u.kycStatus]?.color}`}>
                          {kycConfig[u.kycStatus]?.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-800">{u.balance.toLocaleString()} FCFA</td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                          {u._count.subs}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-5 py-4">
                        <Link href={`/admin/utilisateurs/${u.id}`}
                          className="text-xs text-[#15803D] font-medium hover:underline">
                          Voir →
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
