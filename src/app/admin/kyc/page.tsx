'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001'

type KycEntry = {
  id: string
  status: string
  idCardUrl: string
  addressUrl: string
  createdAt: string
  user: { id: string; firstName: string; lastName: string; email: string }
}

export default function AdminKycPage() {
  const router = useRouter()
  const [kycs, setKycs] = useState<KycEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [token, setToken] = useState('')
  const [filter, setFilter] = useState('ALL')

  const fetchKycs = async () => {
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (!t || !u) { router.push('/auth/login'); return }
    if (JSON.parse(u).role !== 'ADMIN') { router.push('/dashboard'); return }
    setToken(t)
    const res = await fetch(`${API}/kyc/all`, { headers: { 'Authorization': `Bearer ${t}` } })
    const data = await res.json()
    setKycs(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchKycs() }, [])

  const review = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setProcessing(id)
    await fetch(`${API}/kyc/${id}/review`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await fetchKycs()
    setProcessing(null)
  }

  const statusConfig: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'En attente', color: 'bg-amber-50 text-amber-800 border border-amber-200' },
    APPROVED: { label: 'Validé', color: 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]' },
    REJECTED: { label: 'Rejeté', color: 'bg-red-50 text-red-800 border border-red-200' },
  }

  const filtered = filter === 'ALL' ? kycs : kycs.filter(k => k.status === filter)

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#BBF7D0] border-t-[#15803D] rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-8">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Validation KYC</h1>
          <p className="text-slate-500 text-sm">
            {kycs.filter(k => k.status === 'PENDING').length} dossier(s) en attente
          </p>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-6">
          {[
            { value: 'ALL', label: `Tous (${kycs.length})` },
            { value: 'PENDING', label: `En attente (${kycs.filter(k => k.status === 'PENDING').length})` },
            { value: 'APPROVED', label: `Validés (${kycs.filter(k => k.status === 'APPROVED').length})` },
            { value: 'REJECTED', label: `Rejetés (${kycs.filter(k => k.status === 'REJECTED').length})` },
          ].map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                filter === f.value
                  ? 'bg-[#15803D] text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-[#BBF7D0]'
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center">
            <p className="text-slate-400 text-sm">Aucun dossier dans cette catégorie</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(kyc => (
              <div key={kyc.id} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-sm transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F0FDF4] border border-[#BBF7D0] rounded-full flex items-center justify-center font-semibold text-[#15803D] text-sm">
                      {kyc.user.firstName[0]}{kyc.user.lastName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        {kyc.user.firstName} {kyc.user.lastName}
                      </p>
                      <p className="text-xs text-slate-400">{kyc.user.email}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Soumis le {new Date(kyc.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig[kyc.status]?.color}`}>
                    {statusConfig[kyc.status]?.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <a href={`${API_BASE}${kyc.idCardUrl}?token=${token}`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 hover:border-[#BBF7D0] hover:text-[#15803D] hover:bg-[#F0FDF4] transition-all">
                    📄 <span>Pièce d&apos;identité</span>
                  </a>
                  <a href={`${API_BASE}${kyc.addressUrl}?token=${token}`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 hover:border-[#BBF7D0] hover:text-[#15803D] hover:bg-[#F0FDF4] transition-all">
                    🏠 <span>Justificatif domicile</span>
                  </a>
                </div>

                {kyc.status === 'PENDING' && (
                  <div className="flex gap-3">
                    <button onClick={() => review(kyc.id, 'APPROVED')}
                      disabled={processing === kyc.id}
                      className="flex-1 bg-[#15803D] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#166534] disabled:opacity-50 transition-all active:scale-[.97]">
                      {processing === kyc.id ? '...' : '✔ Valider'}
                    </button>
                    <button onClick={() => review(kyc.id, 'REJECTED')}
                      disabled={processing === kyc.id}
                      className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-all active:scale-[.97]">
                      {processing === kyc.id ? '...' : '✖ Rejeter'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
