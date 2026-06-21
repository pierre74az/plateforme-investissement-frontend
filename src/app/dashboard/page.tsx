'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const API = 'http://localhost:3001/api'

type Sub = {
  id: string
  shares: number
  totalAmount: number
  createdAt: string
  offering: { name: string; sector: string; riskLevel: string }
}

type Offering = {
  id: string
  name: string
  sector: string
  pricePerShare: number
  riskLevel: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [subs, setSubs] = useState<Sub[]>([])
  const [offers, setOffers] = useState<Offering[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (!token || !u) { router.push('/auth/login'); return }
    const parsedUser = JSON.parse(u)
    setUser(parsedUser)

    const headers = { 'Authorization': `Bearer ${token}` }

    Promise.all([
      fetch(`${API}/subscriptions/me`, { headers }).then(r => r.json()),
      fetch(`${API}/offerings`).then(r => r.json()),
    ]).then(([subsData, offersData]) => {
      setSubs(Array.isArray(subsData) ? subsData : [])
      setOffers(Array.isArray(offersData) ? offersData.slice(0, 3) : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </div>
  )

  const totalInvesti = subs.reduce((acc, s) => acc + s.totalAmount, 0)
  const totalActions = subs.reduce((acc, s) => acc + s.shares, 0)

  const kycBadge: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
    APPROVED: { label: 'Validé', color: 'bg-green-100 text-green-700' },
    REJECTED: { label: 'Rejeté', color: 'bg-red-100 text-red-700' },
  }
  const kyc = kycBadge[user?.kycStatus] || kycBadge['PENDING']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Bonjour, {user?.firstName} 👋</h2>
            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${kyc.color}`}>
            KYC : {kyc.label}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 rounded-2xl p-5">
            <p className="text-xs font-medium text-blue-600 mb-1">Solde disponible</p>
            <p className="text-xl font-bold text-blue-800">{user?.balance?.toLocaleString()} FCFA</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-5">
            <p className="text-xs font-medium text-green-600 mb-1">Total investi</p>
            <p className="text-xl font-bold text-green-800">{totalInvesti.toLocaleString()} FCFA</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-5">
            <p className="text-xs font-medium text-purple-600 mb-1">Nombre d&apos;actions</p>
            <p className="text-xl font-bold text-purple-800">{totalActions.toLocaleString()}</p>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-5">
            <p className="text-xs font-medium text-yellow-600 mb-1">Investissements</p>
            <p className="text-xl font-bold text-yellow-800">{subs.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">Dernières transactions</h3>
              <Link href="/portefeuille" className="text-xs text-blue-600 hover:underline">Voir tout</Link>
            </div>
            {subs.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">Aucune transaction</p>
            ) : (
              <div className="space-y-3">
                {subs.slice(0, 4).map(s => (
                  <div key={s.id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{s.offering.name}</p>
                      <p className="text-xs text-gray-400">
                        {s.shares} actions · {new Date(s.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-red-500">−{s.totalAmount.toLocaleString()} FCFA</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">Opportunités</h3>
              <Link href="/catalogue" className="text-xs text-blue-600 hover:underline">Voir tout</Link>
            </div>
            <div className="space-y-3">
              {offers.map(o => (
                <Link href={`/catalogue/${o.id}`} key={o.id}>
                  <div className="flex justify-between items-center py-2 border-b last:border-0 hover:bg-gray-50 rounded transition cursor-pointer">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{o.name}</p>
                      <p className="text-xs text-gray-400">{o.sector}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600">{o.pricePerShare.toLocaleString()} FCFA</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        o.riskLevel === 'Faible' ? 'bg-green-100 text-green-700' :
                        o.riskLevel === 'Moyen' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>{o.riskLevel}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {user?.kycStatus !== 'APPROVED' && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex justify-between items-center">
            <div>
              <p className="font-medium text-yellow-800">Complétez votre vérification KYC</p>
              <p className="text-sm text-yellow-600">Vous devez valider votre identité pour pouvoir souscrire</p>
            </div>
            <Link href="/kyc"
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 transition">
              Compléter →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
