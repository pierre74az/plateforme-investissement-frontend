'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Home,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Filter,
  FileCheck2,
  ExternalLink
} from 'lucide-react'

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

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: 'En attente', color: 'bg-amber-50 text-amber-800 border border-amber-200', icon: Clock },
  APPROVED: { label: 'Validé', color: 'bg-brand-50 text-brand-800 border border-brand-200', icon: ShieldCheck },
  REJECTED: { label: 'Rejeté', color: 'bg-rose-50 text-rose-800 border border-rose-200', icon: AlertTriangle },
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

  const filtered = filter === 'ALL' ? kycs : kycs.filter(k => k.status === filter)

  const filters = [
    { value: 'ALL', label: `Tous (${kycs.length})` },
    { value: 'PENDING', label: `En attente (${kycs.filter(k => k.status === 'PENDING').length})` },
    { value: 'APPROVED', label: `Validés (${kycs.filter(k => k.status === 'APPROVED').length})` },
    { value: 'REJECTED', label: `Rejetés (${kycs.filter(k => k.status === 'REJECTED').length})` },
  ]

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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Validation KYC</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          {kycs.filter(k => k.status === 'PENDING').length} dossier(s) en attente de traitement
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 pb-1 overflow-x-auto hide-scrollbar flex-nowrap sm:flex-wrap items-center">
        <div className="text-slate-400 p-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5" />
        </div>
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
              filter === f.value
                ? 'bg-brand-700 text-white shadow'
                : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Entries */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm flex flex-col items-center">
          <FileCheck2 className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-700 font-extrabold text-sm">Aucun dossier dans cette catégorie</p>
          <p className="text-slate-400 text-xs mt-1">Les dossiers KYC soumis apparaîtront ici.</p>
        </div>
      ) : (
        <div className="space-y-4 pb-6">
          {filtered.map(kyc => {
            const sc = statusConfig[kyc.status] || statusConfig['PENDING']
            const StatusIcon = sc.icon
            const isProcessing = processing === kyc.id

            return (
              <div
                key={kyc.id}
                className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow transition-all duration-200"
              >
                {/* Top row: user + status */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 bg-brand-50 border border-brand-100 rounded-2xl flex items-center justify-center font-extrabold text-brand-700 text-sm flex-shrink-0">
                      {kyc.user.firstName[0]}{kyc.user.lastName[0]}
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm sm:text-base">
                        {kyc.user.firstName} {kyc.user.lastName}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{kyc.user.email}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">
                        Soumis le {new Date(kyc.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto ${sc.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {sc.label}
                  </span>
                </div>

                {/* Document download buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  <a
                    href={`${API_BASE}${kyc.idCardUrl}?token=${token}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 border border-slate-200 hover:border-brand-300 hover:bg-brand-50/10 rounded-2xl px-4 py-3 text-xs font-bold text-slate-600 hover:text-brand-700 transition-all"
                  >
                    <FileText className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <span className="flex-1">Pièce d&apos;identité</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                  </a>
                  <a
                    href={`${API_BASE}${kyc.addressUrl}?token=${token}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 border border-slate-200 hover:border-brand-300 hover:bg-brand-50/10 rounded-2xl px-4 py-3 text-xs font-bold text-slate-600 hover:text-brand-700 transition-all"
                  >
                    <Home className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <span className="flex-1">Justificatif de domicile</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                  </a>
                </div>

                {/* Action buttons (PENDING only) */}
                {kyc.status === 'PENDING' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => review(kyc.id, 'APPROVED')}
                      disabled={isProcessing}
                      className="flex-1 bg-brand-700 hover:bg-brand-800 text-white py-3 rounded-xl text-xs font-bold disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-1.5 shadow"
                    >
                      {isProcessing ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" /> Valider le dossier
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => review(kyc.id, 'REJECTED')}
                      disabled={isProcessing}
                      className="flex-1 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 py-3 rounded-xl text-xs font-bold disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                      {isProcessing ? (
                        <div className="w-4 h-4 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" /> Rejeter
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
