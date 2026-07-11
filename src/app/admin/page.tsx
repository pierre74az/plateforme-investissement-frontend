'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Users,
  FileCheck2,
  Coins,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  PlusCircle,
  Activity,
  Award
} from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

type Stats = {
  totalInvestors: number
  kycPending: number
  kycApproved: number
  kycRejected: number
  totalSubscriptions: number
  totalVolume: number
  activeOfferings: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (!token || !u) {
      router.push('/auth/login')
      return
    }
    if (JSON.parse(u).role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    fetch(`${API}/users/stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => {
        if (!r.ok) throw new Error('Stats failed')
        return r.json()
      })
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => {
        setStats(null)
        setLoading(false)
      })
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl shadow-sm max-w-lg mx-auto flex flex-col items-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-4 animate-bounce" />
        <h2 className="text-lg font-extrabold text-slate-800">Erreur de chargement</h2>
        <p className="text-slate-400 text-xs mt-1.5 mb-6">Impossible de récupérer les statistiques de la plateforme.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Espace Administration</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Supervision de l&apos;activité globale et gestion de la conformité</p>
      </div>

      {/* KYC Alert Banner */}
      {(stats.kycPending ?? 0) > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <p className="font-extrabold text-amber-900 text-sm sm:text-base">{stats.kycPending} dossier(s) KYC en attente</p>
              <p className="text-amber-800 text-xs sm:text-sm mt-0.5 max-w-xl leading-relaxed">
                Des investisseurs inscrits sont en attente de la validation réglementaire de leur identité pour pouvoir démarrer.
              </p>
            </div>
          </div>
          <Link
            href="/admin/kyc"
            className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all hover:scale-[1.01] active:scale-[0.98] text-center shadow-sm"
          >
            Traiter les dossiers →
          </Link>
        </div>
      )}

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            label: 'Investisseurs inscrits',
            value: stats.totalInvestors ?? 0,
            icon: Users,
            iconColor: 'text-brand-700 bg-brand-50 border border-brand-100',
            badge: 'Inscriptions'
          },
          {
            label: 'Souscriptions faites',
            value: stats.totalSubscriptions ?? 0,
            icon: FileCheck2,
            iconColor: 'text-blue-700 bg-blue-50 border border-blue-100',
            badge: 'Titres émis'
          },
          {
            label: 'Volume total levé',
            value: `${(stats.totalVolume ?? 0).toLocaleString()} FCFA`,
            icon: Coins,
            iconColor: 'text-amber-700 bg-amber-50 border border-amber-100',
            badge: 'Fonds collectés'
          },
          {
            label: 'Offres actives',
            value: stats.activeOfferings ?? 0,
            icon: TrendingUp,
            iconColor: 'text-purple-700 bg-purple-50 border border-purple-100',
            badge: 'Campagnes actives'
          },
        ].map((k, i) => {
          const Icon = k.icon
          return (
            <div
              key={i}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow transition duration-300 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{k.label}</span>
                <div className={`p-2.5 rounded-xl ${k.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-none mb-2">{k.value}</p>
                <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  {k.badge}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Double Column details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        {/* KYC breakdown */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm tracking-wider uppercase mb-6">Dossiers Réglementaires</h3>
            <div className="space-y-5">
              {[
                { label: 'Validés', value: stats.kycApproved ?? 0, color: '#16A34A', bg: 'bg-brand-50 border border-brand-100 text-brand-800' },
                { label: 'En attente', value: stats.kycPending ?? 0, color: '#F59E0B', bg: 'bg-amber-50 border border-amber-100 text-amber-800' },
                { label: 'Rejetés', value: stats.kycRejected ?? 0, color: '#EF4444', bg: 'bg-rose-50 border border-rose-100 text-rose-800' },
              ].map((k, idx) => {
                const total = (stats.kycApproved ?? 0) + (stats.kycPending ?? 0) + (stats.kycRejected ?? 0)
                const pct = total > 0 ? Math.round((k.value / total) * 100) : 0
                return (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{k.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${k.bg}`}>
                          {k.value} dossier(s)
                        </span>
                        <span className="text-xs font-extrabold text-slate-800">{pct}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%`, backgroundColor: k.color } as React.CSSProperties}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="pt-6 mt-6 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Suivi de la conformité</span>
            <Link
              href="/admin/kyc"
              className="text-xs text-brand-700 hover:text-brand-900 font-bold flex items-center gap-0.5"
            >
              Gérer les dossiers KYC <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick actions panel */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="font-extrabold text-slate-800 text-sm tracking-wider uppercase mb-6">Accès rapides</h3>
          <div className="space-y-4">
            {[
              {
                href: '/admin/kyc',
                icon: ShieldCheck,
                label: 'Valider les dossiers KYC',
                desc: `${stats.kycPending ?? 0} dossier(s) en attente de vérification`,
                color: 'hover:border-amber-300 hover:bg-amber-50/20'
              },
              {
                href: '/admin/utilisateurs',
                icon: Users,
                label: 'Gérer les investisseurs',
                desc: `${stats.totalInvestors ?? 0} utilisateurs enregistrés`,
                color: 'hover:border-brand-300 hover:bg-brand-50/20'
              },
              {
                href: '/admin/offres/nouveau',
                icon: PlusCircle,
                label: 'Créer une offre',
                desc: 'Lancer une nouvelle levée de fonds en actions',
                color: 'hover:border-blue-250 hover:bg-blue-50/20'
              },
            ].map((a, idx) => {
              const ActionIcon = a.icon
              return (
                <Link
                  key={idx}
                  href={a.href}
                  className={`flex items-center gap-4 p-4 border border-slate-100 rounded-2xl transition-all group ${a.color}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:scale-105 transition">
                    <ActionIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800">{a.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{a.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition" />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
