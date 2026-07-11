'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  FileText,
  Home,
  UploadCloud,
  CheckCircle,
  HelpCircle,
  FileCheck2,
  Trash2
} from 'lucide-react'

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

  // Files names to show in UI
  const [idCardFile, setIdCardFile] = useState<File | null>(null)
  const [addressFile, setAddressFile] = useState<File | null>(null)

  const idCardRef = useRef<HTMLInputElement>(null)
  const addressRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) {
      router.push('/auth/login')
      return
    }
    setToken(t)
    fetch(`${API}/kyc/me`, { headers: { 'Authorization': `Bearer ${t}` } })
      .then(r => {
        if (!r.ok) { setLoading(false); return } // pas de KYC → reste null
        return r.json()
      })
      .then(data => {
        // Accepter uniquement si data a un vrai statut KYC
        if (data && (data.status === 'PENDING' || data.status === 'APPROVED' || data.status === 'REJECTED')) {
          setKyc(data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  const handleIdCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setIdCardFile(e.target.files[0])
    }
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAddressFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idCardFile || !addressFile) {
      setError('Veuillez sélectionner les deux documents obligatoires.')
      return
    }

    setSubmitting(true)
    setError('')
    const formData = new FormData()
    formData.append('idCard', idCardFile)
    formData.append('addressDoc', addressFile)

    try {
      const res = await fetch(`${API}/kyc`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
        setSubmitting(false)
        return
      }
      setSuccess(true)
      setKyc(data)
    } catch {
      setError('Erreur lors de l\'envoi de votre dossier.')
      setSubmitting(false)
    }
  }

  const statusConfig: Record<string, { label: string; color: string; icon: any; desc: string }> = {
    PENDING: {
      label: 'En attente de validation',
      color: 'border-amber-200 bg-amber-50/50 text-amber-800',
      icon: Clock,
      desc: 'Votre dossier est en cours d\'analyse par notre service de conformité sous 24h.'
    },
    APPROVED: {
      label: 'Identité validée',
      color: 'border-brand-200 bg-brand-50/50 text-brand-900',
      icon: ShieldCheck,
      desc: 'Votre profil de compte est entièrement vérifié. Vous êtes libre d\'investir dans n\'importe quelle opportunité.'
    },
    REJECTED: {
      label: 'Dossier non conforme',
      color: 'border-rose-300 bg-rose-50/50 text-rose-800',
      icon: AlertTriangle,
      desc: 'Certains documents ont été rejetés. Veuillez téléverser à nouveau des pièces lisibles et valides.'
    },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  const currentStatus = kyc && statusConfig[kyc.status] ? statusConfig[kyc.status] : null
  const StatusIcon = currentStatus?.icon

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Vérification d&apos;identité</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Conformité réglementaire KYC (Know Your Customer)</p>
      </div>

      {/* Existing KYC details */}
      {kyc && !success && kyc.status !== 'REJECTED' && currentStatus && (
        <div className={`border rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 ${currentStatus.color}`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-slate-100 flex-shrink-0 shadow-sm">
              <StatusIcon className="w-6 h-6 text-current" />
            </div>
            <div>
              <p className="font-extrabold text-sm sm:text-base leading-tight">{currentStatus.label}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Dossier soumis</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed">{currentStatus.desc}</p>

          {kyc.status === 'APPROVED' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <a
                href={`${API_BASE}${kyc.idCardUrl}?token=${token}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-brand-400 hover:bg-brand-50 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 hover:text-brand-700 transition"
              >
                <FileText className="w-5 h-5" /> Voir la Pièce d&apos;identité
              </a>
              <a
                href={`${API_BASE}${kyc.addressUrl}?token=${token}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-brand-400 hover:bg-brand-50 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 hover:text-brand-700 transition"
              >
                <Home className="w-5 h-5" /> Voir le Justificatif de domicile
              </a>
            </div>
          )}
        </div>
      )}

      {/* Success Notification */}
      {success && (
        <div className="bg-white border border-brand-200 rounded-3xl p-8 sm:p-10 text-center shadow-sm flex flex-col items-center animate-in fade-in duration-300">
          <div className="w-14 h-14 bg-brand-50 border border-brand-100 rounded-full flex items-center justify-center text-brand-600 mb-5 shadow-sm">
            <FileCheck2 className="w-7 h-7" />
          </div>
          <h2 className="text-slate-900 font-extrabold text-lg sm:text-xl mb-2">Documents transmis !</h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-sm leading-relaxed">
            Votre dossier KYC est maintenant en cours d&apos;analyse par nos agents de conformité.
          </p>
        </div>
      )}

      {/* Upload Form (If no kyc or rejected) */}
      {(!kyc || kyc.status === 'REJECTED') && !success && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow">
          <h2 className="text-lg font-extrabold text-slate-900 mb-1">Téléverser vos justificatifs</h2>
          <p className="text-slate-500 text-xs sm:text-sm mb-6">Tous les fichiers doivent être lisibles au format JPG, PNG ou PDF (max 5 Mo).</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ID CARD */}
            <div className="space-y-2">
              <label htmlFor="idCard" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pièce d&apos;identité recto-verso <span className="text-rose-500">*</span>
              </label>
              {idCardFile ? (
                <div className="border border-brand-200 bg-brand-50/10 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-5 h-5 text-brand-600 flex-shrink-0" />
                    <span className="text-xs font-semibold text-slate-700 truncate">{idCardFile.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIdCardFile(null)}
                    aria-label="Supprimer la pièce d'identité"
                    title="Supprimer la pièce d'identité"
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => idCardRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-brand-600 rounded-2xl p-6 text-center transition cursor-pointer bg-slate-50/20 hover:bg-slate-50/50 flex flex-col items-center"
                >
                  <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-xs font-bold text-slate-700">Cliquez pour téléverser votre pièce d&apos;identité</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-semibold">CNI, Passeport en cours de validité</p>
                </div>
              )}
              <input
                ref={idCardRef}
                id="idCard"
                type="file"
                accept="image/*,.pdf"
                aria-label="Téléverser votre pièce d'identité"
                className="hidden"
                onChange={handleIdCardChange}
              />
            </div>

            {/* ADDRESS DOC */}
            <div className="space-y-2">
              <label htmlFor="addressDoc" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Justificatif de domicile de moins de 3 mois <span className="text-rose-500">*</span>
              </label>
              {addressFile ? (
                <div className="border border-brand-200 bg-brand-50/10 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <Home className="w-5 h-5 text-brand-600 flex-shrink-0" />
                    <span className="text-xs font-semibold text-slate-700 truncate">{addressFile.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAddressFile(null)}
                    aria-label="Supprimer le justificatif de domicile"
                    title="Supprimer le justificatif de domicile"
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => addressRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-brand-600 rounded-2xl p-6 text-center transition cursor-pointer bg-slate-50/20 hover:bg-slate-50/50 flex flex-col items-center"
                >
                  <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-xs font-bold text-slate-700">Cliquez pour téléverser votre justificatif</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-semibold">Facture d&apos;eau/élec, Certificat de résidence ou Relevé</p>
                </div>
              )}
              <input
                ref={addressRef}
                id="addressDoc"
                type="file"
                accept="image/*,.pdf"
                aria-label="Téléverser votre justificatif de domicile"
                className="hidden"
                onChange={handleAddressChange}
              />
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-rose-700 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed font-semibold">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-700 hover:bg-brand-800 text-white py-3.5 rounded-xl font-bold transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-4 shadow-sm"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Soumettre mon dossier KYC'
              )}
            </button>
          </form>
        </div>
      )}

      {/* Why kyc box */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-800 tracking-wider uppercase mb-3 flex items-center gap-1.5">
          <HelpCircle className="w-5 h-5 text-brand-600" />
          Rôle de la vérification KYC
        </h3>
        <ul className="text-xs text-slate-500 space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
            <span><strong className="text-slate-700 font-bold">Sécurité financière :</strong> Assure la conformité légale face aux règles de lutte contre le blanchiment.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
            <span><strong className="text-slate-700 font-bold">Protection des transactions :</strong> Sécurise l&apos;émission des titres et des transactions en actions.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
