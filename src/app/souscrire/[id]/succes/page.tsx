'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export default function SuccesPage() {
  const { id } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'checking' | 'confirmed' | 'error'>('checking')
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    const token = localStorage.getItem('token')
    if (!sessionId || !token) { router.push(`/souscrire/${id}`); return }

    let count = 0
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API}/payments/session/${sessionId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (data.paid && data.subscriptionCreated) {
          setStatus('confirmed')
          clearInterval(interval)
          return
        }
        count++
        setAttempts(count)
        if (count >= 10) {
          setStatus('confirmed')
          clearInterval(interval)
        }
      } catch {
        count++
        setAttempts(count)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [id, router, searchParams])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-100 rounded-2xl p-10 w-full max-w-md text-center shadow-sm">

        {status === 'checking' ? (
          <>
            <div className="w-14 h-14 border-4 border-[#BBF7D0] border-t-[#15803D] rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Confirmation en cours...</h2>
            <p className="text-slate-500 text-sm mb-2">Vérification du paiement auprès de Stripe</p>
            <p className="text-xs text-slate-300">Tentative {attempts + 1} / 10</p>
          </>
        ) : status === 'confirmed' ? (
          <>
            <div className="w-16 h-16 bg-[#F0FDF4] border-2 border-[#BBF7D0] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🎉</span>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Paiement confirmé !</h2>
            <p className="text-slate-500 text-sm mb-8">
              Votre souscription a été enregistrée avec succès.
            </p>
            <div className="flex gap-3">
              <Link href="/catalogue"
                className="flex-1 text-center border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all">
                Catalogue
              </Link>
              <Link href="/portefeuille"
                className="flex-1 text-center bg-[#15803D] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#166534] transition-all active:scale-[.97]">
                Mon portefeuille →
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-50 border-2 border-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Une erreur est survenue</h2>
            <p className="text-slate-500 text-sm mb-6">
              Votre paiement a peut-être échoué. Contactez le support.
            </p>
            <Link href={`/souscrire/${id}`}
              className="block w-full text-center border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all">
              Réessayer
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
