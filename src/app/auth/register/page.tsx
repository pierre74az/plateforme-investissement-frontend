'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserPlus, ArrowLeft, Mail, Lock, User, ShieldAlert, CheckCircle, Building2, ShieldCheck, Coins } from 'lucide-react'

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
      if (!res.ok) {
        setError(data.error)
        setLoading(false)
        return
      }
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/dashboard')
    } catch {
      setError('Impossible de contacter le serveur. Veuillez réessayer.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Left panel: Info & Branding (visible on Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20"></div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 font-bold text-white text-2xl tracking-tight">
            <span className="w-4 h-4 rounded-full bg-brand-500 shadow-sm inline-block"></span>
            InvestBF
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight mb-6">
            Prenez part au développement économique local.
          </h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Créez votre compte en quelques minutes et accédez à des opportunités d&apos;investissement uniques.
          </p>

          {/* Quick stats / Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-brand-950 border border-brand-800 text-brand-400 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Investissement en direct</p>
                <p className="text-xs text-slate-450 text-slate-400">Devenez co-actionnaire de PME locales fiables.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">À partir de 10 000 FCFA</p>
                <p className="text-xs text-slate-450 text-slate-400">Une opportunité accessible à tout profil d&apos;épargnant.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500 font-medium">
          © 2026 InvestBF. Plateforme sécurisée et réglementée.
        </div>
      </div>

      {/* Right panel: Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-200/10 rounded-full filter blur-3xl -z-10 lg:hidden"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-200/10 rounded-full filter blur-3xl -z-10 lg:hidden"></div>

        <div className="w-full max-w-md my-8">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-700 transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à l&apos;accueil
          </Link>

          {/* Form Header (Mobile only branding display) */}
          <div className="mb-8 lg:hidden">
            <div className="inline-flex items-center gap-2 font-bold text-slate-900 text-2xl tracking-tight">
              <span className="w-4 h-4 rounded-full bg-brand-600 shadow-sm inline-block"></span>
              InvestBF
            </div>
            <p className="text-slate-400 text-sm mt-1.5 font-medium">Créez votre compte investisseur</p>
          </div>

          {/* Register Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-sm">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Inscription</h1>
            <p className="text-slate-400 text-sm mb-6 font-medium">Complétez les champs ci-dessous pour démarrer</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Prénom
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="firstName"
                      type="text"
                      required
                      placeholder="Adama"
                      value={form.firstName}
                      onChange={e => setForm({ ...form, firstName: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition bg-slate-50/20"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Nom
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="lastName"
                      type="text"
                      required
                      placeholder="Ouédraogo"
                      value={form.lastName}
                      onChange={e => setForm({ ...form, lastName: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition bg-slate-50/20"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-555 text-slate-500 uppercase tracking-wider mb-2">
                  Adresse Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="adama@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition bg-slate-50/20"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold text-slate-555 text-slate-500 uppercase tracking-wider mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition bg-slate-50/20"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                  Recommandé : au moins 8 caractères, une majuscule et un chiffre.
                </p>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-rose-700 text-xs flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-semibold">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-700 hover:bg-brand-800 text-white py-3.5 rounded-xl font-bold transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-4 shadow-sm"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" /> Créer mon compte
                  </>
                )}
              </button>
            </form>

            {/* Benefits Info Box */}
            <div className="mt-6 p-4 bg-brand-50 border border-brand-100 rounded-2xl">
              <p className="text-xs font-bold text-brand-905 text-brand-900 mb-2">Avantages d&apos;InvestBF :</p>
              <ul className="text-xs text-brand-700 space-y-1.5 font-sans">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  Accès direct au catalogue des PME locales
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  Suivi de portefeuille automatisé en temps réel
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  Paiements Stripe 100% sécurisés
                </li>
              </ul>
            </div>

            <div className="h-px bg-slate-100 my-6"></div>

            <p className="text-center text-xs sm:text-sm text-slate-500">
              Déjà inscrit ?{' '}
              <Link href="/auth/login" className="text-brand-700 font-bold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
