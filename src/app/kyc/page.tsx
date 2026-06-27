'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001'

export default function KycPage() {
  const router = useRouter()
  const [kyc, setKyc] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [token, setToken] = useState('')
  const idCardRef = useRef<HTMLInputElement>(null)
  const addressRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) { router.push('/auth/login'); return }
    setToken(t)
    fetch(`${API}/kyc/me`, { headers: { 'Authorization': `Bearer ${t}` } })
      .then(r => r.json())
      .then(data => { setKyc(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const idCard = idCardRef.current?.files?.[0]
    const addressDoc = addressRef.current?.files?.[0]
    if (!idCard || !addressDoc) { setError('Veuillez sélectionner les deux documents'); return }

    setSubmitting(true)
    setError('')
    const formData = new FormData()
    formData.append('idCard', idCard)
    formData.append('addressDoc', addressDoc)

    try {
      const res = await fetch(`${API}/kyc`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setSubmitting(false); return }
      setSuccess(true)
      setKyc(data)
    } catch {
      setError('Erreur lors de l\'envoi')
      setSubmitting(false)
    }
  }

  const statusConfig: Record<string, { label: string; color: string; icon: string; desc: string }> = {
    PENDING: { label: 'En attente de validation', color: 'border-amber-200 bg-amber-50', icon: '⏳', desc: 'Votre dossier est en cours d\'examen par notre équipe.' },
    APPROVED: { label: 'Identité vérifiée', color: 'border-[#BBF7D0] bg-[#F0FDF4]', icon: '✅', desc: 'Votre identité a été validée. Vous pouvez maintenant souscrire aux offres.' },
    REJECTED: { label: 'Dossier rejeté', color: 'border-red-200 bg-red-50', icon: '❌', desc: 'Votre dossier a été rejeté. Veuillez soumettre de nouveaux documents.' },
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#BBF7D0] border-t-[#15803D] rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Vérification KYC</h1>
          <p className="text-slate-500 text-sm">Vérification d&apos;identité obligatoire pour investir</p>
        </div>

        {/* Statut existant */}
        {kyc && !success && kyc.status !== 'REJECTED' && (
          <div className={`border-2 rounded-2xl p-6 mb-6 ${statusConfig[kyc.status]?.color}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{statusConfig[kyc.status]?.icon}</span>
              <p className="font-semibold text-slate-800">{statusConfig[kyc.status]?.label}</p>
            </div>
            <p className="text-slate-600 text-sm mb-4">{statusConfig[kyc.status]?.desc}</p>
            {kyc.status === 'APPROVED' && (
              <div className="grid grid-cols-2 gap-3">
                <a href={`${API_BASE}${kyc.idCardUrl}?token=${token}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 bg-white border border-[#BBF7D0] rounded-xl px-4 py-2.5 text-sm text-[#15803D] hover:bg-[#F0FDF4] transition">
                  📄 Pièce d&apos;identité
                </a>
                <a href={`${API_BASE}${kyc.addressUrl}?token=${token}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 bg-white border border-[#BBF7D0] rounded-xl px-4 py-2.5 text-sm text-[#15803D] hover:bg-[#F0FDF4] transition">
                  🏠 Justificatif domicile
                </a>
              </div>
            )}
          </div>
        )}

        {/* Message succès */}
        {success && (
          <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-8 text-center mb-6">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Dossier envoyé !</h2>
            <p className="text-slate-500 text-sm">Votre dossier KYC est en cours d&apos;examen. Vous serez notifié dès la validation.</p>
          </div>
        )}

        {/* Formulaire — si pas de KYC ou rejeté */}
        {(!kyc || kyc.status === 'REJECTED') && !success && (
          <div className="bg-white border border-slate-100 rounded-2xl p-8">
            <h2 className="font-semibold text-slate-800 mb-2">Soumettre votre dossier</h2>
            <p className="text-slate-500 text-sm mb-6">Fournissez les documents suivants pour valider votre identité.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="idCard" className="block text-sm font-medium text-slate-700 mb-2">
                  Pièce d&apos;identité <span className="text-red-400">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-[#16A34A] transition-colors cursor-pointer"
                  onClick={() => idCardRef.current?.click()}>
                  <p className="text-2xl mb-1">📄</p>
                  <p className="text-sm text-slate-600 font-medium">Cliquez pour sélectionner</p>
                  <p className="text-xs text-slate-400 mt-1">CNI, passeport ou permis de conduire (JPG, PNG, PDF)</p>
                </div>
                <input ref={idCardRef} id="idCard" type="file" accept="image/*,.pdf" className="hidden" />
              </div>

              <div>
                <label htmlFor="addressDoc" className="block text-sm font-medium text-slate-700 mb-2">
                  Justificatif de domicile <span className="text-red-400">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-[#16A34A] transition-colors cursor-pointer"
                  onClick={() => addressRef.current?.click()}>
                  <p className="text-2xl mb-1">🏠</p>
                  <p className="text-sm text-slate-600 font-medium">Cliquez pour sélectionner</p>
                  <p className="text-xs text-slate-400 mt-1">Facture d&apos;eau, d&apos;électricité ou relevé bancaire (JPG, PNG, PDF)</p>
                </div>
                <input ref={addressRef} id="addressDoc" type="file" accept="image/*,.pdf" className="hidden" />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button type="submit" disabled={submitting}
                className="w-full bg-[#15803D] text-white py-3 rounded-xl font-semibold hover:bg-[#166534] disabled:opacity-50 transition-all active:scale-[.97]">
                {submitting ? 'Envoi en cours...' : 'Soumettre mon dossier KYC'}
              </button>
            </form>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 bg-slate-50 border border-slate-100 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-600 mb-2">Pourquoi le KYC est-il obligatoire ?</p>
          <ul className="text-xs text-slate-500 space-y-1">
            <li>✔ Conformité réglementaire anti-blanchiment</li>
            <li>✔ Protection des investisseurs</li>
            <li>✔ Sécurisation des transactions financières</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
