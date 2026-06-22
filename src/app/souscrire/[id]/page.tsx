'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/auth'

type Offering = {
  id: string
  name: string
  sector: string
  pricePerShare: number
  totalShares: number
  soldShares: number
  minInvest: number
  riskLevel: string
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
    fetch(`http://localhost:3001/api/offerings/${id}`)
      .then(r => r.json())
      .then(data => { setOffering(data); setLoading(false) })
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
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
      // Redirection vers la page de paiement Stripe
      window.location.href = res.data.url
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création du paiement')
      setSubmitting(false)
    }
  }

  const stepLabel = ['', 'Sélection', 'Vérification', 'Paiement Stripe']

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border p-8 w-full max-w-lg">

        <div className="flex items-center gap-1 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-1 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                step > s ? 'bg-green-500 text-white' :
                step === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {step > s ? '✓' : s}
              </div>
              {s < 3 && <div className={`h-0.5 flex-1 ${step > s ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mb-6 -mt-4">{stepLabel[step]}</p>

        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Combien d'actions ?</h2>
            <p className="text-sm text-gray-500 mb-6">{offering.name} — {offering.pricePerShare.toLocaleString()} FCFA / action</p>
            <div className="bg-gray-50 rounded-xl p-5 mb-5">
              <label className="text-sm font-medium text-gray-700 block mb-3">Nombre d'actions</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setShares(Math.max(minShares, shares - 1))}
                  className="w-10 h-10 rounded-lg border text-lg font-bold hover:bg-gray-100 transition">−</button>
                <input type="number" value={shares} min={minShares} max={remaining}
                  onChange={e => setShares(Math.max(minShares, parseInt(e.target.value) || minShares))}
                  className="flex-1 border rounded-lg px-3 py-2 text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button onClick={() => setShares(Math.min(remaining, shares + 1))}
                  className="w-10 h-10 rounded-lg border text-lg font-bold hover:bg-gray-100 transition">+</button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Minimum : {minShares} action(s) — Disponibles : {remaining}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between font-bold text-lg">
                <span className="text-gray-800">Total à investir</span>
                <span className="text-blue-600">{totalAmount.toLocaleString()} FCFA</span>
              </div>
            </div>
            <button onClick={() => setStep(2)}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
              Continuer →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Vérification</h2>
            <div className="space-y-3 mb-6">
              <div className={`flex items-center gap-3 p-4 rounded-xl border ${kycOk ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <span className="text-xl">{kycOk ? '✅' : '❌'}</span>
                <div>
                  <p className="font-medium text-sm">{kycOk ? 'KYC validé' : 'KYC non validé'}</p>
                  <p className="text-xs text-gray-500">{kycOk ? 'Votre identité est vérifiée' : 'Complétez votre vérification KYC'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl border border-green-200 bg-green-50">
                <span className="text-xl">✅</span>
                <div>
                  <p className="font-medium text-sm">Offre disponible</p>
                  <p className="text-xs text-gray-500">{remaining} actions restantes</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50">
                <span className="text-xl">💳</span>
                <div>
                  <p className="font-medium text-sm">Paiement sécurisé par Stripe</p>
                  <p className="text-xs text-gray-500">Mode test — aucun montant réel ne sera débité</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
                ← Retour
              </button>
              <button onClick={() => setStep(3)} disabled={!kycOk}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition">
                Continuer →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Confirmer et payer</h2>
            <div className="bg-gray-50 rounded-xl p-5 mb-6 space-y-3">
              {[
                ['Entreprise', offering.name],
                ['Secteur', offering.sector],
                ['Nombre d\'actions', `${shares} actions`],
                ['Prix unitaire', `${offering.pricePerShare.toLocaleString()} FCFA`],
                ['Montant total', `${totalAmount.toLocaleString()} FCFA`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-800">{value}</span>
                </div>
              ))}
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-600 text-sm mb-4">{error}</div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setStep(2)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
                ← Retour
              </button>
              <button onClick={handleCheckout} disabled={submitting}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition">
                {submitting ? 'Redirection...' : '💳 Payer avec Stripe'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
