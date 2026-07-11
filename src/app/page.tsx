import Link from 'next/link'
import {
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Coins,
  Cpu,
  Sprout,
  Zap,
  HeartPulse,
  UserPlus,
  Compass,
  CheckCircle2,
  Building2
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50/50">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-24 pb-28 sm:pt-32 sm:pb-36">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600/10 rounded-full filter blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full filter blur-3xl -z-10 pointer-events-none"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-2 bg-brand-950/65 text-brand-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 border border-brand-800/40 shadow-sm animate-fade-in backdrop-blur-md">
            <span>🇧🇫</span> Plateforme d&apos;investissement 100% burkinabè
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8 max-w-5xl mx-auto">
            Investissez dans le futur des <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-300 to-emerald-500">
              entreprises du Burkina
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
            Accédez à des opportunités d&apos;investissement uniques dans des PME locales à fort potentiel. Soutenez l&apos;économie nationale et faites fructifier votre épargne en toute sécurité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-md hover:shadow-brand-600/20 hover:shadow-lg hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Commencer à investir <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto bg-slate-900/50 hover:bg-slate-900 border border-slate-800 text-slate-300 px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-sm text-center backdrop-blur-sm"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Signal / Partners Ticker */}
      <section className="bg-slate-900/40 border-y border-slate-200/5 py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
            Ils nous font confiance
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            <div className="flex items-center gap-2 text-slate-450 font-bold text-sm">
              <Building2 className="w-5 h-5 text-brand-500" /> Chambre de Commerce
            </div>
            <div className="flex items-center gap-2 text-slate-450 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-brand-500" /> Autorités de Régulation
            </div>
            <div className="flex items-center gap-2 text-slate-450 font-bold text-sm">
              <Coins className="w-5 h-5 text-brand-500" /> Banques Partenaires
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {[
            { value: '5+', label: 'Entreprises partenaires', desc: 'Sélectionnées avec rigueur par nos analystes financiers.', icon: Building2, color: 'text-brand-600 bg-brand-50 border border-brand-100' },
            { value: '10 000 FCFA', label: 'Investissement minimum', desc: 'Accessible à tous les profils d\'épargnants pour démarrer.', icon: Coins, color: 'text-emerald-600 bg-emerald-50 border border-emerald-100' },
            { value: '100% sécurisé', label: 'Réglementé & Protégé', desc: 'Vos transactions et données personnelles sont chiffrées.', icon: ShieldCheck, color: 'text-blue-600 bg-blue-50 border border-blue-100' },
          ].map((s, idx) => {
            const Icon = s.icon
            return (
              <div
                key={idx}
                className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition duration-300 flex items-start gap-5 hover:scale-[1.01]"
              >
                <div className={`p-3.5 rounded-2xl ${s.color} flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">{s.value}</p>
                  <p className="font-bold text-slate-800 text-sm mb-2">{s.label}</p>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Secteurs Section */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Secteurs clés d&apos;investissement
            </h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Diversifiez votre portefeuille d&apos;actifs sur plusieurs industries burkinabè en pleine croissance.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
            {[
              { icon: Cpu, label: 'Technologie', color: 'text-blue-600 bg-blue-50/50 hover:border-blue-200 hover:bg-blue-50' },
              { icon: Sprout, label: 'Agriculture', color: 'text-brand-600 bg-brand-50/50 hover:border-brand-200 hover:bg-brand-50' },
              { icon: Zap, label: 'Énergie', color: 'text-amber-600 bg-amber-50/50 hover:border-amber-200 hover:bg-amber-50' },
              { icon: Coins, label: 'Finance', color: 'text-purple-600 bg-purple-50/50 hover:border-purple-200 hover:bg-purple-50' },
              { icon: HeartPulse, label: 'Santé', color: 'text-rose-600 bg-rose-50/50 hover:border-rose-200 hover:bg-rose-50' },
            ].map((s, idx) => {
              const Icon = s.icon
              return (
                <div
                  key={idx}
                  className={`border border-slate-100 rounded-3xl p-6 text-center hover:shadow-sm transition duration-300 cursor-default group bg-slate-50/20 ${s.color}`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-slate-700 text-sm group-hover:text-slate-900 transition-colors">
                    {s.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Comment ça marche Section */}
      <section className="py-20 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Comment ça marche ?</h2>
            <p className="text-slate-500 text-sm sm:text-base">Devenez actionnaire d&apos;entreprises locales en 3 étapes simples.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: UserPlus, title: 'Créez votre compte', desc: "Inscrivez-vous gratuitement et complétez votre vérification d'identité (KYC) en quelques minutes pour valider votre profil d'investisseur." },
              { step: '02', icon: Compass, title: 'Choisissez une offre', desc: 'Explorez notre catalogue de campagnes de financement actives et analysez les performances, les chiffres clés et le projet de chaque entreprise.' },
              { step: '03', icon: TrendingUp, title: 'Investissez', desc: "Souscrivez aux actions de votre choix en utilisant Stripe et suivez l'évolution de votre portefeuille depuis votre espace personnel." },
            ].map((s, idx) => {
              const Icon = s.icon
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-100 rounded-3xl p-8 hover:shadow-md hover:border-brand-200 transition duration-300 relative flex flex-col justify-between hover:scale-[1.01]"
                >
                  <div>
                    <span className="text-xs font-bold text-brand-600 tracking-widest uppercase block mb-4">{s.step}</span>
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mb-6">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-slate-800 mb-3 text-base sm:text-lg">{s.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">{s.desc}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-brand-700 font-bold mt-4 pt-4 border-t border-slate-50">
                    <CheckCircle2 className="w-4 h-4" /> Étape requise
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-16 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/10 rounded-full filter blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none"></div>

          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 max-w-2xl mx-auto leading-tight">
            Prêt à investir dans l&apos;économie burkinabè ?
          </h2>
          <p className="text-slate-405 text-slate-400 mb-10 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Rejoignez des centaines d&apos;investisseurs locaux et de la diaspora. Commencez à faire fructifier votre épargne dès 10 000 FCFA.
          </p>
          <Link
            href="/auth/register"
            className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-md hover:scale-[1.01] active:scale-[0.98] inline-flex items-center gap-2"
          >
            Créer mon compte gratuitement <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  )
}
