# 🔐 Système de Gestion des Profils Utilisateurs AfricaHub

## 📋 Vue d'ensemble

Le système de gestion des profils utilisateurs d'AfricaHub permet de gérer 4 types d'utilisateurs distincts avec des permissions et fonctionnalités spécifiques. Ce système est conçu pour offrir une expérience personnalisée selon le rôle de chaque utilisateur.

## 👥 Types de Profils Utilisateurs

### 1. 👤 Utilisateur Simple
- **Inscription** : Libre et immédiate
- **Fonctionnalités** :
  - Comparer des produits et services
  - Laisser des avis et commentaires
  - Gérer une liste de favoris
  - Modifier son profil personnel
  - Accéder aux recommandations IA

### 2. 🏪 Marchand
- **Inscription** : Libre avec validation manuelle
- **Fonctionnalités** :
  - Toutes les fonctionnalités d'un utilisateur simple
  - Gérer son catalogue de produits
  - Répondre aux avis clients
  - Voir ses statistiques de vente
  - Gérer ses commandes

### 3. 🛡️ Gestionnaire
- **Attribution** : Par un administrateur uniquement
- **Fonctionnalités** :
  - Modérer le contenu de la plateforme
  - Vérifier la conformité des produits
  - Gérer les avis et commentaires
  - Générer des rapports de modération
  - Résoudre les signalements

### 4. 👑 Administrateur
- **Attribution** : Accès complet au système
- **Fonctionnalités** :
  - Toutes les fonctionnalités précédentes
  - Gérer tous les utilisateurs
  - Attribuer des rôles
  - Configurer la plateforme
  - Résoudre les litiges
  - Accéder aux statistiques globales

## 🏗️ Architecture Technique

### Structure des Fichiers

```
src/
├── types/
│   └── user-profiles.ts          # Types TypeScript pour les profils
├── contexts/
│   └── AuthContext.tsx           # Contexte d'authentification amélioré
├── components/
│   └── auth/
│       ├── ProtectedRoute.tsx    # Protection des routes
│       ├── SignUpForms.tsx       # Formulaires d'inscription
│       └── ProfileRedirect.tsx   # Redirection intelligente
├── pages/
│   ├── auth/
│   │   └── AuthPage.tsx          # Page d'authentification unifiée
│   ├── user/
│   │   └── UserDashboardPage.tsx # Dashboard utilisateur simple
│   ├── merchant/
│   │   └── MerchantDashboardPage.tsx # Dashboard marchand
│   ├── manager/
│   │   └── ManagerDashboardPage.tsx  # Dashboard gestionnaire
│   └── admin/
│       └── AdminDashboardPage.tsx    # Dashboard administrateur
└── supabase/
    └── migrations/
        └── 20250101000001_create_user_profiles_system.sql
```

### Base de Données

#### Tables Principales

1. **user_profiles** : Informations des profils utilisateurs
2. **profile_permissions** : Permissions par type de profil
3. **user_role_assignments** : Attribution des rôles (gestionnaires/admins)
4. **user_favorites** : Favoris des utilisateurs
5. **product_reviews** : Avis produits
6. **review_responses** : Réponses des marchands
7. **merchant_catalogs** : Catalogues marchands
8. **merchant_products** : Produits des marchands

#### Sécurité RLS (Row Level Security)

Toutes les tables sensibles sont protégées par des politiques RLS qui garantissent que :
- Les utilisateurs ne peuvent accéder qu'à leurs propres données
- Les marchands ne voient que leurs produits et avis
- Les gestionnaires ont accès aux données de modération
- Les administrateurs ont un accès complet

## 🚀 Installation et Configuration

### 1. Prérequis

```bash
# Installer Supabase CLI
npm install -g supabase

# Vérifier l'installation
supabase --version
```

### 2. Configuration Automatique

```bash
# Exécuter le script de configuration
./scripts/setup-user-profiles.sh
```

### 3. Configuration Manuelle

#### Étape 1 : Variables d'environnement

Créer un fichier `.env` :

```env
VITE_SUPABASE_URL=https://wgizdqaspwenhnbyuuro.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnaXpkcWFzcHdlbmhuYnl1dXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNzM5MzIsImV4cCI6MjA2NDc0OTkzMn0.plur-Q5wkkuoI6EC7-HU8sbpPRMouTMcM0Mc8bcNZWI
```

#### Étape 2 : Migration de la base de données

```bash
# Lier le projet Supabase
supabase link --project-ref wgizdqaspwenhnbyuuro

# Appliquer la migration
supabase db push
```

#### Étape 3 : Générer les types TypeScript

```bash
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

## 🔐 Système d'Authentification

### Inscription

#### Utilisateur Simple
```typescript
const { signUpSimpleUser } = useAuth();

const userData = {
  email: 'user@example.com',
  password: 'password123',
  first_name: 'John',
  last_name: 'Doe',
  country_code: 'CI',
  city: 'Abidjan'
};

const result = await signUpSimpleUser(userData);
```

#### Marchand
```typescript
const { signUpMerchant } = useAuth();

const merchantData = {
  email: 'merchant@example.com',
  password: 'password123',
  first_name: 'Jane',
  last_name: 'Smith',
  company_name: 'TechStore CI',
  company_description: 'Vente d\'équipements informatiques',
  country_code: 'CI',
  city: 'Abidjan'
};

const result = await signUpMerchant(merchantData);
```

### Connexion

```typescript
const { signIn } = useAuth();

const result = await signIn('user@example.com', 'password123');
if (result.profile) {
  // Redirection automatique vers le bon dashboard
}
```

## 🛡️ Protection des Routes

### Utilisation des Composants de Protection

```typescript
import { SimpleUserRoute, MerchantRoute, ManagerRoute, AdminRoute } from '@/components/auth/ProtectedRoute';

// Route pour utilisateurs simples uniquement
<SimpleUserRoute>
  <UserDashboardPage />
</SimpleUserRoute>

// Route pour marchands uniquement
<MerchantRoute>
  <MerchantDashboardPage />
</MerchantRoute>

// Route pour gestionnaires uniquement
<ManagerRoute>
  <ManagerDashboardPage />
</ManagerRoute>

// Route pour administrateurs uniquement
<AdminRoute>
  <AdminDashboardPage />
</AdminRoute>
```

### Vérification des Permissions

```typescript
import { usePermissions } from '@/components/auth/ProtectedRoute';

const MyComponent = () => {
  const { hasPermission, isAdmin, isMerchant } = usePermissions();

  if (hasPermission('manage_catalog')) {
    // Afficher les outils de gestion de catalogue
  }

  if (isAdmin) {
    // Afficher les fonctionnalités admin
  }

  return <div>...</div>;
};
```

## 🎨 Dashboards Personnalisés

### Redirection Intelligente

Le système redirige automatiquement les utilisateurs vers leur dashboard approprié :

- `/dashboard` → Redirection automatique
- `/dashboard/user` → Dashboard utilisateur simple
- `/dashboard/merchant` → Dashboard marchand
- `/dashboard/manager` → Dashboard gestionnaire
- `/dashboard/admin` → Dashboard administrateur

### Fonctionnalités par Dashboard

#### Dashboard Utilisateur Simple
- Statistiques personnelles (favoris, avis, comparaisons)
- Actions rapides (comparer, parcourir, recommandations)
- Gestion des favoris et avis
- Modification du profil

#### Dashboard Marchand
- Métriques commerciales (ventes, vues, revenus)
- Gestion des produits et catalogues
- Réponses aux avis clients
- Statistiques détaillées

#### Dashboard Gestionnaire
- Outils de modération
- Avis et produits en attente
- Signalements à traiter
- Rapports de modération

#### Dashboard Administrateur
- Statistiques globales de la plateforme
- Gestion des utilisateurs
- Configuration système
- Surveillance et sécurité

## 🔧 Personnalisation

### Ajouter un Nouveau Type de Profil

1. **Mettre à jour les types** dans `src/types/user-profiles.ts`
2. **Ajouter les permissions** dans `PROFILE_PERMISSIONS`
3. **Créer le dashboard** dans `src/pages/nouveau-type/`
4. **Ajouter la protection** dans `ProtectedRoute.tsx`
5. **Mettre à jour la migration** SQL

### Modifier les Permissions

Les permissions sont définies dans `src/types/user-profiles.ts` :

```typescript
export const PROFILE_PERMISSIONS = {
  simple_user: [
    'view_products',
    'create_reviews',
    'manage_favorites',
    'update_profile'
  ],
  // ... autres profils
};
```

## 🧪 Tests

### Tests d'Authentification

```bash
# Tester l'inscription utilisateur simple
npm run test -- --grep "SimpleUser signup"

# Tester l'inscription marchand
npm run test -- --grep "Merchant signup"

# Tester la redirection des dashboards
npm run test -- --grep "Dashboard redirect"
```

### Tests de Permissions

```bash
# Tester les protections de routes
npm run test -- --grep "Route protection"

# Tester les permissions par profil
npm run test -- --grep "Profile permissions"
```

## 🐛 Dépannage

### Problèmes Courants

#### 1. Erreur de connexion Supabase
```
Error: Invalid API key
```
**Solution** : Vérifier les variables d'environnement dans `.env`

#### 2. Profil non créé après inscription
```
Error: Profile not found
```
**Solution** : Vérifier que la migration a été appliquée correctement

#### 3. Redirection infinie
```
Error: Too many redirects
```
**Solution** : Vérifier la logique de redirection dans `ProfileRedirect.tsx`

### Logs de Débogage

Activer les logs détaillés :

```typescript
// Dans AuthContext.tsx
console.log('🔍 AuthContext: Debug info', { user, profile, permissions });
```

## 📚 Ressources Supplémentaires

- [Documentation Supabase](https://supabase.com/docs)
- [Guide React Router](https://reactrouter.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contribution

Pour contribuer au système de profils utilisateurs :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📄 Licence

Ce système est développé dans le cadre du projet AfricaHub et suit la même licence que le projet principal.
