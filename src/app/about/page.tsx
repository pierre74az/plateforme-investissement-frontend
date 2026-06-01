import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      <div className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">À propos d'InvestBF</h1>
        <p className="text-gray-500 text-lg mb-12">Notre mission : démocratiser l'investissement au Burkina Faso</p>

        <div className="space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Notre mission</h2>
            <p className="text-gray-600 leading-relaxed">
              InvestBF est une plateforme numérique qui permet aux citoyens burkinabè de participer
              au financement des entreprises locales en souscrivant à des actions. Notre objectif est
              de créer un pont entre les entrepreneurs qui ont besoin de financement et les citoyens
              qui souhaitent faire fructifier leur épargne tout en contribuant au développement économique
              du Burkina Faso.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Nos valeurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: '🔒', title: 'Sécurité', desc: 'Vérification KYC obligatoire, données chiffrées, transactions sécurisées.' },
                { icon: '🌍', title: 'Impact local', desc: 'Chaque investissement contribue directement au développement du Burkina Faso.' },
                { icon: '📊', title: 'Transparence', desc: 'Suivi en temps réel de vos investissements et rapports détaillés disponibles.' },
              ].map(v => (
                <div key={v.title} className="bg-gray-50 rounded-2xl p-5">
                  <div className="text-3xl mb-2">{v.icon}</div>
                  <h3 className="font-bold text-gray-800 mb-1">{v.title}</h3>
                  <p className="text-sm text-gray-500">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Notre équipe</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              InvestBF a été fondé par une équipe de jeunes développeurs et financiers burkinabè
              passionnés par le développement économique de leur pays. Nous croyons que la technologie
              peut jouer un rôle majeur dans la démocratisation de l'investissement en Afrique.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Adama Latif', role: 'Co-fondateur & CTO' },
                { name: 'Pierre Zioubou', role: 'Co-fondateur & CEO' },
              ].map(m => (
                <div key={m.name} className="bg-blue-50 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {m.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{m.name}</p>
                    <p className="text-sm text-gray-500">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
