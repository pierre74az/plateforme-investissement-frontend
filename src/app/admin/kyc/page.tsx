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
  const [error, setError] = useState('')
  const [token, setToken] = useState('')

  const fetchKycs = async () => {
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (!t || !u) { router.push('/auth/login'); return }
    if (JSON.parse(u).role !== 'ADMIN') { router.push('/dashboard'); return }
    setToken(t)

    try {
      const res = await fetch(`${API}/kyc/all`, { headers: { 'Authorization': `Bearer ${t}` } })
      const data = await res.json()
      if (!res.ok) { setError(`Erreur ${res.status}`); setLoading(false); return }
      setKycs(Array.isArray(data) ? data : [])
    } catch {
      setError('Impossible de contacter le serveur')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchKycs() }, [])

  const review = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const t = localStorage.getItem('token')
    if (!t) return
    setProcessing(id)
    try {
      await fetch(`${API}/kyc/${id}/review`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      await fetchKycs()
    } finally {
      setProcessing(null)
    }
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      APPROVED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
    }
    const labels: Record<string, string> = { PENDING: 'En attente', APPROVED: 'Validé', REJECTED: 'Rejeté' }
    return <span className={`text-xs px-2 py-1 rounded-full font-medium ${styles[status]}`}>{labels[status]}</span>
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-500">{error}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Validation KYC</h1>
        <p className="text-gray-500 text-sm mb-6">{kycs.filter(k => k.status === 'PENDING').length} dossier(s) en attente</p>

        {kycs.length === 0 ? (
          <div className="bg-white rounded-2xl border p-8 text-center text-gray-400">Aucun dossier KYC soumis</div>
        ) : (
          <div className="space-y-4">
            {kycs.map((kyc) => (
              <div key={kyc.id} className="bg-white rounded-2xl border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold text-gray-800">{kyc.user.firstName} {kyc.user.lastName}</p>
                    <p className="text-sm text-gray-500">{kyc.user.email}</p>
                    <p className="text-xs text-gray-400 mt-1">Soumis le {new Date(kyc.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                  {statusBadge(kyc.status)}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <a href={`${API_BASE}${kyc.idCardUrl}?token=${token}`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 transition">
                    <span>📄</span> Pièce d&apos;identité
                  </a>
                  <a href={`${API_BASE}${kyc.addressUrl}?token=${token}`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 transition">
                    <span>🏠</span> Justificatif domicile
                  </a>
                </div>

                {kyc.status === 'PENDING' && (
                  <div className="flex gap-3">
                    <button onClick={() => review(kyc.id, 'APPROVED')} disabled={processing === kyc.id}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition">
                      {processing === kyc.id ? '...' : '✔ Valider'}
                    </button>
                    <button onClick={() => review(kyc.id, 'REJECTED')} disabled={processing === kyc.id}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition">
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
