'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/auth'

export default function KycPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [info, setInfo] = useState({
    firstName: '', lastName: '', birthDate: '', address: '', profession: '',
  })
  const [idCard, setIdCard] = useState<File | null>(null)
  const [addressDoc, setAddressDoc] = useState<File | null>(null)

  const handleSubmit = async () => {
    if (!idCard || !addressDoc) {
      setError('Veuillez uploader les deux documents')
      return
    }
    setLoading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('idCard', idCard)
      form.append('addressDoc', addressDoc)
      await api.post('/kyc', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      router.push('/dashboard?kyc=submitted')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de l\'envoi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border p-8 w-full max-w-lg">

        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
              }`}>{s}</div>
              {s < 2 && <div className={`h-0.5 w-16 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
          <span className="text-sm text-gray-500 ml-2">
            {step === 1 ? 'Informations personnelles' : 'Documents'}
          </span>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Vos informations</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Prénom</label>
                <input value={info.firstName}
                  onChange={e => setInfo({ ...info, firstName: e.target.value })}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Adama" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Nom</label>
                <input value={info.lastName}
                  onChange={e => setInfo({ ...info, lastName: e.target.value })}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ouedraogo" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Date de naissance</label>
              <input type="date" value={info.birthDate}
                onChange={e => setInfo({ ...info, birthDate: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Adresse complète</label>
              <input value={info.address}
                onChange={e => setInfo({ ...info, address: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Secteur 15, Ouagadougou" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Profession</label>
              <input value={info.profession}
                onChange={e => setInfo({ ...info, profession: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingénieur, Commerçant..." />
            </div>
            <button onClick={() => setStep(2)}
              disabled={!info.firstName || !info.lastName || !info.birthDate || !info.address}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition mt-2">
              Continuer →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Vos documents</h2>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center">
              <p className="text-sm font-medium text-gray-700 mb-1">Pièce d'identité</p>
              <p className="text-xs text-gray-400 mb-3">CNI, passeport ou permis (JPG, PNG, PDF — max 5Mo)</p>
              <input type="file" accept=".jpg,.jpeg,.png,.pdf"
                onChange={e => setIdCard(e.target.files?.[0] || null)}
                className="text-sm text-gray-600" />
              {idCard && <p className="text-xs text-green-600 mt-2">✔ {idCard.name}</p>}
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center">
              <p className="text-sm font-medium text-gray-700 mb-1">Justificatif de domicile</p>
              <p className="text-xs text-gray-400 mb-3">Facture d'eau, d'électricité ou quittance (JPG, PNG, PDF — max 5Mo)</p>
              <input type="file" accept=".jpg,.jpeg,.png,.pdf"
                onChange={e => setAddressDoc(e.target.files?.[0] || null)}
                className="text-sm text-gray-600" />
              {addressDoc && <p className="text-xs text-green-600 mt-2">✔ {addressDoc.name}</p>}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition">
                ← Retour
              </button>
              <button onClick={handleSubmit} disabled={loading || !idCard || !addressDoc}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition">
                {loading ? 'Envoi...' : 'Soumettre le dossier'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
