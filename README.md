# 📱 InvestBF — Plateforme d'Investissement (Frontend)

InvestBF est le frontend moderne et responsive d'une plateforme de financement participatif et d'investissement dans les PME et startups burkinabè. 

Cette interface intuitive et dynamique permet aux investisseurs de découvrir des entreprises à fort potentiel au Burkina Faso, d'y souscrire en parts et de suivre l'évolution de leur portefeuille d'actifs.

---

## 🚀 Fonctionnalités Clés

### 👤 Espace Investisseur
- **Catalogue d'Investissement** : Visualisation des offres d'investissement avec filtres par secteur, niveau de risque et statut (ouvert/fermé).
- **Tunnel de Souscription (Stripe)** : Achat de parts d'entreprises en ligne via l'API Stripe avec redirection dynamique de confirmation.
- **Portefeuille Interactif** : Graphiques financiers (Recharts) pour visualiser la répartition sectorielle et l'évolution globale de ses investissements.
- **Gestion du profil & KYC** : Soumission des documents légaux (Carte d'identité et Justificatif de domicile) pour validation.

### 🛡️ Espace Administrateur
- **Gestion des Utilisateurs & KYC** : Liste complète des comptes inscrits avec validation ou rejet en un clic des documents de KYC soumis.
- **Gestion des Offres** : Création, modification et clôture des projets d'investissement.
- **Suivi des Transactions** : Historique global de tous les fonds investis sur la plateforme.

---

## 🛠️ Stack Technique

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Style & UI** : [Tailwind CSS 4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Visualisations** : [Recharts](https://recharts.org/) (graphiques interactifs)
- **Appels API** : [Axios](https://axios-http.com/)

---

## 📁 Structure du Projet

```text
plateforme-investissement-frontend/
├── public/                 # Fichiers publics (favicon, images, etc.)
└── src/
    ├── app/                # Pages & Layouts (Next.js App Router)
    │   ├── about/          # Page À Propos
    │   ├── admin/          # Espace Administration
    │   │   ├── kyc/        # Validation des documents KYC
    │   │   ├── offres/     # Gestion des offres (Création/Modification)
    │   │   └── utilisateurs/# Liste et gestion des comptes utilisateurs
    │   ├── auth/           # Authentification (Connexion & Inscription)
    │   ├── catalogue/      # Liste et détail des offres d'investissement
    │   ├── contact/        # Page Contact
    │   ├── dashboard/      # Tableau de bord investisseur (Graphiques)
    │   ├── faq/            # Foire Aux Questions
    │   ├── kyc/            # Formulaire de soumission KYC
    │   ├── portefeuille/   # Suivi des actifs souscrits
    │   ├── profil/         # Informations personnelles & solde
    │   ├── souscrire/      # Tunnel d'achat & Redirection Stripe
    │   ├── transactions/   # Historique des transactions de l'utilisateur
    │   ├── globals.css     # Styles globaux & variables CSS
    │   ├── layout.tsx      # Layout racine du site (Navbar & HTML)
    │   ├── not-found.tsx   # Page 404 customisée
    │   └── page.tsx        # Page d'accueil publique (Landing Page)
    ├── components/         # Composants React réutilisables
    │   ├── ui/             # Composants de base (Button, Card, Input...)
    │   └── Navbar.tsx      # Barre de navigation globale
    └── lib/                # Fonctions & Configurations utilitaires
        ├── auth.ts         # Instance Axios configurée & helpers de tokens
        └── utils.ts        # Helper de fusion de classes CSS (cn)
```

---

## 💻 Démarrage Local

### Prérequis
- Node.js (version 20+)
- Le backend configuré et en cours d'exécution.

### Installation

1. Clonez le dépôt et naviguez dans le dossier :
   ```bash
   cd plateforme-investissement-frontend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Créez un fichier `.env.local` à la racine avec les variables d'environnement suivantes :
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_API_BASE=http://localhost:3001
   ```

4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

5. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 📦 Déploiement sur Vercel

Le projet est configuré pour un déploiement continu sur **Vercel**.

1. Connectez votre dépôt GitHub sur le tableau de bord Vercel.
2. Ajoutez les variables d'environnement de production :
   - `NEXT_PUBLIC_API_URL` : URL de production de votre API backend (ex: `https://mon-backend.onrender.com/api`).
   - `NEXT_PUBLIC_API_BASE` : URL de base du backend (ex: `https://mon-backend.onrender.com`).
3. Vercel détecte automatiquement les scripts de build Next.js. Cliquez sur **Deploy**.
