'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

type Offering = {
  id: string
  name: string
  sector: string
  pricePerShare: number
  totalShares: number
  soldShares: number
  minInvest: number
  riskLevel: string
  isOpen: boolean
  createdAt: string
  _count: { subs: number }
}

const riskColor: Record<string, string> = {
  Faible: 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]',
  Moyen: 'bg-amber-50 text-amber-800 border border-amber-200',
  Élevé: 'bg-red-50 text-red-800 border border-red-200',
}

const sectorIcon: Record<string, string> = {
  Technologie: '💻', Agriculture: '🌾', Énergie: '⚡', Finance: '🏦', Santé: '🏥',
}

export default function AdminOffresPage() {
  const router = useRouter()
  const [offerings, setOfferings] = useState<Offering[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)
  const [token, setToken] = useState('')

  useEffect(() => {
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (!t || !u) { router.push('/auth/login'); return }
    if (JSON.parse(u).role !== 'ADMIN') { router.push('/dashboard'); return }
    setToken(t)
    fetch(`${API}/offerings?includeClosed=true`)
      .then(r => r.json())
      .then(data => { setOfferings(Array.isArray(data) ? data : []); setLoading(false) })
  }, [router])

  const toggleOffering = async (id: string, isOpen: boolean) => {
    setToggling(id)
    const res = await fetch(`${API}/offerings/${id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ isOpen: !isOpen }),
    })
    const updated = await res.json()
    setOfferings(prev => prev.map(o => o.id === id ? { ...o, isOpen: updated.isOpen } : o))
    setToggling(null)
  }

  const deleteOffering = async (id: string, name: string) => {
    if (!confirm(`Supprimer l'offre "${name}" ? Cette action est irréversible.`)) return
    setDeleting(id)
    await fetch(`${API}/offerings/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
    setOfferings(prev => prev.filter(o => o.id !== id))
    setDeleting(null)
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#BBF7D0] border-t-[#15803D] rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-1">Gestion des offres</h1>
            <p className="text-slate-500 text-sm">{offerings.length} offre(s) au total</p>
          </div>
          <Link href="/admin/offres/nouveau"
            className="bg-[#15803D] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#166534] transition-all active:scale-[.97]">
            + Nouvelle offre
          </Link>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 text-center">
            <p className="text-2xl font-semibold text-[#15803D]">{offerings.filter(o => o.isOpen).length}</p>
            <p className="text-xs text-slate-500 mt-1">Offres ouvertes</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-5 text-center">
            <p className="text-2xl font-semibold text-slate-400">{offerings.filter(o => !o.isOpen).length}</p>
            <p className="text-xs text-slate-500 mt-1">Offres fermées</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-5 text-center">
            <p className="text-2xl font-semibold text-blue-600">
              {offerings.reduce((a, o) => a + (o._count?.subs || 0), 0)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Souscriptions totales</p>
          </div>
        </div>

        {/* Liste des offres */}
        {offerings.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center">
            <p className="text-3xl mb-3">📭</p>
            <p className="text-slate-600 font-medium mb-1">Aucune offre créée</p>
            <p className="text-slate-400 text-sm mb-5">Créez votre première offre d&apos;actions</p>
            <Link href="/admin/offres/nouveau"
              className="inline-block bg-[#15803D] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#166534] transition-all">
              + Créer une offre
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {offerings.map(o => {
              const pct = Math.round((o.soldShares / o.totalShares) * 100)
              return (
                <div key={o.id}
                  className={`bg-white border rounded-2xl p-6 transition-all hover:shadow-sm ${
                    o.isOpen ? 'border-slate-100' : 'border-slate-100 opacity-70'
                  }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-xl">
                        {sectorIcon[o.sector] || '🏢'}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{o.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{o.sector}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${riskColor[o.riskLevel]}`}>
                        {o.riskLevel}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        o.isOpen
                          ? 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {o.isOpen ? 'Ouverte' : 'Fermée'}
                      </span>
                    </div>
                  </div>

                  {/* Progression */}
                  <div className="mb-4">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#16A34A] transition-all"
                        style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                      <span>{o.soldShares.toLocaleString()} / {o.totalShares.toLocaleString()} actions vendues</span>
                      <span className="font-medium text-[#15803D]">{pct}%</span>
                    </div>
                  </div>

                  {/* Infos */}
                  <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-slate-100">
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Prix / action</p>
                      <p className="text-sm font-semibold text-slate-800">{o.pricePerShare.toLocaleString()} FCFA</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Minimum</p>
                      <p className="text-sm font-semibold text-slate-800">{o.minInvest.toLocaleString()} FCFA</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Souscriptions</p>
                      <p className="text-sm font-semibold text-blue-600">{o._count?.subs || 0}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link href={`/admin/offres/${o.id}`}
                      className="flex-1 text-center border border-slate-200 text-slate-600 py-2 rounded-xl text-xs font-medium hover:bg-slate-50 hover:border-slate-300 transition-all">
                      ✏️ Modifier
                    </Link>
                    <button
                      onClick={() => toggleOffering(o.id, o.isOpen)}
                      disabled={toggling === o.id}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all disabled:opacity-50 ${
                        o.isOpen
                          ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                          : 'border-[#BBF7D0] text-[#15803D] hover:bg-[#F0FDF4]'
                      }`}>
                      {toggling === o.id ? '...' : o.isOpen ? '🔒 Fermer' : '🔓 Ouvrir'}
                    </button>
                    <button
                      onClick={() => deleteOffering(o.id, o.name)}
                      disabled={deleting === o.id}
                      className="flex-1 border border-red-200 text-red-600 py-2 rounded-xl text-xs font-medium hover:bg-red-50 transition-all disabled:opacity-50">
                      {deleting === o.id ? '...' : '🗑️ Supprimer'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
