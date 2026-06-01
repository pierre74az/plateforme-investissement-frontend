'use client'
import { useState } from 'react'
import Link from 'next/link'

const faqs = [
  {
    q: "Qu'est-ce qu'InvestBF ?",
    a: "InvestBF est une plateforme d'investissement en ligne qui permet aux citoyens burkinabè de souscrire à des actions d'entreprises locales. Vous investissez un montant et devenez actionnaire de l'entreprise choisie."
  },
  {
    q: "Quel est le montant minimum pour investir ?",
    a: "Le montant minimum dépend de chaque offre, mais il commence généralement à partir de 10 000 FCFA. Chaque fiche d'entreprise indique clairement l'investissement minimum requis."
  },
  {
    q: "Comment fonctionne la vérification KYC ?",
    a: "Le KYC (Know Your Customer) est une procédure obligatoire pour vérifier votre identité. Vous devez fournir une pièce d'identité valide (CNI ou passeport) et un justificatif de domicile. La vérification est effectuée par notre équipe sous 24 à 48 heures."
  },
  {
    q: "Mes investissements sont-ils sécurisés ?",
    a: "Oui. Toutes les transactions sont sécurisées par chiffrement SSL. Les fonds sont gérés selon les réglementations financières en vigueur. Cependant, comme tout investissement, il existe un risque de perte en capital selon le niveau de risque de l'offre choisie."
  },
  {
    q: "Comment suivre mes investissements ?",
    a: "Depuis votre tableau de bord, vous pouvez voir en temps réel l'évolution de votre portefeuille, le nombre d'actions que vous détenez, le montant total investi et l'historique de vos transactions."
  },
  {
    q: "Puis-je revendre mes actions ?",
    a: "Dans la version actuelle de la plateforme, les actions sont conservées jusqu'à la fin de la période d'investissement prévue. Un marché secondaire permettant la revente d'actions est prévu dans une prochaine version."
  },
  {
    q: "Comment contacter le support ?",
    a: "Vous pouvez nous contacter via le formulaire de la page Contact, par email à support@investbf.com ou par téléphone au +226 XX XX XX XX du lundi au vendredi de 8h à 17h."
  },
  {
    q: "La plateforme est-elle disponible sur mobile ?",
    a: "La plateforme est entièrement responsive et fonctionne sur tous les appareils (smartphone, tablette, ordinateur). Une application mobile dédiée est en cours de développement."
  },
]

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white">

      <div className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Questions fréquentes</h1>
        <p className="text-gray-500 text-lg mb-12">Tout ce que vous devez savoir sur InvestBF</p>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center px-6 py-5 text-left hover:bg-gray-50 transition">
                <span className="font-medium text-gray-800">{faq.q}</span>
                <span className={`text-gray-400 text-xl transition-transform ${open === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t bg-gray-50">
                  <p className="pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-2xl p-8 text-center">
          <p className="font-bold text-gray-800 mb-2">Vous n'avez pas trouvé votre réponse ?</p>
          <p className="text-gray-500 text-sm mb-4">Notre équipe est disponible pour vous aider</p>
          <Link href="/contact"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition inline-block">
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  )
}
