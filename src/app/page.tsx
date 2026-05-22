type Offering = {
  id: string
  name: string
  sector: string
  pricePerShare: number
  soldShares: number
  totalShares: number
  riskLevel: string
}

export default async function Home() {
  const res = await fetch('http://localhost:3001/api/offerings', {
    cache: 'no-store',
  })
  const offerings: Offering[] = await res.json()

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Plateforme d'Investissement
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {offerings.map((o) => (
          <div key={o.id} className="border rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-semibold">{o.name}</h2>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {o.sector}
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600 mb-1">
              {o.pricePerShare.toLocaleString()} FCFA
              <span className="text-sm font-normal text-gray-500"> / action</span>
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${Math.round((o.soldShares / o.totalShares) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {Math.round((o.soldShares / o.totalShares) * 100)}% financé
            </p>
            <span className={`text-xs mt-2 inline-block px-2 py-1 rounded-full ${
              o.riskLevel === 'Faible' ? 'bg-green-100 text-green-700' :
              o.riskLevel === 'Moyen' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              Risque {o.riskLevel}
            </span>
          </div>
        ))}
      </div>
    </main>
  )
}
