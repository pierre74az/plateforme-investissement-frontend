'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/auth'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

type Offering = {
  id: string
  name: string
  sector: string
  pricePerShare: number
  totalShares: number
  soldShares: number
  minInvest: number
  riskLevel: string
  isOpen: boolean
}

const riskColor: Record<string, string> = {
  Faible: 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]',
  Moyen: 'bg-amber-50 text-amber-800 border border-amber-200',
  Élevé: 'bg-red-50 text-red-800 border border-red-200',
}

export default function SouscrirePage() {
  const { id } = useParams()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [offering, setOffering] = useState<Offering | null>(null)
  const [shares, setShares] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (!token || !u) { router.push('/auth/login'); return }
    setUser(JSON.parse(u))
    fetch(`${API}/offerings/${id}`)
      .then(r => r.json())
      .then(data => { setOffering(data); setLoading(false) })
  }, [id, router])

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#BBF7D0] border-t-[#15803D] rounded-full animate-spin"></div>
    </div>
  )

  if (!offering) return null

  const minShares = Math.ceil(offering.minInvest / offering.pricePerShare)
  const totalAmount = shares * offering.pricePerShare
  const remaining = offering.totalShares - offering.soldShares
  const kycOk = user?.kycStatus === 'APPROVED'

  const handleCheckout = async () => {
    setSubmitting(true)
    setError('')
    try {
      const res = await api.post('/payments/checkout', { offeringId: offering.id, shares })
      window.location.href = res.data.url
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création du paiement')
      setSubmitting(false)
    }
  }

  const steps = ['Sélection', 'Vérification', 'Paiement']

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* En-tête offre */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl flex items-center justify-center text-lg">
            🏢
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-900 text-sm">{offering.name}</p>
            <p className="text-xs text-slate-400">{offering.sector}</p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${riskColor[offering.riskLevel]}`}>
            {offering.riskLevel}
          </span>
        </div>

        {/* Card principale */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6">

          {/* Stepper */}
          <div className="flex items-center mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    step > i + 1 ? 'bg-[#F0FDF4] text-[#166534] border border-[#16A34A]'
                    : step === i + 1 ? 'bg-[#15803D] text-white'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs mt-1 ${step === i + 1 ? 'text-[#15803D] font-medium' : 'text-slate-400'}`}>
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-4 transition-all ${step > i + 1 ? 'bg-[#16A34A]' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Étape 1 — Sélection */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Combien d&apos;actions ?</h2>
              <p className="text-sm text-slate-500 mb-6">
                {offering.pricePerShare.toLocaleString()} FCFA par action
              </p>

              <div className="bg-slate-50 rounded-xl p-5 mb-5">
                <label className="text-xs font-medium text-slate-600 block mb-3">Nombre d&apos;actions</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShares(Math.max(minShares, shares - 1))}
                    className="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 text-lg font-semibold hover:bg-white hover:border-[#BBF7D0] transition-all active:scale-[.95]">
                    −
                  </button>
                  <input
                    type="number" value={shares} min={minShares} max={remaining}
                    onChange={e => setShares(Math.max(minShares, Math.min(remaining, parseInt(e.target.value) || minShares)))}
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#16A34A] transition"
                  />
                  <button
                    onClick={() => setShares(Math.min(remaining, shares + 1))}
                    className="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 text-lg font-semibold hover:bg-white hover:border-[#BBF7D0] transition-all active:scale-[.95]">
                    +
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                  Minimum : {minShares} action(s) · {remaining.toLocaleString()} disponibles
                </p>
              </div>

              <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#166534]">Total à investir</span>
                  <span className="text-xl font-semibold text-[#15803D]">{totalAmount.toLocaleString()} FCFA</span>
                </div>
              </div>

              <button onClick={() => setStep(2)}
                className="w-full bg-[#15803D] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#166534] transition-all active:scale-[.97]">
                Continuer →
              </button>
            </div>
          )}

          {/* Étape 2 — Vérification */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Vérification</h2>
              <p className="text-sm text-slate-500 mb-6">Confirmez votre éligibilité</p>

              <div className="space-y-3 mb-6">
                <div className={`flex items-center gap-3 p-4 rounded-xl border ${
                  kycOk ? 'border-[#BBF7D0] bg-[#F0FDF4]' : 'border-red-200 bg-red-50'
                }`}>
                  <span className="text-xl">{kycOk ? '✅' : '❌'}</span>
                  <div>
                    <p className="font-medium text-sm text-slate-800">
                      {kycOk ? 'KYC validé' : 'KYC non validé'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {kycOk ? 'Votre identité est vérifiée' : 'Complétez votre vérification KYC'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4]">
                  <span className="text-xl">✅</span>
                  <div>
                    <p className="font-medium text-sm text-slate-800">Offre disponible</p>
                    <p className="text-xs text-slate-500 mt-0.5">{remaining.toLocaleString()} actions restantes</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50">
                  <span className="text-xl">💳</span>
                  <div>
                    <p className="font-medium text-sm text-slate-800">Paiement sécurisé Stripe</p>
                    <p className="text-xs text-slate-500 mt-0.5">Mode test — aucun montant réel débité</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)}
                  className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all">
                  ← Retour
                </button>
                <button onClick={() => setStep(3)} disabled={!kycOk}
                  className="flex-1 bg-[#15803D] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#166534] disabled:opacity-50 transition-all active:scale-[.97]">
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {/* Étape 3 — Paiement */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Confirmer et payer</h2>
              <p className="text-sm text-slate-500 mb-6">Récapitulatif de votre souscription</p>

              <div className="bg-slate-50 rounded-xl p-5 mb-5 space-y-3">
                {[
                  ['Entreprise', offering.name],
                  ['Secteur', offering.sector],
                  ['Nombre d\'actions', `${shares} actions`],
                  ['Prix unitaire', `${offering.pricePerShare.toLocaleString()} FCFA`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-medium text-slate-800">{value}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-3 flex justify-between">
                  <span className="text-sm font-semibold text-slate-800">Total</span>
                  <span className="text-base font-semibold text-[#15803D]">{totalAmount.toLocaleString()} FCFA</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(2)}
                  className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all">
                  ← Retour
                </button>
                <button onClick={handleCheckout} disabled={submitting}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-[.97]">
                  {submitting ? 'Redirection...' : '💳 Payer avec Stripe'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
