'use client'
import { useState } from 'react'
import { MapPin, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-50 via-emerald-50/20 to-white border-b border-brand-100/60 py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 bg-brand-100 text-brand-900 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-brand-200 shadow-sm">
            Contact
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Contactez-nous</h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
            Vous avez des questions sur l&apos;investissement ou souhaitez référencer votre entreprise ? Écrivez-nous.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-4">Nos coordonnées</h2>
            {[
              { icon: MapPin, label: 'Adresse physique', value: 'Zone du Bois, Ouagadougou, Burkina Faso', color: 'text-brand-700 bg-brand-50' },
              { icon: Mail, label: 'Email support & commercial', value: 'contact@investbf.com', color: 'text-blue-700 bg-blue-50' },
              { icon: Clock, label: 'Disponibilité', value: 'Lundi au Vendredi, 8h – 17h (GMT)', color: 'text-gold-700 bg-gold-50' },
            ].map((c, idx) => {
              const Icon = c.icon
              return (
                <div key={idx} className="flex items-start gap-4 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <div className={`p-3 rounded-xl ${c.color} flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{c.label}</p>
                    <p className="text-sm font-semibold text-slate-700 leading-relaxed">{c.value}</p>
                  </div>
                </div>
              )
            })}

            {/* Academic Notice */}
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 shadow-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-brand-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-brand-900 mb-1">Projet de démonstration</p>
                <p className="text-xs text-brand-700 leading-relaxed">
                  InvestBF est une plateforme académique. Les requêtes de contact et de support envoyées via ce formulaire sont simulées à des fins de démonstration.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="bg-white border border-brand-200 rounded-3xl p-10 sm:p-14 text-center shadow flex flex-col items-center animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-brand-50 border border-brand-100 rounded-full flex items-center justify-center text-brand-600 mb-6 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3">Message envoyé avec succès !</h3>
                <p className="text-slate-500 text-sm sm:text-base mb-8 max-w-md leading-relaxed">
                  Merci de nous avoir contactés. Notre équipe académique ou support simulé prendra connaissance de votre message rapidement.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                  className="bg-brand-700 hover:bg-brand-900 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.01] active:scale-[0.98]"
                >
                  Envoyer un nouveau message
                </button>
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-6">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nom complet</label>
                      <input
                        id="name"
                        required
                        placeholder="Adama Ouédraogo"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition bg-slate-50/30"
                      />
                    </div>
                    <div>
                      <label htmlFor="cemail" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                      <input
                        id="cemail"
                        type="email"
                        required
                        placeholder="adama@example.com"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition bg-slate-50/30"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sujet</label>
                    <input
                      id="subject"
                      required
                      placeholder="ex: Renseignement sur les critères d'éligibilité"
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition bg-slate-50/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Votre message</label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      placeholder="Saisissez votre question ou remarque ici..."
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition resize-none bg-slate-50/30"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-brand-700 hover:bg-brand-800 text-white py-3.5 rounded-xl font-bold text-base transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 shadow"
                  >
                    <Send className="w-5 h-5" /> Envoyer le message
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  )
}
