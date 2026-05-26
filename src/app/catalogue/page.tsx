'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type Offering = {
  id: string
  name: string
  sector: string
  pricePerShare: number
  totalShares: number
  soldShares: number
  minInvest: number
  riskLevel: string
  description: string
}

const SECTORS = ['Tous', 'Technologie', 'Agriculture', 'Énergie', 'Finance', 'Santé']
const RISKS = ['Tous', 'Faible', 'Moyen', 'Élevé']

export default function CataloguePage() {
  const [offerings, setOfferings] = useState<Offering[]>([])
  const [loading, setLoading] = useState(true)
  const [sector, setSector] = useState('Tous')
  const [risk, setRisk] = useState('Tous')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (sector !== 'Tous') params.set('sector', sector)
    if (risk !== 'Tous') params.set('risk', risk)
    fetch(`http://localhost:3001/api/offerings?${params}`)
      .then(r => r.json())
      .then(data => { setOfferings(data); setLoading(false) })
  }, [sector, risk])

  const filtered = offerings.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.sector.toLowerCase().includes(search.toLowerCase())
  )

  const riskColor = (r: string) => ({
    'Faible': 'bg-green-100 text-green-700',
    'Moyen': 'bg-yellow-100 text-yellow-700',
    'Élevé': 'bg-red-100 text-red-700',
  }[r] || 'bg-gray-100 text-gray-600')

  const progress = (o: Offering) => Math.round((o.soldShares / o.totalShares) * 100)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Catalogue d'investissement</h1>
          <p className="text-gray-500">Découvrez les opportunités disponibles</p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl border p-5 mb-6 flex flex-wrap gap-4">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une entreprise..."
            className="border rounded-lg px-4 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2 flex-wrap">
            {SECTORS.map(s => (
              <button key={s} onClick={() => setSector(s)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  sector === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>{s}</button>
            ))}
          </div>
          <div className="flex gap-2">
            {RISKS.map(r => (
              <button key={r} onClick={() => setRisk(r)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  risk === r ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>{r}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Aucune offre trouvée</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(o => (
              <Link href={`/catalogue/${o.id}`} key={o.id}>
                <div className="bg-white rounded-2xl border p-6 hover:shadow-md transition cursor-pointer h-full">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="font-bold text-gray-800 text-lg">{o.name}</h2>
                      <p className="text-sm text-gray-500">{o.sector}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${riskColor(o.riskLevel)}`}>
                      {o.riskLevel}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{o.description}</p>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progression</span>
                      <span className="font-medium text-blue-600">{progress(o)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress(o)}%` }} />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <div>
                      <p className="text-xs text-gray-400">Prix / action</p>
                      <p className="font-bold text-gray-800">{o.pricePerShare.toLocaleString()} FCFA</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Investissement min.</p>
                      <p className="font-bold text-green-600">{o.minInvest.toLocaleString()} FCFA</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
