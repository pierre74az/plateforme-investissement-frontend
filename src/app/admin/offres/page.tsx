'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  PlusCircle,
  Building2,
  Cpu, Sprout, Zap, Coins, HeartPulse,
  Lock, Unlock, Trash2, Pencil,
  TrendingUp, Users, FileText
} from 'lucide-react'

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
  Faible: 'bg-emerald-50 text-emerald-800 border border-emerald-100',
  Moyen:  'bg-amber-50 text-amber-800 border border-amber-100',
  Élevé:  'bg-rose-50 text-rose-800 border border-rose-100',
}

const sectorIcon: Record<string, any> = {
  Technologie: Cpu, Agriculture: Sprout, Énergie: Zap, Finance: Coins, Santé: HeartPulse,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  const openCount = offerings.filter(o => o.isOpen).length
  const closedCount = offerings.filter(o => !o.isOpen).length
  const totalSubs = offerings.reduce((a, o) => a + (o._count?.subs || 0), 0)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Gestion des offres</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">{offerings.length} offre(s) au total sur la plateforme</p>
        </div>
        <Link
          href="/admin/offres/nouveau"
          className="bg-brand-700 hover:bg-brand-800 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center gap-2 shadow flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Nouvelle offre
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Offres actives', value: openCount, icon: TrendingUp, color: 'text-brand-700 bg-brand-50 border border-brand-100' },
          { label: 'Offres fermées', value: closedCount, icon: Lock, color: 'text-slate-500 bg-slate-50 border border-slate-100' },
          { label: 'Souscriptions', value: totalSubs, icon: FileText, color: 'text-blue-700 bg-blue-50 border border-blue-100' },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-3 sm:gap-4">
              <div className={`p-2.5 rounded-xl ${s.color} flex-shrink-0`}>
                <Icon className="w-5 h-5 sm:w-5 sm:h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-none">{s.value}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Offerings list */}
      {offerings.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm flex flex-col items-center">
          <Building2 className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-700 font-extrabold text-sm mb-1">Aucune offre créée</p>
          <p className="text-slate-400 text-xs mb-6">Créez votre première campagne de financement participatif.</p>
          <Link
            href="/admin/offres/nouveau"
            className="bg-brand-700 hover:bg-brand-800 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Créer une offre
          </Link>
        </div>
      ) : (
        <div className="space-y-4 pb-6">
          {offerings.map(o => {
            const pct = Math.round((o.soldShares / o.totalShares) * 100)
            const IconComponent = sectorIcon[o.sector] || Building2
            const isToggling = toggling === o.id
            const isDeleting = deleting === o.id

            return (
              <div
                key={o.id}
                className={`bg-white border rounded-3xl p-6 transition-all hover:shadow ${
                  o.isOpen ? 'border-slate-100' : 'border-slate-100 opacity-75'
                }`}
              >
                {/* Top row */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 bg-brand-50 border border-brand-100 rounded-2xl flex items-center justify-center text-brand-700 flex-shrink-0">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900 text-base">{o.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{o.sector}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${riskColor[o.riskLevel]}`}>
                      Risque {o.riskLevel}
                    </span>
                    <span className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                      o.isOpen
                        ? 'bg-brand-50 text-brand-800 border border-brand-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {o.isOpen ? 'Ouverte' : 'Fermée'}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-5">
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-700 to-brand-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, pct)}%` } as React.CSSProperties}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>{o.soldShares.toLocaleString()} / {o.totalShares.toLocaleString()} actions vendues</span>
                    <span className="text-brand-700">{pct}%</span>
                  </div>
                </div>

                {/* Offer metrics */}
                <div className="grid grid-cols-3 gap-4 mb-5 pb-5 border-b border-slate-50">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Prix / action</p>
                    <p className="text-sm font-extrabold text-slate-800">{o.pricePerShare.toLocaleString()} FCFA</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Invest. min.</p>
                    <p className="text-sm font-extrabold text-slate-800">{o.minInvest.toLocaleString()} FCFA</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Souscripteurs</p>
                    <p className="text-sm font-extrabold text-blue-600">{o._count?.subs || 0}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Link
                    href={`/admin/offres/${o.id}`}
                    className="flex-1 text-center border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Modifier
                  </Link>
                  <button
                    onClick={() => toggleOffering(o.id, o.isOpen)}
                    disabled={isToggling}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 ${
                      o.isOpen
                        ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                        : 'border-brand-200 text-brand-700 hover:bg-brand-50'
                    }`}
                  >
                    {isToggling ? (
                      <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin"></div>
                    ) : o.isOpen ? (
                      <><Lock className="w-3.5 h-3.5" /> Fermer</>
                    ) : (
                      <><Unlock className="w-3.5 h-3.5" /> Ouvrir</>
                    )}
                  </button>
                  <button
                    onClick={() => deleteOffering(o.id, o.name)}
                    disabled={isDeleting}
                    className="flex-1 border border-rose-200 text-rose-600 hover:bg-rose-50 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {isDeleting ? (
                      <div className="w-4 h-4 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
                    ) : (
                      <><Trash2 className="w-3.5 h-3.5" /> Supprimer</>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
