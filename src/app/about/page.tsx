export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-[#F0FDF4] border-b border-[#BBF7D0] px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-[#DCFCE7] text-[#166534] text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-[#BBF7D0]">
            À propos
          </span>
          <h1 className="text-4xl font-semibold text-slate-900 mb-4">
            La première plateforme d&apos;investissement burkinabè
          </h1>
          <p className="text-slate-500 leading-relaxed">
            InvestBF connecte les investisseurs locaux aux entreprises burkinabè à fort potentiel, en toute transparence et sécurité.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Notre mission</h2>
            <p className="text-slate-500 leading-relaxed mb-4">
              Nous croyons que chaque Burkinabè devrait avoir accès aux opportunités d&apos;investissement dans l&apos;économie locale. InvestBF démocratise l&apos;investissement en actions en rendant le processus simple, transparent et accessible dès 10 000 FCFA.
            </p>
            <p className="text-slate-500 leading-relaxed">
              Notre plateforme connecte les entrepreneurs qui cherchent des capitaux avec les investisseurs qui souhaitent faire fructifier leur épargne tout en soutenant l&apos;économie nationale.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🎯', title: 'Accessibilité', desc: 'Investir dès 10 000 FCFA' },
              { icon: '🔒', title: 'Sécurité', desc: 'Paiements Stripe sécurisés' },
              { icon: '📊', title: 'Transparence', desc: 'Suivi en temps réel' },
              { icon: '🇧🇫', title: 'Local', desc: 'Entreprises burkinabè' },
            ].map(v => (
              <div key={v.title} className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <div className="text-2xl mb-2">{v.icon}</div>
                <p className="font-semibold text-slate-800 text-sm mb-1">{v.title}</p>
                <p className="text-slate-500 text-xs">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secteurs */}
      <section className="bg-slate-50 border-y border-slate-100 py-16">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-semibold text-slate-900 text-center mb-10">Secteurs couverts</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: '💻', label: 'Technologie', color: 'bg-blue-50 border-blue-100' },
              { icon: '🌾', label: 'Agriculture', color: 'bg-[#F0FDF4] border-[#BBF7D0]' },
              { icon: '⚡', label: 'Énergie', color: 'bg-amber-50 border-amber-100' },
              { icon: '🏦', label: 'Finance', color: 'bg-purple-50 border-purple-100' },
              { icon: '🏥', label: 'Santé', color: 'bg-red-50 border-red-100' },
            ].map(s => (
              <div key={s.label} className={`${s.color} border rounded-2xl p-5 text-center`}>
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="font-medium text-slate-700 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe / valeurs */}
      <section className="max-w-4xl mx-auto px-8 py-16 text-center">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Projet académique</h2>
        <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed mb-8">
          InvestBF est un projet de fin d&apos;études développé dans le cadre d&apos;une formation en ingénierie logicielle. Il démontre la faisabilité technique d&apos;une plateforme fintech adaptée au contexte burkinabè.
        </p>
        <div className="inline-flex items-center gap-2 bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] text-sm font-medium px-5 py-2.5 rounded-xl">
          🎓 Projet soutenance 2026
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-8 py-8 bg-slate-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-sm text-slate-400">
          <span>© 2026 InvestBF — Tous droits réservés</span>
          <div className="flex gap-6">
            <a href="/faq" className="hover:text-slate-600 transition">FAQ</a>
            <a href="/contact" className="hover:text-slate-600 transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
