import {
  Sprout,
  ShieldCheck,
  TrendingUp,
  Building2,
  Cpu,
  Zap,
  Coins,
  HeartPulse,
  Award,
  GraduationCap
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-50 via-emerald-50/20 to-white border-b border-brand-100/60 py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 bg-brand-100 text-brand-900 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-brand-200 shadow-sm">
            À propos
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            La première plateforme d&apos;investissement burkinabè
          </h1>
          <p className="text-slate-500 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto">
            InvestBF connecte les investisseurs locaux et de la diaspora aux entreprises du Burkina Faso, favorisant un impact économique concret et transparent.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">Notre mission</h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-6">
              Nous croyons fermement que le développement économique durable du Burkina Faso repose sur le dynamisme de ses entrepreneurs et l&apos;implication active de ses citoyens. InvestBF a été créée pour démocratiser l&apos;investissement et lever les barrières d&apos;accès au capital.
            </p>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Nous facilitons le financement participatif en actions pour permettre à chacun, dès 10 000 FCFA, de devenir actionnaire de PME locales prometteuses et de participer directement à la création de valeur et d&apos;emplois.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Award, title: 'Accessibilité', desc: 'Investir en actions dès 10 000 FCFA' },
              { icon: ShieldCheck, title: 'Sécurité', desc: 'Paiements Stripe 100% sécurisés' },
              { icon: TrendingUp, title: 'Transparence', desc: 'Suivi de portefeuille en temps réel' },
              { icon: Building2, title: 'Impact Local', desc: 'Soutien aux PME burkinabè' },
            ].map((v, idx) => {
              const Icon = v.icon
              return (
                <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow transition duration-200">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-slate-800 text-sm mb-1">{v.title}</p>
                  <p className="text-slate-500 text-xs leading-relaxed">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Secteurs */}
      <section className="bg-white border-y border-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center mb-4 tracking-tight">Secteurs d&apos;activités clés</h2>
          <p className="text-slate-500 text-sm text-center mb-12 max-w-lg mx-auto">Nous ciblons des secteurs à fort impact social et économique pour le développement du pays.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              { icon: Cpu, label: 'Technologie', color: 'bg-blue-50/50 border-blue-100 text-blue-700' },
              { icon: Sprout, label: 'Agriculture', color: 'bg-brand-50/50 border-brand-100 text-brand-700' },
              { icon: Zap, label: 'Énergie', color: 'bg-amber-50/50 border-amber-100 text-amber-700' },
              { icon: Coins, label: 'Finance', color: 'bg-purple-50/50 border-purple-100 text-purple-700' },
              { icon: HeartPulse, label: 'Santé', color: 'bg-rose-50/50 border-rose-100 text-rose-700' },
            ].map((s, idx) => {
              const Icon = s.icon
              return (
                <div key={idx} className={`${s.color} border rounded-2xl p-6 text-center hover:shadow transition duration-200 flex flex-col items-center justify-center`}>
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-slate-800 text-sm">{s.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Projet Académique */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="w-14 h-14 bg-brand-50 border border-brand-100 text-brand-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">Projet académique</h2>
          <p className="text-slate-500 text-sm leading-relaxed max-w-2xl mx-auto mb-8">
            InvestBF est un projet de fin d&apos;études développé dans le cadre d&apos;une formation en ingénierie logicielle. Il démontre la faisabilité technique d&apos;une plateforme fintech adaptée au contexte burkinabè et intègre des flux de paiements réels via Stripe.
          </p>
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-800 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm">
            🎓 Projet de soutenance · 2026
          </div>
        </div>
      </section>

    </div>
  )
}
