'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, HelpCircle, ArrowRight, MessageCircle } from 'lucide-react'

const faqs = [
  {
    q: "Comment fonctionne InvestBF ?",
    a: "InvestBF vous permet d'acheter des actions d'entreprises burkinabè en toute simplicité. Vous créez votre compte, soumettez vos pièces justificatives (KYC), puis choisissez une opportunité de financement dans notre catalogue. Les paiements s'effectuent de manière sécurisée par carte via l'intégration de Stripe."
  },
  {
    q: "Quel est le montant minimum pour investir ?",
    a: "Le ticket d'entrée minimum dépend des besoins de collecte de chaque entreprise, mais la plupart de nos offres partenaires débutent dès 10 000 FCFA. Chaque projet indique clairement le prix unitaire de la part ainsi que le seuil de souscription minimum requis."
  },
  {
    q: "Qu'est-ce que la validation KYC ?",
    a: "Le KYC (Know Your Customer) désigne une vérification d'identité rendue obligatoire par la réglementation financière. Pour valider votre espace investisseur, vous devez fournir une pièce d'identité en cours de validité ainsi qu'un justificatif de domicile récent. Notre équipe analyse et valide vos documents sous 24h."
  },
  {
    q: "Le paiement est-il sécurisé ?",
    a: "Absolument. Nous confions le traitement des transactions à Stripe, leader mondial du paiement en ligne certifié PCI-DSS. Vos données bancaires ne transitent jamais par nos serveurs. Pour les tests de la plateforme, vous pouvez utiliser les numéros de cartes fictives de Stripe."
  },
  {
    q: "Comment puis-je suivre mes investissements ?",
    a: "Dès que votre paiement Stripe est complété, vos actions sont créditées. Depuis votre espace 'Dashboard' ou 'Portefeuille', vous pouvez analyser en direct la répartition sectorielle de vos actifs, le nombre exact de parts détenues, et exporter l'historique complet de vos ordres."
  },
  {
    q: "Puis-je revendre mes actions sur la plateforme ?",
    a: "Pour cette version initiale (MVP), la revente ou le marché secondaire d'actions n'est pas encore disponible. Il s'agit d'une fonctionnalité complexe prévue dans notre feuille de route de développement à moyen terme."
  },
  {
    q: "Quelles sont les mesures de protection des données ?",
    a: "La sécurité de vos données est notre priorité absolue. Les mots de passe sont hachés via l'algorithme robuste bcrypt, toutes les requêtes sont chiffrées en HTTPS avec TLS 1.3, et les fichiers KYC téléversés sont stockés dans un répertoire sécurisé accessible uniquement par les administrateurs habilités."
  },
]

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-50 via-emerald-50/20 to-white border-b border-brand-100/60 py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 bg-brand-100 text-brand-900 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-brand-200 shadow-sm">
            FAQ
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Questions fréquentes</h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
            Trouvez rapidement des réponses claires à toutes vos questions concernant le fonctionnement de la plateforme InvestBF.
          </p>
        </div>
      </section>

      {/* Questions */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen ? 'border-brand-300 shadow-sm' : 'border-slate-100 shadow-sm hover:border-slate-200'
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left transition-colors duration-200"
                >
                  <span className="font-bold text-slate-800 text-sm sm:text-base pr-4 flex items-center gap-2.5">
                    <HelpCircle className={`w-5 h-5 flex-shrink-0 ${isOpen ? 'text-brand-600' : 'text-slate-400'}`} />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brand-600' : ''
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-72 opacity-100 border-t border-brand-50 bg-brand-50/10' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <p className="px-6 py-5 text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-100/30 rounded-full filter blur-xl"></div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 text-brand-700 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <MessageCircle className="w-6 h-6" />
          </div>
          <p className="text-slate-800 font-extrabold text-base sm:text-lg mb-2">Vous ne trouvez pas votre réponse ?</p>
          <p className="text-slate-500 text-xs sm:text-sm mb-6 max-w-md mx-auto">Notre support technique et commercial est disponible pour vous accompagner pas à pas.</p>
          <Link
            href="/contact"
            className="bg-brand-700 hover:bg-brand-800 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.98] inline-flex items-center gap-2 shadow"
          >
            Nous contacter <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  )
}
