'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type Offering = {
  id: string
  name: string
  sector: string
  pricePerShare: number
  totalShares: number
  soldShares: number
  minInvest: number
  riskLevel: string
  description: string
  isOpen: boolean
  createdAt: string
}

export default function OfferingDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [offering, setOffering] = useState<Offering | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`http://localhost:3001/api/offerings/${id}`)
      .then(r => r.json())
      .then(data => { setOffering(data); setLoading(false) })
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </div>
  )

  if (!offering) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-500">Offre introuvable</p>
    </div>
  )

  const progress = Math.round((offering.soldShares / offering.totalShares) * 100)
  const remaining = offering.totalShares - offering.soldShares
  const riskColor = {
    'Faible': 'bg-green-100 text-green-700',
    'Moyen': 'bg-yellow-100 text-yellow-700',
    'Élevé': 'bg-red-100 text-red-700',
  }[offering.riskLevel] || 'bg-gray-100 text-gray-600'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <Link href="/catalogue" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
          ← Retour au catalogue
        </Link>

        <div className="bg-white rounded-2xl border p-8 mb-5">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">{offering.name}</h1>
              <p className="text-gray-500">{offering.sector}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${riskColor}`}>
              Risque {offering.riskLevel}
            </span>
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">{offering.description}</p>

          {/* Progression */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">Progression de la levée</span>
              <span className="font-bold text-blue-600 text-lg">{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4">
              <div className="bg-blue-500 h-4 rounded-full transition-all"
                style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{offering.soldShares.toLocaleString()} actions vendues</span>
              <span>{remaining.toLocaleString()} actions restantes</span>
            </div>
          </div>

          {/* Infos clés */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Prix par action', value: `${offering.pricePerShare.toLocaleString()} FCFA` },
              { label: 'Investissement min.', value: `${offering.minInvest.toLocaleString()} FCFA` },
              { label: 'Total actions', value: offering.totalShares.toLocaleString() },
              { label: 'Statut', value: offering.isOpen ? 'Ouvert' : 'Fermé' },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                <p className="font-bold text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>

          {offering.isOpen && (
            <button
              onClick={() => router.push(`/souscrire/${offering.id}`)}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition">
              Souscrire maintenant →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
