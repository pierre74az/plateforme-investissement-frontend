'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  Cpu,
  Sprout,
  Zap,
  Coins,
  HeartPulse,
  Info,
  ShieldCheck,
  AlertTriangle,
  Users,
  Briefcase,
  Layers,
  ArrowRight
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
  description: string
  riskLevel: string
  isOpen: boolean
  _count: { subs: number }
}

const riskColor: Record<string, string> = {
  Faible: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  Moyen: 'bg-amber-50 text-amber-800 border border-amber-200',
  Élevé: 'bg-rose-50 text-rose-800 border border-rose-200',
}

const sectorIcon: Record<string, any> = {
  Technologie: Cpu,
  Agriculture: Sprout,
  Énergie: Zap,
  Finance: Coins,
  Santé: HeartPulse,
}

export default function OfferingDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [offering, setOffering] = useState<Offering | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
    fetch(`${API}/offerings/${id}`)
      .then(r => r.json())
      .then(data => {
        setOffering(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!offering) {
    return (
      <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl shadow-sm max-w-lg mx-auto flex flex-col items-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-4 animate-bounce" />
        <h2 className="text-lg font-extrabold text-slate-800">Offre introuvable</h2>
        <p className="text-slate-400 text-xs mt-1.5 mb-6">Cette opportunité d&apos;investissement n&apos;existe pas ou a été retirée.</p>
        <Link href="/catalogue" className="bg-brand-700 hover:bg-brand-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition">
          Retour au catalogue
        </Link>
      </div>
    )
  }

  const pct = Math.round((offering.soldShares / offering.totalShares) * 100)
  const remaining = offering.totalShares - offering.soldShares
  const kycOk = user?.kycStatus === 'APPROVED'
  const IconComponent = sectorIcon[offering.sector] || Building2

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Back Link */}
      <Link
        href="/catalogue"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-700 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Retour au catalogue
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Details Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-brand-50 border border-brand-100 rounded-2xl flex items-center justify-center text-brand-700">
                  <IconComponent className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{offering.name}</h1>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">{offering.sector}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${riskColor[offering.riskLevel]}`}>
                  Risque {offering.riskLevel}
                </span>
                <span
                  className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                    offering.isOpen
                      ? 'bg-brand-50 text-brand-800 border border-brand-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {offering.isOpen ? 'Campagne Ouverte' : 'Campagne Fermée'}
                </span>
              </div>
            </div>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">{offering.description}</p>
          </div>

          {/* Collection progress */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-extrabold text-slate-800 text-sm tracking-wider uppercase mb-5">
              Progression du financement
            </h3>
            <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-700 to-brand-500 transition-all duration-500"
                style={{ width: `${Math.min(100, pct)}%` } as React.CSSProperties}
              />
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm mb-6">
              <span className="text-slate-400 font-semibold">{offering.soldShares.toLocaleString()} actions vendues</span>
              <span className="font-extrabold text-brand-700 text-base">{pct}%</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Actions totales</p>
                <p className="text-lg sm:text-xl font-extrabold text-slate-900">{offering.totalShares.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Disponibles</p>
                <p className="text-lg sm:text-xl font-extrabold text-brand-700">{remaining.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Souscripteurs</p>
                <p className="text-lg sm:text-xl font-extrabold text-blue-600">{offering._count?.subs || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Side Panel */}
        <div className="space-y-6">
          {/* Offer Details */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-extrabold text-slate-800 text-sm tracking-wider uppercase mb-5">
              Caractéristiques de l&apos;offre
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Prix par action', value: `${offering.pricePerShare.toLocaleString()} FCFA`, icon: Coins },
                { label: 'Investissement min.', value: `${offering.minInvest.toLocaleString()} FCFA`, icon: Briefcase },
                { label: 'Niveau de risque', value: offering.riskLevel, icon: ShieldCheck },
                { label: 'Secteur d\'activité', value: offering.sector, icon: Layers },
              ].map((item, idx) => {
                const ItemIcon = item.icon
                return (
                  <div key={idx} className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-0">
                    <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                      <ItemIcon className="w-4 h-4 text-slate-500" />
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-slate-800">{item.value}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Box */}
          <div className="bg-brand-50/70 border border-brand-100 rounded-3xl p-6 shadow-sm">
            <p className="text-sm font-bold text-brand-400 uppercase tracking-wider mb-1">
              Prix unitaire
            </p>
            <p className="text-2xl font-extrabold text-brand-900 tracking-tight mb-2">
              {offering.pricePerShare.toLocaleString()} FCFA
            </p>
            <p className="text-xs text-brand-700 font-medium mb-6">
              Souscription minimale requise : {offering.minInvest.toLocaleString()} FCFA
            </p>

            {!user ? (
              <Link
                href="/auth/login"
                className="w-full text-center bg-brand-700 hover:bg-brand-900 text-white py-3.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 shadow"
              >
                Se connecter pour investir
              </Link>
            ) : !kycOk ? (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex gap-2 text-xs text-amber-800">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-semibold">
                    Dossier KYC approuvé obligatoire pour acheter des actions.
                  </span>
                </div>
                <Link
                  href="/kyc"
                  className="w-full text-center bg-amber-650 hover:bg-amber-700 text-white py-3.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 shadow"
                >
                  Compléter mon KYC <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : !offering.isOpen ? (
              <button
                disabled
                className="w-full bg-slate-200 text-slate-400 border border-slate-300 py-3.5 rounded-xl text-sm font-bold cursor-not-allowed flex items-center justify-center gap-2"
              >
                Campagne Clôturée
              </button>
            ) : (
              <Link
                href={`/souscrire/${offering.id}`}
                className="w-full text-center bg-brand-700 hover:bg-brand-800 text-white py-3.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
              >
                Investir maintenant <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
