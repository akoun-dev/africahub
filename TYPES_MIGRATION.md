# Migration des Types AfricaHub - Documentation

## 🎯 Objectif

Cette migration unifie le système de types TypeScript pour assurer la cohérence entre le schéma de base de données Supabase et les types utilisés dans l'application.

## 📋 Changements Effectués

### 1. **Restructuration des Types**

#### ✅ **Avant (Problématique)**
```
src/integrations/supabase/
├── types.ts                    # Types générés (incomplets)
├── user-types.ts              # Types utilisateur dupliqués
├── extended-types.ts          # Types étendus dupliqués
└── client.ts

src/types/
└── user.ts                    # Types métier séparés
```

#### ✅ **Après (Solution)**
```
src/integrations/supabase/
├── types.ts                   # Types générés complets et à jour
├── helpers.ts                 # Fonctions utilitaires et types dérivés
└── client.ts

src/types/
├── user.ts                    # Types métier étendus
└── index.ts                   # Exports centralisés
```

### 2. **Types Unifiés**

#### **Types de Base (Supabase)**
- `UserProfile` - Profil utilisateur de base
- `MerchantProfile` - Profil marchand
- `UserPermission` - Permissions utilisateur
- `UserWithProfile` - Profil utilisateur avec relations

#### **Types Métier Étendus**
- `UserProfile` - Utilisateur simple avec préférences
- `MerchantProfile` - Marchand avec métriques business
- `ManagerProfile` - Gestionnaire avec zones assignées
- `AdminProfile` - Administrateur avec statistiques système

### 3. **Fonctions Utilitaires**

```typescript
// Vérification des permissions
hasPermission(profile, 'view_products') // boolean
hasRole(profile, 'admin') // boolean
canAccess(profile, 'products', 'manage') // boolean

// Formatage
getFullName(profile) // "Jean Dupont"
getInitials(profile) // "JD"
formatUserRole('admin') // "Administrateur"
formatUserStatus('active') // "Actif"

// Validation des types
isUserRole('admin') // boolean
isUserStatus('active') // boolean
isVerificationStatus('verified') // boolean
```

### 4. **Contexte d'Authentification Unifié**

Le `AuthContext` a été étendu avec :
- ✅ Chargement automatique du profil utilisateur
- ✅ Fonctions de vérification des permissions
- ✅ Mise à jour du profil
- ✅ Gestion des rôles et permissions

```typescript
const { 
    profile, 
    hasPermission, 
    hasRole, 
    canAccess,
    updateProfile 
} = useAuth()
```

## 🔧 Migration des Imports

### **Avant**
```typescript
import { UserWithProfile } from '@/integrations/supabase/user-types'
import { UserRole } from '@/integrations/supabase/extended-types'
import { UserProfile } from '@/types/user'
```

### **Après**
```typescript
// Import unifié depuis helpers
import { UserWithProfile, UserRole } from '@/integrations/supabase/helpers'

// Ou import centralisé
import { UserWithProfile, UserRole, hasPermission } from '@/types'
```

## 🗄️ Cohérence Base de Données

### **Tables Synchronisées**
- ✅ `user_profiles` - Profils utilisateur avec email
- ✅ `merchant_profiles` - Profils marchands avec vérification
- ✅ `user_permissions` - Permissions granulaires
- ✅ `available_permissions` - Référentiel des permissions

### **Énumérations Cohérentes**
```sql
-- Base de données
CREATE TYPE user_role AS ENUM ('user', 'merchant', 'manager', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');
```

```typescript
// TypeScript
type UserRole = 'user' | 'merchant' | 'manager' | 'admin'
type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending'
```

## 🧪 Tests et Validation

### **Script de Test**
```typescript
import { testUnifiedTypes } from '@/utils/testUnifiedTypes'

// Exécution des tests
const result = await testUnifiedTypes()
```

### **Tests Inclus**
- ✅ Validation des constantes
- ✅ Fonctions de validation des types
- ✅ Formatage des données
- ✅ Permissions et rôles
- ✅ Connexion base de données
- ✅ Compilation TypeScript

## 📚 Utilisation

### **1. Authentification**
```typescript
import { useAuth } from '@/contexts/AuthContext'

const MyComponent = () => {
    const { profile, hasPermission, hasRole } = useAuth()
    
    if (!profile) return <div>Non connecté</div>
    
    return (
        <div>
            <h1>Bonjour {getFullName(profile)}</h1>
            {hasRole('admin') && <AdminPanel />}
            {hasPermission('manage_products') && <ProductManager />}
        </div>
    )
}
```

### **2. Gestion des Profils**
```typescript
import { UserWithProfile, updateProfile } from '@/types'

const updateUserProfile = async (updates: Partial<UserWithProfile>) => {
    const { error } = await updateProfile(updates)
    if (error) {
        console.error('Erreur mise à jour:', error)
    }
}
```

### **3. Vérification des Permissions**
```typescript
import { hasPermission, canAccess } from '@/integrations/supabase/helpers'

// Vérification simple
if (hasPermission(profile, 'view_analytics')) {
    // Afficher les analytics
}

// Vérification granulaire
if (canAccess(profile, 'products', 'create')) {
    // Permettre la création de produits
}
```

## 🚀 Avantages

### **1. Cohérence**
- ✅ Types synchronisés avec la base de données
- ✅ Pas de duplication de code
- ✅ Source unique de vérité

### **2. Sécurité**
- ✅ Validation stricte des types
- ✅ Permissions granulaires
- ✅ Vérifications automatiques

### **3. Maintenabilité**
- ✅ Code centralisé et réutilisable
- ✅ Fonctions utilitaires testées
- ✅ Documentation intégrée

### **4. Performance**
- ✅ Chargement optimisé des profils
- ✅ Cache des permissions
- ✅ Requêtes efficaces

## 🔄 Prochaines Étapes

1. **Tests d'Intégration** - Valider avec l'application complète
2. **Migration Progressive** - Mettre à jour les composants existants
3. **Documentation** - Compléter la documentation des API
4. **Optimisation** - Améliorer les performances si nécessaire

## 📞 Support

Pour toute question sur cette migration :
- Consulter les tests dans `src/utils/testUnifiedTypes.ts`
- Vérifier les types dans `src/integrations/supabase/helpers.ts`
- Examiner les exemples dans `src/types/user.ts`
