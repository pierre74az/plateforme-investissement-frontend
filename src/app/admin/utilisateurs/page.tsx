'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Users, ShieldCheck, Clock, AlertTriangle, Briefcase, ChevronRight, Wallet } from 'lucide-react'

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

const kycConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING:  { label: 'En attente', color: 'bg-amber-50 text-amber-800 border border-amber-200', icon: Clock },
  APPROVED: { label: 'Validé',    color: 'bg-brand-50 text-brand-800 border border-brand-200', icon: ShieldCheck },
  REJECTED: { label: 'Rejeté',   color: 'bg-rose-50 text-rose-800 border border-rose-200',     icon: AlertTriangle },
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Gestion des investisseurs</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">{users.length} investisseur(s) enregistré(s) sur la plateforme</p>
      </div>

      {/* Search Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom, prénom ou email..."
            className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition bg-slate-50/20"
          />
        </div>
        {search && (
          <p className="text-xs text-slate-400 font-semibold mt-2 pl-1">
            {filtered.length} résultat(s) pour « {search} »
          </p>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden pb-4">
        {filtered.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center">
            <Users className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-700 font-extrabold text-sm">Aucun investisseur trouvé</p>
            <p className="text-slate-400 text-xs mt-1">Modifiez vos critères de recherche.</p>
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100">
                    {['Investisseur', 'Email', 'KYC', 'Solde', 'Souscriptions', 'Inscription', ''].map(h => (
                      <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(u => {
                    const kyc = kycConfig[u.kycStatus] || kycConfig['PENDING']
                    const KycIcon = kyc.icon
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/40 transition-colors">
                        {/* Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center text-brand-700 text-xs font-extrabold flex-shrink-0">
                              {u.firstName[0]}{u.lastName[0]}
                            </div>
                            <span className="font-bold text-slate-800 text-sm whitespace-nowrap">
                              {u.firstName} {u.lastName}
                            </span>
                          </div>
                        </td>
                        {/* Email */}
                        <td className="px-6 py-4 text-xs text-slate-500 font-semibold">{u.email}</td>
                        {/* KYC Badge */}
                        <td className="px-6 py-4">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${kyc.color}`}>
                            <KycIcon className="w-3 h-3" />
                            {kyc.label}
                          </span>
                        </td>
                        {/* Balance */}
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-800 text-sm flex items-center gap-1 whitespace-nowrap">
                            <Wallet className="w-3.5 h-3.5 text-brand-600" />
                            {u.balance.toLocaleString()} F
                          </span>
                        </td>
                        {/* Subscriptions */}
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl text-xs font-extrabold">
                            {u._count.subs}
                          </span>
                        </td>
                        {/* Date */}
                        <td className="px-6 py-4 text-xs font-semibold text-slate-400 whitespace-nowrap">
                          {new Date(u.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        {/* Action */}
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/utilisateurs/${u.id}`}
                            className="text-xs text-brand-700 font-bold hover:text-brand-900 flex items-center gap-0.5 whitespace-nowrap"
                          >
                            Voir <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filtered.map(u => {
                const kyc = kycConfig[u.kycStatus] || kycConfig['PENDING']
                const KycIcon = kyc.icon
                return (
                  <div key={u.id} className="p-5 space-y-3.5 hover:bg-slate-50/20 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center text-brand-700 text-xs font-extrabold flex-shrink-0">
                          {u.firstName[0]}{u.lastName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-850 text-slate-800 text-sm truncate max-w-[170px]">{u.firstName} {u.lastName}</p>
                          <p className="text-[10px] text-slate-450 text-slate-400 font-medium mt-0.5">{u.email}</p>
                        </div>
                      </div>
                      <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${kyc.color}`}>
                        <KycIcon className="w-3 h-3" />
                        {kyc.label}
                      </span>
                    </div>

                    <div className="flex justify-between items-end pt-1">
                      <div className="text-[10px] text-slate-500 font-semibold space-y-0.5">
                        <p className="flex items-center gap-1">
                          <Wallet className="w-3.5 h-3.5 text-brand-600" />
                          Solde : <span className="font-bold text-slate-800">{u.balance.toLocaleString()} F</span>
                        </p>
                        <p className="flex items-center gap-1">
                          Souscriptions : <span className="font-bold text-blue-700">{u._count.subs}</span>
                        </p>
                      </div>
                      <Link
                        href={`/admin/utilisateurs/${u.id}`}
                        className="bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-150 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-0.5"
                      >
                        Gérer <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
