'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-white">

      <div className="max-w-5xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Contactez-nous</h1>
        <p className="text-gray-500 text-lg mb-12">Notre équipe vous répond sous 24 heures</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Formulaire */}
          <div>
            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-xl font-bold text-green-800 mb-2">Message envoyé !</h2>
                <p className="text-green-600 text-sm">Notre équipe vous répondra dans les 24 heures.</p>
                <button onClick={() => { setForm({ name:'',email:'',subject:'',message:'' }); setSent(false) }}
                  className="mt-4 text-sm text-green-600 hover:underline">
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nom complet</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Adama Ouedraogo" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="adama@example.com" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Sujet</label>
                  <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Choisir un sujet</option>
                    <option>Question sur un investissement</option>
                    <option>Problème avec mon compte</option>
                    <option>Vérification KYC</option>
                    <option>Question technique</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                    rows={5} placeholder="Décrivez votre demande..."
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button onClick={handleSubmit}
                  disabled={!form.name || !form.email || !form.message}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition">
                  Envoyer le message
                </button>
              </div>
            )}
          </div>

          {/* Infos de contact */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Nos coordonnées</h2>
            {[
              { icon: '📧', label: 'Email', value: 'support@investbf.com' },
              { icon: '📞', label: 'Téléphone', value: '+226 XX XX XX XX' },
              { icon: '📍', label: 'Adresse', value: 'Ouagadougou, Burkina Faso' },
              { icon: '🕐', label: 'Horaires', value: 'Lun–Ven, 8h–17h (GMT+0)' },
            ].map(c => (
              <div key={c.label} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {c.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{c.label}</p>
                  <p className="text-gray-800 font-medium">{c.value}</p>
                </div>
              </div>
            ))}

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mt-6">
              <p className="font-medium text-yellow-800 mb-1">⚡ Réponse rapide</p>
              <p className="text-sm text-yellow-600">Pour les questions urgentes sur votre KYC ou une transaction, précisez-le dans le sujet de votre message.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
