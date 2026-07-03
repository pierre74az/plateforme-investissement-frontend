'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/dashboard')
    } catch {
      setError('Impossible de contacter le serveur')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-900 font-semibold text-xl mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] inline-block"></span>
            InvestBF
          </Link>
          <p className="text-slate-500 text-sm mt-2">Créez votre compte investisseur</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900 mb-6">Inscription</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Prénom
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  placeholder="Adama"
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nom
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  placeholder="Ouédraogo"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="adama@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="Min. 8 caractères, 1 majuscule, 1 chiffre"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition"
              />
              <p className="text-xs text-slate-400 mt-1">
                Au moins 8 caractères, une majuscule et un chiffre
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#15803D] text-white py-3 rounded-xl font-semibold hover:bg-[#166534] disabled:opacity-50 transition-all active:scale-[.97] mt-2">
              {loading ? 'Création du compte...' : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl">
            <p className="text-xs text-[#166534] font-medium mb-1">Pourquoi créer un compte ?</p>
            <ul className="text-xs text-[#15803D] space-y-1">
              <li>✔ Accédez au catalogue des offres d&apos;actions</li>
              <li>✔ Souscrivez et gérez votre portefeuille</li>
              <li>✔ Paiement sécurisé par Stripe</li>
            </ul>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Déjà un compte ?{' '}
            <Link href="/auth/login" className="text-[#15803D] font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
