'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

type Offering = {
  id: string
  name: string
  sector: string
  pricePerShare: number
  totalShares: number
  soldShares: number
  minInvest: number
  description: string
  riskLevel: string
  isOpen: boolean
  _count: { subs: number }
}

const riskColor: Record<string, string> = {
  Faible: 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]',
  Moyen: 'bg-amber-50 text-amber-800 border border-amber-200',
  Élevé: 'bg-red-50 text-red-800 border border-red-200',
}

const sectorIcon: Record<string, string> = {
  Technologie: '💻', Agriculture: '🌾', Énergie: '⚡', Finance: '🏦', Santé: '🏥',
}

export default function OfferingDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [offering, setOffering] = useState<Offering | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
    fetch(`${API}/offerings/${id}`)
      .then(r => r.json())
      .then(data => { setOffering(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#BBF7D0] border-t-[#15803D] rounded-full animate-spin"></div>
    </div>
  )

  if (!offering) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-slate-400">Offre introuvable</p>
    </div>
  )

  const pct = Math.round((offering.soldShares / offering.totalShares) * 100)
  const remaining = offering.totalShares - offering.soldShares
  const kycOk = user?.kycStatus === 'APPROVED'

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-8">

        <Link href="/catalogue"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition mb-6">
          ← Retour au catalogue
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Infos principales */}
          <div className="md:col-span-2 space-y-5">
            <div className="bg-white border border-slate-100 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-2xl">
                    {sectorIcon[offering.sector] || '🏢'}
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-slate-900">{offering.name}</h1>
                    <p className="text-sm text-slate-400 mt-0.5">{offering.sector}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${riskColor[offering.riskLevel]}`}>
                    {offering.riskLevel}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    offering.isOpen
                      ? 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    {offering.isOpen ? 'Ouverte' : 'Fermée'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{offering.description}</p>
            </div>

            {/* Progression */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6">
              <h3 className="font-semibold text-slate-800 text-sm mb-4">Progression de la levée</h3>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full bg-[#16A34A] transition-all"
                  style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-slate-500">{offering.soldShares.toLocaleString()} actions vendues</span>
                <span className="font-semibold text-[#15803D]">{pct}%</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-semibold text-slate-900">{offering.totalShares.toLocaleString()}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Total actions</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-semibold text-[#15803D]">{remaining.toLocaleString()}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Disponibles</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-semibold text-blue-600">{offering._count?.subs || 0}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Investisseurs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Panneau d'investissement */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-6">
              <h3 className="font-semibold text-slate-800 text-sm mb-4">Détails de l&apos;offre</h3>
              <div className="space-y-3">
                {[
                  { label: 'Prix par action', value: `${offering.pricePerShare.toLocaleString()} FCFA` },
                  { label: 'Investissement min.', value: `${offering.minInvest.toLocaleString()} FCFA` },
                  { label: 'Niveau de risque', value: offering.riskLevel },
                  { label: 'Secteur', value: offering.sector },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                    <span className="text-xs text-slate-400">{item.label}</span>
                    <span className="text-sm font-medium text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-5">
              <p className="text-sm font-semibold text-[#15803D] mb-1">
                {offering.pricePerShare.toLocaleString()} FCFA / action
              </p>
              <p className="text-xs text-[#166534] mb-4">
                Minimum : {offering.minInvest.toLocaleString()} FCFA
              </p>

              {!user ? (
                <Link href="/auth/login"
                  className="block text-center bg-[#15803D] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#166534] transition-all active:scale-[.97]">
                  Se connecter pour investir
                </Link>
              ) : !kycOk ? (
                <div>
                  <p className="text-xs text-amber-700 mb-3 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                    KYC requis avant de pouvoir souscrire
                  </p>
                  <Link href="/kyc"
                    className="block text-center bg-amber-500 text-white py-3 rounded-xl text-sm font-semibold hover:bg-amber-600 transition-all active:scale-[.97]">
                    Compléter mon KYC →
                  </Link>
                </div>
              ) : !offering.isOpen ? (
                <button disabled
                  className="w-full bg-slate-200 text-slate-400 py-3 rounded-xl text-sm font-semibold cursor-not-allowed">
                  Offre fermée
                </button>
              ) : (
                <Link href={`/souscrire/${offering.id}`}
                  className="block text-center bg-[#15803D] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#166534] transition-all active:scale-[.97]">
                  Investir maintenant →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
