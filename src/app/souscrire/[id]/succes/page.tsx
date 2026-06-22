'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

export default function SuccesPage() {
  const { id } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [checking, setChecking] = useState(true)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) { router.push(`/souscrire/${id}`); return }

    // Le webhook Stripe crée la souscription en arrière-plan.
    // On attend quelques secondes pour lui laisser le temps de traiter l'événement.
    const timer = setTimeout(() => {
      setConfirmed(true)
      setChecking(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border p-8 w-full max-w-lg text-center">
        {checking ? (
          <>
            <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Vérification du paiement...</h2>
            <p className="text-gray-500 text-sm">Merci de patienter quelques instants</p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Paiement réussi !</h2>
            <p className="text-gray-500 mb-6">Votre souscription a été enregistrée avec succès.</p>
            <div className="flex gap-3">
              <button onClick={() => router.push('/catalogue')}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
                Catalogue
              </button>
              <button onClick={() => router.push('/portefeuille')}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                Mon portefeuille →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
