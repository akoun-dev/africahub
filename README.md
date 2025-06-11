# 🌍 AfricaHub - Plateforme de Comparaison d'Assurances pour l'Afrique

## 📋 Table des Matières

-   [Vue d'ensemble](#vue-densemble)
-   [Fonctionnalités par Type d'Utilisateur](#fonctionnalités-par-type-dutilisateur)
-   [Technologies Utilisées](#technologies-utilisées)
-   [Architecture du Projet](#architecture-du-projet)
-   [Structure des Dossiers](#structure-des-dossiers)
-   [Installation et Configuration](#installation-et-configuration)
-   [Base de Données](#base-de-données)
-   [Authentification et Autorisation](#authentification-et-autorisation)
-   [API et Microservices](#api-et-microservices)
-   [Tests](#tests)
-   [Déploiement](#déploiement)
-   [Contribution](#contribution)

## 🎯 Vue d'ensemble

AfricaHub est une plateforme innovante de comparaison d'assurances spécialement conçue pour le marché africain. Elle permet aux utilisateurs de comparer, analyser et choisir les meilleures offres d'assurance adaptées à leurs besoins spécifiques, tout en offrant aux compagnies d'assurance un canal de distribution moderne et efficace.

### 🌟 Objectifs Principaux

-   **Démocratiser l'accès à l'assurance** en Afrique
-   **Simplifier la comparaison** des produits d'assurance
-   **Fournir des recommandations personnalisées** basées sur l'IA
-   **Créer un écosystème transparent** entre assureurs et assurés
-   **Supporter les 54 pays africains** avec des configurations locales

## 👥 Fonctionnalités par Type d'Utilisateur

### 🔵 Utilisateur Simple (User)

#### 🏠 Dashboard Personnel

-   **Vue d'ensemble** : Statistiques personnelles (favoris, avis, comparaisons)
-   **Recommandations IA** : Suggestions personnalisées basées sur le profil
-   **Activité récente** : Historique des recherches et comparaisons
-   **Alertes prix** : Notifications de baisse de prix sur les favoris

#### 🔍 Recherche et Comparaison

-   **Recherche avancée** : Filtres par pays, secteur, type de couverture
-   **Comparaison multi-critères** : Tableaux comparatifs détaillés
-   **Graphiques radar** : Visualisation des forces/faiblesses
-   **Score de compatibilité** : Algorithme de matching personnalisé

#### ⭐ Gestion des Favoris et Avis

-   **Liste de favoris** : Sauvegarde des produits intéressants
-   **Système d'avis** : Notation et commentaires sur les produits
-   **Partage social** : Partage de comparaisons avec la communauté
-   **Historique** : Suivi des recherches et décisions

#### 🔧 Profil et Préférences

-   **Informations personnelles** : Gestion du profil utilisateur
-   **Préférences** : Langue, devise, notifications
-   **Paramètres de confidentialité** : Contrôle de la visibilité des données
-   **Sécurité** : Authentification à deux facteurs, gestion des sessions

### 🟢 Marchand (Merchant)

#### 📊 Dashboard Business

-   **Métriques de performance** : Vues, clics, conversions
-   **Analyse des tendances** : Évolution des performances dans le temps
-   **Comparaison concurrentielle** : Position par rapport aux concurrents
-   **ROI des campagnes** : Retour sur investissement publicitaire

#### 📦 Gestion des Produits

-   **Catalogue produits** : Création et modification des offres d'assurance
-   **Tarification dynamique** : Outils de calcul de prix en temps réel
-   **Configuration par pays** : Adaptation aux réglementations locales
-   **Gestion des documents** : Upload et organisation des documents légaux

#### 💬 Interaction Client

-   **Réponses aux avis** : Gestion de la réputation en ligne
-   **Chat support** : Communication directe avec les prospects
-   **Lead management** : Suivi des demandes de devis
-   **Analytics client** : Profils et comportements des prospects

#### 🎯 Marketing et Promotion

-   **Campagnes publicitaires** : Création et gestion des annonces
-   **Ciblage géographique** : Promotion par pays/région
-   **A/B Testing** : Optimisation des messages marketing
-   **Rapports de performance** : Métriques détaillées des campagnes

### 🟡 Gestionnaire (Manager)

#### 🛡️ Modération de Contenu

-   **Validation des produits** : Vérification de la conformité
-   **Modération des avis** : Contrôle de la qualité des commentaires
-   **Gestion des signalements** : Traitement des contenus inappropriés
-   **Workflow d'approbation** : Processus de validation structuré

#### 📈 Analytics et Reporting

-   **Tableaux de bord régionaux** : Métriques par pays/zone
-   **Rapports de performance** : KPIs de la plateforme
-   **Analyse des tendances** : Évolution du marché
-   **Alertes automatiques** : Notifications sur les anomalies

#### 👥 Gestion des Utilisateurs

-   **Support utilisateur** : Assistance aux utilisateurs et marchands
-   **Résolution de conflits** : Médiation entre parties
-   **Gestion des comptes** : Activation/désactivation des profils
-   **Formation** : Accompagnement des nouveaux marchands

### 🔴 Administrateur (Admin)

#### ⚙️ Configuration Plateforme

-   **Paramètres généraux** : Configuration globale du système
-   **Gestion des pays** : Support des 54 pays africains
-   **Devises et langues** : Configuration des localisations
-   **Réglementations** : Adaptation aux lois locales

#### 🔐 Gestion des Rôles et Permissions

-   **Système de rôles** : Création et modification des rôles
-   **Permissions granulaires** : Contrôle d'accès fin
-   **Audit des actions** : Traçabilité des modifications
-   **Sécurité avancée** : Politiques de sécurité

#### 🏗️ Infrastructure et Monitoring

-   **Monitoring système** : Surveillance des performances
-   **Gestion des API** : Configuration des intégrations
-   **Backup et restauration** : Sauvegarde des données
-   **Logs et diagnostics** : Analyse des erreurs

#### 📊 Analytics Avancées

-   **Business Intelligence** : Rapports exécutifs
-   **Prédictions IA** : Modèles prédictifs du marché
-   **Optimisation** : Recommandations d'amélioration
-   **Benchmarking** : Comparaison avec la concurrence

## 🛠️ Technologies Utilisées

### Frontend

-   **React 18** - Framework JavaScript moderne
-   **TypeScript** - Typage statique pour JavaScript
-   **Vite** - Build tool ultra-rapide
-   **Tailwind CSS** - Framework CSS utility-first
-   **Shadcn/ui** - Composants UI modernes et accessibles
-   **Framer Motion** - Animations fluides
-   **React Router** - Navigation côté client
-   **React Hook Form** - Gestion des formulaires
-   **Zod** - Validation de schémas
-   **Recharts** - Graphiques et visualisations
-   **Mapbox GL** - Cartes interactives

### Backend et Base de Données

-   **Supabase** - Backend-as-a-Service
    -   PostgreSQL - Base de données relationnelle
    -   Row Level Security (RLS) - Sécurité au niveau des lignes
    -   Real-time subscriptions - Mises à jour en temps réel
    -   Edge Functions - Fonctions serverless
-   **Redis** - Cache et sessions (via Supabase)

### Authentification et Sécurité

-   **Supabase Auth** - Authentification complète
-   **JWT Tokens** - Tokens sécurisés
-   **OAuth Providers** - Connexion sociale
-   **2FA Support** - Authentification à deux facteurs
-   **RBAC** - Contrôle d'accès basé sur les rôles

### DevOps et Infrastructure

-   **Docker** - Conteneurisation
-   **Docker Compose** - Orchestration locale
-   **GitHub Actions** - CI/CD
-   **Vercel/Netlify** - Déploiement frontend
-   **Supabase Cloud** - Hébergement backend

### Outils de Développement

-   **ESLint** - Linting JavaScript/TypeScript
-   **Prettier** - Formatage de code
-   **Vitest** - Tests unitaires
-   **Testing Library** - Tests de composants React
-   **MSW** - Mock Service Worker pour les tests
-   **Storybook** - Documentation des composants

### Monitoring et Analytics

-   **Sentry** - Monitoring d'erreurs
-   **Google Analytics** - Analytics web
-   **Supabase Analytics** - Métriques backend
-   **Prometheus** - Métriques système (microservices)

## 🏗️ Architecture du Projet

### Architecture Globale

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │  Microservices  │
│   (React/Vite)  │◄──►│   (Backend)     │◄──►│   (Optional)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Hosting   │    │   PostgreSQL    │    │   External APIs │
│  (Vercel/Netlify)│    │   + Real-time   │    │  (Insurance)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Architecture Frontend

-   **Composants réutilisables** avec Shadcn/ui
-   **Hooks personnalisés** pour la logique métier
-   **Contextes React** pour l'état global
-   **Routing protégé** basé sur les rôles
-   **Lazy loading** pour les performances

### Architecture Backend (Supabase)

-   **Base de données PostgreSQL** avec schémas optimisés
-   **Row Level Security** pour la sécurité des données
-   **Edge Functions** pour la logique métier complexe
-   **Real-time subscriptions** pour les mises à jour live
-   **Storage** pour les fichiers et documents

## 📁 Structure des Dossiers

```
africahub/
├── 📁 public/                          # Fichiers statiques
│   ├── 📁 data/                        # Données JSON statiques
│   ├── 📁 patterns/                    # Motifs et textures
│   └── 📄 manifest.json               # Manifest PWA
│
├── 📁 src/                             # Code source principal
│   ├── 📁 components/                  # Composants React réutilisables
│   │   ├── 📁 ui/                      # Composants UI de base (Shadcn)
│   │   ├── 📁 admin/                   # Composants d'administration
│   │   ├── 📁 comparison/              # Outils de comparaison
│   │   ├── 📁 navigation/              # Navigation et menus
│   │   ├── 📁 layout/                  # Layouts et structures
│   │   └── 📁 forms/                   # Formulaires spécialisés
│   │
│   ├── 📁 pages/                       # Pages de l'application
│   │   ├── 📁 user/                    # Pages utilisateur simple
│   │   ├── 📁 merchant/                # Pages marchand
│   │   ├── 📁 manager/                 # Pages gestionnaire
│   │   ├── 📁 admin/                   # Pages administrateur
│   │   └── 📁 legal/                   # Pages légales
│   │
│   ├── 📁 contexts/                    # Contextes React (état global)
│   │   ├── 📄 EnhancedAuthContext.tsx  # Authentification avancée
│   │   └── 📄 ThemeContext.tsx         # Gestion des thèmes
│   │
│   ├── 📁 hooks/                       # Hooks personnalisés
│   │   ├── 📄 useEnhancedAuth.ts       # Hook d'authentification
│   │   ├── 📄 useProducts.ts           # Gestion des produits
│   │   └── 📄 useTranslation.ts        # Internationalisation
│   │
│   ├── 📁 types/                       # Définitions TypeScript
│   │   ├── 📄 user.ts                  # Types utilisateur
│   │   ├── 📄 product.ts               # Types produit
│   │   └── 📄 api.ts                   # Types API
│   │
│   ├── 📁 integrations/                # Intégrations externes
│   │   ├── 📁 supabase/                # Configuration Supabase
│   │   │   ├── 📄 client.ts            # Client Supabase
│   │   │   ├── 📄 types.ts             # Types générés
│   │   │   └── 📄 extended-types.ts    # Types étendus
│   │   └── 📁 mapbox/                  # Configuration Mapbox
│   │
│   ├── 📁 services/                    # Services métier
│   │   ├── 📄 authService.ts           # Service d'authentification
│   │   ├── 📄 productService.ts        # Service produits
│   │   └── 📄 analyticsService.ts      # Service analytics
│   │
│   ├── 📁 utils/                       # Utilitaires
│   │   ├── 📄 formatters.ts            # Formatage de données
│   │   ├── 📄 validators.ts            # Validations
│   │   └── 📄 constants.ts             # Constantes
│   │
│   ├── 📁 lib/                         # Bibliothèques configurées
│   │   ├── 📄 utils.ts                 # Utilitaires généraux
│   │   └── 📄 validations.ts           # Schémas Zod
│   │
│   └── 📁 styles/                      # Styles globaux
│       ├── 📄 globals.css              # Styles globaux
│       └── 📄 components.css           # Styles de composants
│
├── 📁 supabase/                        # Configuration Supabase
│   ├── 📁 migrations/                  # Migrations de base de données
│   │   ├── 📄 20240101000001_create_user_profiles_table.sql
│   │   ├── 📄 20240101000002_create_merchant_profiles_table.sql
│   │   └── 📄 ...                      # Autres migrations
│   ├── 📁 functions/                   # Edge Functions
│   └── 📄 config.toml                  # Configuration Supabase
│
├── 📁 microservices/                   # Microservices (optionnel)
│   ├── 📁 ai-recommendations/          # Service de recommandations IA
│   ├── 📁 analytics/                   # Service d'analytics
│   ├── 📁 comparison-engine/           # Moteur de comparaison
│   ├── 📁 notifications/               # Service de notifications
│   └── 📁 product-catalog/             # Catalogue de produits
│
├── 📁 infrastructure/                  # Infrastructure et DevOps
│   ├── 📄 docker-compose.yml           # Composition Docker
│   ├── 📁 kong/                        # Configuration API Gateway
│   └── 📁 prometheus/                  # Monitoring
│
├── 📁 docs/                            # Documentation
│   ├── 📄 API.md                       # Documentation API
│   ├── 📄 DEPLOYMENT.md                # Guide de déploiement
│   └── 📄 CONTRIBUTING.md              # Guide de contribution
│
├── 📄 package.json                     # Dépendances Node.js
├── 📄 tsconfig.json                    # Configuration TypeScript
├── 📄 tailwind.config.ts               # Configuration Tailwind
├── 📄 vite.config.ts                   # Configuration Vite
└── 📄 README.md                        # Ce fichier
```

## 🚀 Installation et Configuration

### Prérequis

-   **Node.js** 18+ et npm/yarn/pnpm
-   **Git** pour le contrôle de version
-   **Compte Supabase** pour le backend
-   **Compte Mapbox** pour les cartes (optionnel)

### Installation Locale

1. **Cloner le repository**

```bash
git clone https://github.com/akoun-dev/africahub.git
cd africahub
```

2. **Installer les dépendances**

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configuration des variables d'environnement**

```bash
cp .env.example .env.local
```

Configurer les variables dans `.env.local` :

```env
# Supabase
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anonyme

# Mapbox (optionnel)
VITE_MAPBOX_ACCESS_TOKEN=votre-token-mapbox

# Environnement
VITE_APP_ENV=development
```

4. **Démarrer le serveur de développement**

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:8080`

### Configuration Supabase

1. **Créer un projet Supabase**

    - Aller sur [supabase.com](https://supabase.com)
    - Créer un nouveau projet
    - Noter l'URL et la clé anonyme

2. **Appliquer les migrations**

```bash
npx supabase db reset --db-url "postgresql://postgres:VOTRE_MOT_DE_PASSE@db.VOTRE_PROJET.supabase.co:5432/postgres"
```

3. **Configurer l'authentification**
    - Activer les providers souhaités (Email, Google, etc.)
    - Configurer les URLs de redirection
    - Paramétrer les templates d'email

## 🗄️ Base de Données

### Schéma Principal

#### Tables Utilisateurs

-   **`user_profiles`** - Profils utilisateurs avec rôles
-   **`merchant_profiles`** - Informations business des marchands
-   **`user_permissions`** - Permissions granulaires
-   **`available_permissions`** - Référentiel des permissions

#### Tables Produits

-   **`products`** - Catalogue des produits d'assurance
-   **`companies`** - Compagnies d'assurance
-   **`sectors`** - Secteurs d'activité
-   **`product_types`** - Types de produits

#### Tables Interaction

-   **`favorites`** - Favoris des utilisateurs
-   **`reviews`** - Avis et commentaires
-   **`comparison_history`** - Historique des comparaisons
-   **`user_interactions`** - Tracking des interactions

#### Tables Configuration

-   **`geographic_configurations`** - Configuration par pays
-   **`localized_content`** - Contenu localisé
-   **`notification_preferences`** - Préférences de notification

### Sécurité (RLS)

Toutes les tables utilisent **Row Level Security** avec des politiques spécifiques :

-   **Lecture** : Utilisateurs voient leurs propres données + admins voient tout
-   **Écriture** : Utilisateurs modifient leurs données + admins ont tous les droits
-   **Insertion** : Contrôlée par rôle et contexte
-   **Suppression** : Généralement réservée aux admins

## 🔐 Authentification et Autorisation

### Système de Rôles

#### 🔵 User (Utilisateur Simple)

-   **Permissions par défaut** :
    -   `view_products` - Voir les produits
    -   `create_reviews` - Créer des avis
    -   `manage_favorites` - Gérer les favoris
    -   `view_profile` - Voir son profil
    -   `edit_profile` - Modifier son profil

#### 🟢 Merchant (Marchand)

-   **Hérite de User** +
    -   `manage_products` - Gérer ses produits
    -   `view_analytics` - Voir ses statistiques
    -   `respond_reviews` - Répondre aux avis
    -   `manage_business_profile` - Gérer son profil business

#### 🟡 Manager (Gestionnaire)

-   **Permissions spéciales** :
    -   `moderate_content` - Modérer le contenu
    -   `verify_products` - Vérifier les produits
    -   `view_reports` - Voir les rapports
    -   `manage_users` - Gérer les utilisateurs

#### 🔴 Admin (Administrateur)

-   **Accès complet** :
    -   `admin_full_access` - Accès administrateur complet
    -   `manage_permissions` - Gérer les permissions
    -   `system_config` - Configuration système
    -   `view_system_logs` - Voir les logs système

### Flux d'Authentification

1. **Inscription** → Création automatique du profil utilisateur
2. **Connexion** → Vérification des credentials + chargement du profil
3. **Autorisation** → Vérification des permissions pour chaque action
4. **Redirection** → Redirection automatique vers le dashboard approprié

## 🔌 API et Microservices

### API Supabase (Principal)

-   **REST API** automatique basée sur le schéma PostgreSQL
-   **GraphQL** via PostgREST
-   **Real-time** subscriptions WebSocket
-   **Edge Functions** pour la logique métier

### Microservices (Optionnel)

#### 🤖 AI Recommendations

-   **Port** : 3001
-   **Fonction** : Recommandations personnalisées basées sur l'IA
-   **Technologies** : Python, TensorFlow, FastAPI

#### 📊 Analytics Service

-   **Port** : 3002
-   **Fonction** : Collecte et analyse des métriques
-   **Technologies** : Node.js, InfluxDB, Grafana

#### ⚖️ Comparison Engine

-   **Port** : 3003
-   **Fonction** : Moteur de comparaison avancé
-   **Technologies** : Node.js, Redis, Elasticsearch

#### 📧 Notifications Service

-   **Port** : 3004
-   **Fonction** : Envoi de notifications multi-canal
-   **Technologies** : Node.js, Bull Queue, SendGrid

### API Gateway (Kong)

-   **Authentification** centralisée
-   **Rate limiting** par utilisateur/IP
-   **Monitoring** et logs
-   **Load balancing** entre microservices

## 🧪 Tests

### Types de Tests

#### Tests Unitaires (Vitest)

```bash
npm run test              # Lancer tous les tests
npm run test:watch        # Mode watch
npm run test:coverage     # Avec couverture de code
```

#### Tests de Composants (Testing Library)

```bash
npm run test:components   # Tests des composants React
npm run test:integration  # Tests d'intégration
```

#### Tests E2E (Playwright - à venir)

```bash
npm run test:e2e          # Tests end-to-end
npm run test:e2e:ui       # Interface graphique
```

### Structure des Tests

```
src/
├── __tests__/                    # Tests globaux
├── components/
│   └── __tests__/               # Tests de composants
├── hooks/
│   └── __tests__/               # Tests de hooks
└── utils/
    └── __tests__/               # Tests d'utilitaires
```

### Mocking et Fixtures

-   **MSW** pour mocker les API
-   **Fixtures** pour les données de test
-   **Test utilities** pour les helpers de test

## 🚀 Déploiement

### Environnements

#### Développement

-   **URL** : `http://localhost:5173`
-   **Base de données** : Supabase local ou cloud
-   **Hot reload** activé

#### Staging

-   **URL** : `https://staging.africahub.com`
-   **Base de données** : Supabase staging
-   **Tests automatiques** avant déploiement

#### Production

-   **URL** : `https://africahub.com`
-   **Base de données** : Supabase production
-   **CDN** : Cloudflare
-   **Monitoring** : Sentry + Analytics

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
    push:
        branches: [main, develop]

jobs:
    test:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - name: Setup Node.js
              uses: actions/setup-node@v3
            - name: Install dependencies
              run: npm ci
            - name: Run tests
              run: npm run test
            - name: Build
              run: npm run build

    deploy:
        needs: test
        runs-on: ubuntu-latest
        steps:
            - name: Deploy to Vercel
              uses: vercel/action@v1
```

### Variables d'Environnement par Environnement

#### Development

```env
VITE_APP_ENV=development
VITE_SUPABASE_URL=https://dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=dev-key
```

#### Production

```env
VITE_APP_ENV=production
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=prod-key
```

## 📊 Monitoring et Analytics

### Métriques Techniques

-   **Performance** : Core Web Vitals, temps de chargement
-   **Erreurs** : Sentry pour le tracking d'erreurs
-   **Uptime** : Monitoring de disponibilité
-   **API** : Latence et taux d'erreur des API

### Métriques Business

-   **Utilisateurs** : Inscriptions, connexions, rétention
-   **Engagement** : Pages vues, temps passé, interactions
-   **Conversions** : Comparaisons → Demandes de devis
-   **Revenus** : Commissions, abonnements marchands

### Outils de Monitoring

-   **Sentry** : Monitoring d'erreurs et performance
-   **Google Analytics** : Analytics web
-   **Supabase Analytics** : Métriques backend
-   **Vercel Analytics** : Performance frontend

## 🤝 Contribution

### Guide de Contribution

1. **Fork** le repository
2. **Créer une branche** pour votre feature

```bash
git checkout -b feature/nouvelle-fonctionnalite
```

3. **Développer** en suivant les conventions
4. **Tester** votre code

```bash
npm run test
npm run lint
```

5. **Commiter** avec des messages clairs

```bash
git commit -m "feat: ajouter comparaison avancée"
```

6. **Pousser** et créer une Pull Request

### Conventions de Code

#### Naming Conventions

-   **Composants** : PascalCase (`UserDashboard.tsx`)
-   **Hooks** : camelCase avec préfixe `use` (`useAuth.ts`)
-   **Utilitaires** : camelCase (`formatPrice.ts`)
-   **Constants** : SCREAMING_SNAKE_CASE (`API_ENDPOINTS`)

#### Structure des Commits

```
type(scope): description

feat(auth): ajouter authentification 2FA
fix(ui): corriger responsive du header
docs(readme): mettre à jour installation
style(components): formater le code
refactor(api): optimiser les requêtes
test(hooks): ajouter tests useAuth
```

#### Code Style

-   **ESLint** + **Prettier** pour le formatage
-   **TypeScript strict** mode activé
-   **Commentaires JSDoc** pour les fonctions publiques
-   **Tests** obligatoires pour les nouvelles features

### Review Process

1. **Automated checks** : Tests, linting, build
2. **Code review** : Au moins 1 approbation requise
3. **Manual testing** : Vérification fonctionnelle
4. **Merge** : Squash and merge vers main

## 📞 Support et Contact

### Documentation

-   **Wiki** : [GitHub Wiki](https://github.com/akoun-dev/africahub/wiki)
-   **API Docs** : [docs.africahub.com](https://docs.africahub.com)
-   **Changelog** : [CHANGELOG.md](./CHANGELOG.md)

### Support Technique

-   **Issues GitHub** : Pour les bugs et feature requests
-   **Discussions** : Pour les questions générales
-   **Email** : support@africahub.com

### Équipe de Développement

-   **Lead Developer** : ABOA AKOUN BERNARD
-   **Email** : aboa.akoun40@gmail.com
-   **GitHub** : [@akoun-dev](https://github.com/akoun-dev)

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

## 🙏 Remerciements

-   **Supabase** pour l'infrastructure backend
-   **Vercel** pour l'hébergement frontend
-   **Shadcn/ui** pour les composants UI
-   **Communauté Open Source** pour les outils et bibliothèques

---

**AfricaHub** - _Démocratiser l'accès à l'assurance en Afrique_ 🌍✨
