import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-8 py-20 text-center">
        <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-6 inline-block">
          🇧🇫 Plateforme 100% burkinabè
        </span>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Investissez dans les<br />
          <span className="text-blue-600">entreprises du Burkina</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Accédez à des opportunités d'investissement dans des entreprises locales à fort potentiel. Technologie, agriculture, énergie, finance et santé.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition">
            Commencer à investir →
          </Link>
          <Link href="/about"
            className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition">
            En savoir plus
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-600 py-12">
        <div className="max-w-4xl mx-auto px-8 grid grid-cols-3 gap-8 text-center text-white">
          {[
            { value: '5+', label: 'Entreprises partenaires' },
            { value: '10 000 FCFA', label: 'Investissement minimum' },
            { value: '100%', label: 'Sécurisé & réglementé' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-4xl font-bold mb-1">{s.value}</p>
              <p className="text-blue-200 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Secteurs */}
      <section className="max-w-5xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">Secteurs disponibles</h2>
        <p className="text-center text-gray-500 mb-10">Diversifiez votre portefeuille sur plusieurs secteurs</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { icon: '💻', label: 'Technologie', color: 'bg-blue-50 border-blue-100' },
            { icon: '🌾', label: 'Agriculture', color: 'bg-green-50 border-green-100' },
            { icon: '⚡', label: 'Énergie', color: 'bg-yellow-50 border-yellow-100' },
            { icon: '🏦', label: 'Finance', color: 'bg-purple-50 border-purple-100' },
            { icon: '🏥', label: 'Santé', color: 'bg-red-50 border-red-100' },
          ].map(s => (
            <div key={s.label} className={`${s.color} border rounded-2xl p-6 text-center`}>
              <div className="text-4xl mb-2">{s.icon}</div>
              <p className="font-medium text-gray-700">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">Comment ça marche ?</h2>
          <p className="text-center text-gray-500 mb-12">En 3 étapes simples</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', icon: '📝', title: 'Créez votre compte', desc: 'Inscrivez-vous gratuitement et complétez votre vérification d\'identité (KYC) en quelques minutes.' },
              { step: '2', icon: '🔍', title: 'Choisissez une offre', desc: 'Parcourez le catalogue des entreprises disponibles et choisissez selon vos objectifs.' },
              { step: '3', icon: '📈', title: 'Investissez', desc: 'Souscrivez aux actions de votre choix et suivez l\'évolution de votre portefeuille en temps réel.' },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {s.step}
                </div>
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-3xl mx-auto px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Prêt à investir dans l'économie burkinabè ?</h2>
        <p className="text-gray-500 mb-8">Rejoignez la plateforme et commencez avec aussi peu que 10 000 FCFA.</p>
        <Link href="/auth/register"
          className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition inline-block">
          Créer mon compte gratuitement →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 px-8 py-8">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-sm text-gray-400">
          <span>© 2025 InvestBF — Tous droits réservés</span>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-gray-600">À propos</Link>
            <Link href="/faq" className="hover:text-gray-600">FAQ</Link>
            <Link href="/contact" className="hover:text-gray-600">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
