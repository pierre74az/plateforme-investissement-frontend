'use client'
import { useState } from 'react'

const faqs = [
  {
    q: "Comment fonctionne InvestBF ?",
    a: "InvestBF vous permet d'acheter des actions d'entreprises burkinabè. Vous créez un compte, validez votre identité (KYC), choisissez une offre dans le catalogue et payez via Stripe. Votre souscription est enregistrée instantanément."
  },
  {
    q: "Quel est le montant minimum pour investir ?",
    a: "Le montant minimum dépend de chaque offre, mais la plupart sont accessibles à partir de 10 000 FCFA. Chaque offre affiche clairement le prix par action et le montant minimum d'investissement."
  },
  {
    q: "Qu'est-ce que le KYC ?",
    a: "Le KYC (Know Your Customer) est une vérification d'identité obligatoire. Vous devez fournir une pièce d'identité et un justificatif de domicile. Une fois validé par notre équipe, vous pouvez souscrire à n'importe quelle offre."
  },
  {
    q: "Comment se déroule le paiement ?",
    a: "Le paiement est sécurisé par Stripe, leader mondial du paiement en ligne. En mode démonstration, utilisez la carte test 4242 4242 4242 4242 avec n'importe quelle date d'expiration future."
  },
  {
    q: "Comment suivre mes investissements ?",
    a: "Votre tableau de bord affiche en temps réel votre solde, vos souscriptions actives, le nombre d'actions détenues et l'historique de vos transactions. Vous pouvez aussi consulter votre portefeuille détaillé."
  },
  {
    q: "Puis-je vendre mes actions ?",
    a: "Dans la version actuelle (MVP), la revente d'actions n'est pas encore disponible. Cette fonctionnalité est prévue dans la Phase 2 de développement de la plateforme."
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Oui. Les mots de passe sont hashés avec bcrypt, les communications sont chiffrées (HTTPS), et les documents KYC sont stockés de façon sécurisée avec accès authentifié uniquement. Les paiements sont gérés directement par Stripe sans transit sur nos serveurs."
  },
]

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-[#F0FDF4] border-b border-[#BBF7D0] px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-[#DCFCE7] text-[#166534] text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-[#BBF7D0]">
            FAQ
          </span>
          <h1 className="text-4xl font-semibold text-slate-900 mb-4">Questions fréquentes</h1>
          <p className="text-slate-500">Tout ce que vous devez savoir sur InvestBF</p>
        </div>
      </section>

      {/* Questions */}
      <section className="max-w-3xl mx-auto px-8 py-16">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i}
              className={`border rounded-2xl overflow-hidden transition-all ${
                open === i ? 'border-[#BBF7D0]' : 'border-slate-100'
              }`}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center px-6 py-4 text-left bg-white hover:bg-slate-50 transition-colors">
                <span className="font-medium text-slate-800 text-sm pr-4">{faq.q}</span>
                <span className={`text-[#15803D] text-lg flex-shrink-0 transition-transform ${open === i ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 bg-[#F0FDF4] border-t border-[#BBF7D0]">
                  <p className="text-slate-600 text-sm leading-relaxed pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-slate-50 border border-slate-100 rounded-2xl p-8">
          <p className="text-slate-600 font-medium mb-2">Vous avez une autre question ?</p>
          <p className="text-slate-500 text-sm mb-4">Notre équipe est disponible pour vous aider</p>
          <a href="/contact"
            className="inline-block bg-[#15803D] text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-[#166534] transition-all active:scale-[.97]">
            Nous contacter →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-8 py-8 bg-slate-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-sm text-slate-400">
          <span>© 2026 InvestBF — Tous droits réservés</span>
          <div className="flex gap-6">
            <a href="/about" className="hover:text-slate-600 transition">À propos</a>
            <a href="/contact" className="hover:text-slate-600 transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
