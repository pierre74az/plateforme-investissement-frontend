'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'

type Sub = {
  id: string
  shares: number
  totalAmount: number
  createdAt: string
  offering: {
    id: string
    name: string
    sector: string
    pricePerShare: number
    riskLevel: string
  }
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function PortefeuillePage() {
  const router = useRouter()
  const [subs, setSubs] = useState<Sub[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (!token || !u) { router.push('/auth/login'); return }
    const parsedUser = JSON.parse(u)
    setUser(parsedUser)

    fetch('http://localhost:3001/api/subscriptions/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setSubs(Array.isArray(data) ? data : (data.data || [])); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </div>
  )

  const totalInvesti = subs.reduce((acc, s) => acc + s.totalAmount, 0)
  const totalActions = subs.reduce((acc, s) => acc + s.shares, 0)

  const pieData = subs.map(s => ({
    name: s.offering.name,
    value: s.totalAmount,
  }))

  const lineData = [...subs]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .reduce((acc: any[], s, i) => {
      const prev = acc[i - 1]?.total || 0
      acc.push({
        date: new Date(s.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
        total: prev + s.totalAmount,
      })
      return acc
    }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Mon Portefeuille</h1>
        <p className="text-gray-500 text-sm mb-8">{subs.length} investissement(s)</p>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <p className="text-sm text-blue-600 font-medium mb-1">Total investi</p>
            <p className="text-2xl font-bold text-blue-800">{totalInvesti.toLocaleString()} FCFA</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
            <p className="text-sm text-green-600 font-medium mb-1">Nombre d'actions</p>
            <p className="text-2xl font-bold text-green-800">{totalActions.toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
            <p className="text-sm text-purple-600 font-medium mb-1">Solde disponible</p>
            <p className="text-2xl font-bold text-purple-800">{user?.balance?.toLocaleString()} FCFA</p>
          </div>
        </div>

        {subs.length === 0 ? (
          <div className="bg-white rounded-2xl border p-12 text-center">
            <p className="text-4xl mb-4">📊</p>
            <p className="text-gray-500 mb-4">Vous n'avez pas encore d'investissements</p>
            <button onClick={() => router.push('/catalogue')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
              Découvrir le catalogue
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div className="bg-white rounded-2xl border p-6">
                <h2 className="font-bold text-gray-800 mb-4">Répartition par entreprise</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name }) => name}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => `${v.toLocaleString()} FCFA`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-2xl border p-6">
                <h2 className="font-bold text-gray-800 mb-4">Évolution du portefeuille</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: any) => `${v.toLocaleString()} FCFA`} />
                    <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl border overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="font-bold text-gray-800">Mes positions</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Entreprise', 'Secteur', 'Actions', 'Montant investi', 'Risque', 'Date'].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {subs.map((s, i) => (
                      <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-5 py-4 font-medium text-gray-800">{s.offering.name}</td>
                        <td className="px-5 py-4 text-gray-500">{s.offering.sector}</td>
                        <td className="px-5 py-4 font-bold text-blue-600">{s.shares}</td>
                        <td className="px-5 py-4 font-medium">{s.totalAmount.toLocaleString()} FCFA</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            s.offering.riskLevel === 'Faible' ? 'bg-green-100 text-green-700' :
                            s.offering.riskLevel === 'Moyen' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>{s.offering.riskLevel}</span>
                        </td>
                        <td className="px-5 py-4 text-gray-400">
                          {new Date(s.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
