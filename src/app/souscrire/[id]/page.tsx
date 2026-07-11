'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/auth'
import {
  Building2,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Coins,
  ShieldCheck,
  FileCheck2
} from 'lucide-react'

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
  Faible: 'bg-emerald-50 text-emerald-800 border border-emerald-100',
  Moyen: 'bg-amber-50 text-amber-800 border border-amber-100',
  Élevé: 'bg-rose-50 text-rose-800 border border-rose-100',
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
    if (!token || !u) {
      router.push('/auth/login')
      return
    }
    setUser(JSON.parse(u))
    fetch(`${API}/offerings/${id}`)
      .then(r => r.json())
      .then(data => {
        setOffering(data)
        setLoading(false)
      })
  }, [id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    )
  }

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
      setError(err.response?.data?.error || 'Une erreur est survenue lors de la création du paiement.')
      setSubmitting(false)
    }
  }

  const steps = ['Sélection', 'Vérification', 'Paiement']

  return (
    <div className="max-w-md mx-auto space-y-5 pb-8">
      {/* Back to Offering details */}
      <Link
        href={`/catalogue/${offering.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-700 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Retour aux détails
      </Link>

      {/* Target Offering card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center text-brand-700 flex-shrink-0">
          <Building2 className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 text-sm truncate">{offering.name}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{offering.sector}</p>
        </div>
        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex-shrink-0 ${riskColor[offering.riskLevel]}`}>
          {offering.riskLevel}
        </span>
      </div>

      {/* Main card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow">
        {/* Multi-step Stepper */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-5">
          {steps.map((s, i) => {
            const isCompleted = step > i + 1
            const isActive = step === i + 1
            return (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                      isCompleted
                        ? 'bg-brand-100 text-brand-800 border border-brand-200'
                        : isActive
                        ? 'bg-brand-700 text-white shadow'
                        : 'bg-slate-50 text-slate-400 border border-slate-100'
                    }`}
                  >
                    {isCompleted ? '✓' : i + 1}
                  </div>
                  <span className={`text-[10px] font-bold mt-1.5 uppercase tracking-wide ${isActive ? 'text-brand-700' : 'text-slate-400'}`}>
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-3 mb-5 transition-all ${isCompleted ? 'bg-brand-300' : 'bg-slate-100'}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* STEP 1: SELECT SHARES */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Nombre d&apos;actions</h2>
              <p className="text-slate-500 text-xs mt-1">
                Valeur d&apos;une action : {offering.pricePerShare.toLocaleString()} FCFA
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center">
              <label htmlFor="shares-input" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Quantité à acquérir
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShares(Math.max(minShares, shares - 1))}
                  aria-label="Diminuer le nombre d'actions"
                  title="Diminuer le nombre d'actions"
                  className="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-white hover:border-brand-300 hover:text-brand-700 transition active:scale-95"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  id="shares-input"
                  type="number"
                  value={shares}
                  min={minShares}
                  max={remaining}
                  aria-label="Nombre d'actions à acquérir"
                  onChange={e => setShares(Math.max(minShares, Math.min(remaining, parseInt(e.target.value) || minShares)))}
                  className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-center text-lg font-extrabold focus:outline-none focus:ring-2 focus:ring-brand-600 transition bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShares(Math.min(remaining, shares + 1))}
                  aria-label="Augmenter le nombre d'actions"
                  title="Augmenter le nombre d'actions"
                  className="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-white hover:border-brand-300 hover:text-brand-700 transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-3">
                Min. {minShares} actions · {remaining.toLocaleString()} restantes
              </p>
            </div>

            {/* Total invested banner */}
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 flex justify-between items-center">
              <span className="text-xs font-bold text-brand-900">Montant total</span>
              <span className="text-lg font-extrabold text-brand-700">{totalAmount.toLocaleString()} FCFA</span>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-brand-700 hover:bg-brand-800 text-white py-3.5 rounded-xl font-bold transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-sm"
            >
              Étape suivante <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: VERIFICATION */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Vérification de sécurité</h2>
              <p className="text-slate-500 text-xs mt-1">Vérifiez les critères obligatoires requis</p>
            </div>

            <div className="space-y-3">
              {/* KYC Check card */}
              <div
                className={`flex items-start gap-3.5 p-4.5 rounded-2xl border ${
                  kycOk
                    ? 'border-brand-200 bg-brand-50/50 text-brand-900'
                    : 'border-rose-300 bg-rose-50/50 text-rose-800'
                }`}
              >
                {kycOk ? (
                  <ShieldCheck className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-extrabold text-xs sm:text-sm">
                    {kycOk ? 'Statut KYC valide' : 'Vérification KYC requise'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                    {kycOk ? 'Votre dossier a été validé par la conformité.' : 'Veuillez soumettre vos justificatifs d\'identité.'}
                  </p>
                </div>
              </div>

              {/* Shares check card */}
              <div className="flex items-start gap-3.5 p-4.5 rounded-2xl border border-brand-200 bg-brand-50/50 text-brand-900">
                <CheckCircle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-xs sm:text-sm">Disponibilité des actions</p>
                  <p className="text-[10px] text-slate-500 font-bold mt-0.5">{remaining.toLocaleString()} actions sont disponibles.</p>
                </div>
              </div>

              {/* Secure payment check card */}
              <div className="flex items-start gap-3.5 p-4.5 rounded-2xl border border-blue-200 bg-blue-50/50 text-blue-800">
                <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-xs sm:text-sm">Traitement bancaire Stripe</p>
                  <p className="text-[10px] text-slate-500 font-bold mt-0.5">Transactions sécurisées en mode Sandbox.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-slate-200 text-slate-700 hover:bg-slate-50 py-3.5 rounded-xl text-xs font-bold transition"
              >
                Retour
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!kycOk}
                className="flex-1 bg-brand-700 hover:bg-brand-800 text-white py-3.5 rounded-xl text-xs font-bold disabled:opacity-50 disabled:pointer-events-none transition shadow-sm"
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Récapitulatif & Paiement</h2>
              <p className="text-slate-500 text-xs mt-1">Vérifiez les informations avant validation</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3.5">
              {[
                { label: 'Entreprise partenaire', value: offering.name },
                { label: 'Secteur d\'activité', value: offering.sector },
                { label: 'Nombre d\'actions', value: `${shares} actions` },
                { label: 'Prix unitaire', value: `${offering.pricePerShare.toLocaleString()} FCFA` },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs sm:text-sm">
                  <span className="text-slate-400 font-semibold">{item.label}</span>
                  <span className="font-bold text-slate-800">{item.value}</span>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-3.5 flex justify-between items-center">
                <span className="text-xs font-extrabold text-slate-800 uppercase">Montant Total</span>
                <span className="text-lg font-extrabold text-brand-700">{totalAmount.toLocaleString()} FCFA</span>
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-rose-700 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed font-semibold">{error}</span>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border border-slate-200 text-slate-700 hover:bg-slate-50 py-3.5 rounded-xl text-xs font-bold transition"
              >
                Retour
              </button>
              <button
                onClick={handleCheckout}
                disabled={submitting}
                className="flex-1 bg-brand-700 hover:bg-brand-900 text-white py-3.5 rounded-xl text-xs font-bold disabled:opacity-50 disabled:pointer-events-none transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" /> Valider & Payer
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
