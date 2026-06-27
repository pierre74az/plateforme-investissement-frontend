import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-[#F0FDF4] border-b border-[#BBF7D0] px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-[#DCFCE7] text-[#166534] text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-[#BBF7D0]">
            🇧🇫 Plateforme 100% burkinabè
          </span>
          <h1 className="text-5xl font-semibold leading-tight mb-6 text-slate-900">
            Investissez dans les<br />
            <span className="text-[#15803D]">entreprises du Burkina</span>
          </h1>
          <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Accédez à des opportunités d&apos;investissement dans des entreprises locales à fort potentiel. Technologie, agriculture, énergie, finance et santé.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/register"
              className="bg-[#15803D] text-white px-8 py-3.5 rounded-xl font-medium text-base hover:bg-[#166534] transition-all active:scale-[.97]">
              Commencer à investir →
            </Link>
            <Link href="/about"
              className="bg-white text-slate-700 px-8 py-3.5 rounded-xl font-medium text-base border border-[#BBF7D0] hover:bg-[#F0FDF4] transition-all">
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-100 py-12">
        <div className="max-w-4xl mx-auto px-8 grid grid-cols-3 gap-8 text-center">
          {[
            { value: '5+', label: 'Entreprises partenaires' },
            { value: '10 000 FCFA', label: 'Investissement minimum' },
            { value: '100%', label: 'Sécurisé & réglementé' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-slate-100 rounded-2xl p-6">
              <p className="text-3xl font-semibold text-slate-900 mb-1">{s.value}</p>
              <p className="text-slate-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Secteurs */}
      <section className="max-w-5xl mx-auto px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-slate-900 mb-3">Secteurs disponibles</h2>
          <p className="text-slate-500 text-sm">Diversifiez votre portefeuille sur plusieurs secteurs</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { icon: '💻', label: 'Technologie' },
            { icon: '🌾', label: 'Agriculture' },
            { icon: '⚡', label: 'Énergie' },
            { icon: '🏦', label: 'Finance' },
            { icon: '🏥', label: 'Santé' },
          ].map(s => (
            <div key={s.label}
              className="border border-slate-100 rounded-2xl p-6 text-center hover:border-[#BBF7D0] hover:bg-[#F0FDF4] transition-all cursor-default group">
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className="font-medium text-slate-700 text-sm group-hover:text-[#15803D] transition-colors">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="bg-slate-50 border-y border-slate-100 py-16">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-slate-900 mb-3">Comment ça marche ?</h2>
            <p className="text-slate-500 text-sm">En 3 étapes simples</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', icon: '📝', title: 'Créez votre compte', desc: "Inscrivez-vous gratuitement et complétez votre vérification d'identité (KYC) en quelques minutes." },
              { step: '02', icon: '🔍', title: 'Choisissez une offre', desc: 'Parcourez le catalogue des entreprises disponibles et choisissez selon vos objectifs.' },
              { step: '03', icon: '📈', title: 'Investissez', desc: "Souscrivez aux actions de votre choix et suivez l'évolution de votre portefeuille en temps réel." },
            ].map(s => (
              <div key={s.step}
                className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-sm hover:border-[#BBF7D0] transition-all">
                <p className="text-xs font-semibold text-[#16A34A] mb-3 tracking-wide">{s.step}</p>
                <div className="text-2xl mb-3">{s.icon}</div>
                <h3 className="font-semibold text-slate-800 mb-2 text-base">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-8 py-16 text-center">
        <h2 className="text-3xl font-semibold text-slate-900 mb-4">
          Prêt à investir dans l&apos;économie burkinabè ?
        </h2>
        <p className="text-slate-500 mb-8 text-sm">Rejoignez la plateforme et commencez avec aussi peu que 10 000 FCFA.</p>
        <Link href="/auth/register"
          className="bg-[#15803D] text-white px-10 py-4 rounded-xl font-semibold text-base hover:bg-[#166534] transition-all active:scale-[.97] inline-block">
          Créer mon compte gratuitement →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-8 py-8 bg-slate-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-sm text-slate-400">
          <span>© 2026 InvestBF — Tous droits réservés</span>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-slate-600 transition">À propos</Link>
            <Link href="/faq" className="hover:text-slate-600 transition">FAQ</Link>
            <Link href="/contact" className="hover:text-slate-600 transition">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
