'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [recentSubs, setRecentSubs] = useState<any[]>([])
  const [offerings, setOfferings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (!token || !u) { router.push('/auth/login'); return }
    const user = JSON.parse(u)
    if (user.role !== 'ADMIN') { router.push('/dashboard'); return }

    Promise.all([
      fetch('http://localhost:3001/api/kyc/all', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
      fetch('http://localhost:3001/api/subscriptions/all', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
      fetch('http://localhost:3001/api/offerings').then(r => r.json()),
    ]).then(([kycs, subs, offs]) => {
      setStats({
        totalKyc: kycs.length,
        pendingKyc: kycs.filter((k: any) => k.status === 'PENDING').length,
        approvedKyc: kycs.filter((k: any) => k.status === 'APPROVED').length,
        totalSubs: subs.length,
        totalVolume: subs.reduce((a: number, s: any) => a + s.totalAmount, 0),
        totalOfferings: offs.length,
      })
      setRecentSubs(subs.slice(0, 5))
      setOfferings(offs)
      setLoading(false)
    })
  }, [])

  const deleteOffering = async (id: string) => {
    if (!confirm('Supprimer cette offre ?')) return
    const token = localStorage.getItem('token')
    await fetch(`http://localhost:3001/api/offerings/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    setOfferings(prev => prev.filter(o => o.id !== id))
  }

  const toggleOffering = async (id: string, isOpen: boolean) => {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:3001/api/offerings/${id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ isOpen: !isOpen })
    })
    const updated = await res.json()
    setOfferings(prev => prev.map(o => o.id === id ? { ...o, isOpen: updated.isOpen } : o))
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Tableau de bord administrateur</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'KYC en attente', value: stats?.pendingKyc, sub: `${stats?.approvedKyc} validés`, bg: 'bg-yellow-50', color: 'text-yellow-800', link: '/admin/kyc' },
            { label: 'Souscriptions totales', value: stats?.totalSubs, sub: 'tous investisseurs', bg: 'bg-blue-50', color: 'text-blue-800', link: null },
            { label: 'Volume levé', value: `${stats?.totalVolume?.toLocaleString()} FCFA`, sub: 'cumulé', bg: 'bg-green-50', color: 'text-green-800', link: null },
            { label: 'Offres actives', value: stats?.totalOfferings, sub: 'sur la plateforme', bg: 'bg-purple-50', color: 'text-purple-800', link: null },
          ].map(k => (
            <div key={k.label}
              className={`${k.bg} rounded-2xl p-5 ${k.link ? 'cursor-pointer hover:opacity-80 transition' : ''}`}
              onClick={() => k.link && router.push(k.link)}>
              <p className="text-xs font-medium text-gray-500 mb-1">{k.label}</p>
              <p className={`text-xl font-bold ${k.color}`}>{k.value}</p>
              <p className="text-xs text-gray-400 mt-1">{k.sub}</p>
            </div>
          ))}
        </div>

        {stats?.pendingKyc > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex justify-between items-center mb-8">
            <div>
              <p className="font-medium text-red-800">{stats.pendingKyc} dossier(s) KYC en attente</p>
              <p className="text-sm text-red-600">Des investisseurs attendent la validation de leur identité</p>
            </div>
            <Link href="/admin/kyc"
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition">
              Traiter maintenant →
            </Link>
          </div>
        )}

        <div className="bg-white rounded-2xl border overflow-hidden mb-8">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Gestion des offres d'actions</h3>
            <Link href="/admin/offres/nouveau"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
              + Ajouter une offre
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Entreprise', 'Secteur', 'Prix/action', 'Progression', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {offerings.map((o, i) => (
                  <tr key={o.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-5 py-4 font-medium text-gray-800">{o.name}</td>
                    <td className="px-5 py-4 text-gray-500">{o.sector}</td>
                    <td className="px-5 py-4 font-bold text-blue-600">{o.pricePerShare.toLocaleString()} FCFA</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full"
                            style={{ width: `${Math.round((o.soldShares / o.totalShares) * 100)}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">
                          {Math.round((o.soldShares / o.totalShares) * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${o.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {o.isOpen ? 'Ouvert' : 'Fermé'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Link href={`/admin/offres/${o.id}`} className="text-xs text-blue-600 hover:underline">Modifier</Link>
                        <button onClick={() => toggleOffering(o.id, o.isOpen)}
                          className="text-xs text-yellow-600 hover:underline">
                          {o.isOpen ? 'Fermer' : 'Ouvrir'}
                        </button>
                        <button onClick={() => deleteOffering(o.id)}
                          className="text-xs text-red-500 hover:underline">Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="font-bold text-gray-800">Dernières souscriptions</h3>
          </div>
          {recentSubs.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Aucune souscription</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Investisseur', 'Offre', 'Actions', 'Montant', 'Date'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentSubs.map((s, i) => (
                  <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">{s.user.firstName} {s.user.lastName}</p>
                      <p className="text-xs text-gray-400">{s.user.email}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{s.offering.name}</td>
                    <td className="px-5 py-4 font-bold text-blue-600">{s.shares}</td>
                    <td className="px-5 py-4 font-medium">{s.totalAmount.toLocaleString()} FCFA</td>
                    <td className="px-5 py-4 text-gray-400">{new Date(s.createdAt).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
