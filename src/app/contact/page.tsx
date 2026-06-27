'use client'
import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-[#F0FDF4] border-b border-[#BBF7D0] px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-[#DCFCE7] text-[#166534] text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-[#BBF7D0]">
            Contact
          </span>
          <h1 className="text-4xl font-semibold text-slate-900 mb-4">Contactez-nous</h1>
          <p className="text-slate-500">Une question ? Une suggestion ? Écrivez-nous.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Infos contact */}
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-900 mb-4">Informations</h2>
            {[
              { icon: '📍', label: 'Adresse', value: 'Ouagadougou, Burkina Faso' },
              { icon: '✉️', label: 'Email', value: 'contact@investbf.com' },
              { icon: '🕐', label: 'Disponibilité', value: 'Lun–Ven, 8h–17h (GMT)' },
            ].map(c => (
              <div key={c.label} className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl p-4">
                <span className="text-lg">{c.icon}</span>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-0.5">{c.label}</p>
                  <p className="text-sm text-slate-700">{c.value}</p>
                </div>
              </div>
            ))}

            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4 mt-6">
              <p className="text-xs font-medium text-[#166534] mb-1">Projet académique</p>
              <p className="text-xs text-[#15803D] leading-relaxed">
                InvestBF est un projet de fin d&apos;études. Les demandes sont traitées à titre démonstratif.
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="md:col-span-2">
            {sent ? (
              <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-10 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Message envoyé !</h3>
                <p className="text-slate-500 text-sm mb-6">Nous reviendrons vers vous dans les plus brefs délais.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                  className="text-[#15803D] text-sm font-medium hover:underline">
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
                <h2 className="font-semibold text-slate-900 mb-6">Envoyer un message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">Nom complet</label>
                      <input
                        id="name"
                        required
                        placeholder="Adama Ouédraogo"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="cemail" className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                      <input
                        id="cemail"
                        type="email"
                        required
                        placeholder="adama@example.com"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1.5">Sujet</label>
                    <input
                      id="subject"
                      required
                      placeholder="ex: Question sur le KYC"
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      placeholder="Décrivez votre question ou remarque..."
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#15803D] text-white py-3 rounded-xl font-semibold hover:bg-[#166534] transition-all active:scale-[.97]">
                    Envoyer le message →
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-8 py-8 bg-slate-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-sm text-slate-400">
          <span>© 2026 InvestBF — Tous droits réservés</span>
          <div className="flex gap-6">
            <a href="/about" className="hover:text-slate-600 transition">À propos</a>
            <a href="/faq" className="hover:text-slate-600 transition">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
