# Migrations Supabase - AfricaHub

Ce répertoire contient toutes les migrations de base de données pour le système d'authentification et de gestion des utilisateurs d'AfricaHub.

## 📋 Liste des Migrations

### 1. `20240101000001_create_user_profiles_table.sql`
**Création de la table des profils utilisateurs**
- Table `user_profiles` avec rôles et statuts
- Énumérations `user_role` et `user_status`
- Index et triggers pour `updated_at`
- Commentaires détaillés

### 2. `20240101000002_create_merchant_profiles_table.sql`
**Création de la table des profils marchands**
- Table `merchant_profiles` pour les informations business
- Énumération `verification_status`
- Gestion automatique des dates de vérification
- Liens avec les secteurs d'activité

### 3. `20240101000003_create_user_permissions_table.sql`
**Système de permissions granulaires**
- Table `user_permissions` pour les permissions spécifiques
- Table `available_permissions` (référentiel)
- Fonctions pour accorder/révoquer des permissions
- Vue `user_active_permissions`

### 4. `20240101000004_create_auth_triggers.sql`
**Triggers d'authentification automatiques**
- Création automatique de profils lors de l'inscription
- Attribution automatique des permissions par rôle
- Mise à jour de `last_login`
- Fonction RPC de fallback

### 5. `20240101000005_create_rls_policies.sql`
**Politiques de sécurité RLS (Row Level Security)**
- Politiques granulaires pour toutes les tables
- Fonctions helper pour vérifier rôles et permissions
- Sécurisation des accès par rôle

### 6. `20240101000006_create_business_sectors.sql`
**Secteurs d'activité et types d'entreprises**
- Table `business_sectors` (8 secteurs principaux)
- Table `business_types` (types par secteur)
- Vue `sectors_with_types`
- Données de référence pré-remplies

### 7. `20240101000007_complete_business_types.sql`
**Complétion des types d'entreprises**
- Ajout de tous les types d'entreprises manquants
- Fonctions pour récupérer les secteurs et types
- Organisation par secteur d'activité

### 8. `20240101000008_create_admin_user.sql`
**Création d'utilisateurs administrateurs et de test**
- Fonction pour créer un admin
- Fonction pour créer des utilisateurs de test
- Fonction de nettoyage des données de test

### 9. `20240101000009_create_utility_functions.sql`
**Fonctions utilitaires avancées**
- Profil complet utilisateur
- Statistiques système
- Recherche d'utilisateurs avec filtres
- Gestion des statuts et promotions

### 10. `20240101000010_enable_realtime.sql`
**Activation du temps réel**
- Configuration Realtime pour toutes les tables
- Vues pour les mises à jour en temps réel
- Notifications et activités utilisateurs
- Statistiques en temps réel

## 🚀 Exécution des Migrations

### Méthode 1: Via Supabase CLI
```bash
# Se connecter au projet
supabase login

# Lier le projet local
supabase link --project-ref gpjkwjdtgbxkvcpzfodb

# Appliquer toutes les migrations
supabase db push
```

### Méthode 2: Via l'interface Supabase
1. Aller dans l'onglet "SQL Editor" de votre projet Supabase
2. Exécuter chaque fichier dans l'ordre numérique
3. Vérifier que chaque migration s'exécute sans erreur

### Méthode 3: Via psql (console locale)
```bash
# Se connecter à la base de données
psql "postgresql://postgres:[PASSWORD]@db.gpjkwjdtgbxkvcpzfodb.supabase.co:5432/postgres"

# Exécuter chaque fichier
\i 20240101000001_create_user_profiles_table.sql
\i 20240101000002_create_merchant_profiles_table.sql
# ... etc
```

## 🔧 Configuration Post-Migration

### 1. Créer un utilisateur administrateur
```sql
-- Remplacer par vos vraies informations
SELECT create_admin_user(
    'admin@africahub.com',
    'motdepasse_securise',
    'Admin',
    'AfricaHub'
);
```

### 2. Créer des utilisateurs de test (optionnel)
```sql
SELECT create_test_users();
```

### 3. Vérifier les permissions RLS
```sql
-- Tester les politiques de sécurité
SELECT * FROM user_profiles; -- Doit être vide si non connecté
```

## 📊 Structure des Données

### Rôles Utilisateurs
- **user**: Utilisateur simple (comparaison, avis, favoris)
- **merchant**: Marchand (gestion produits, analytics)
- **manager**: Gestionnaire (modération, vérification)
- **admin**: Administrateur (accès complet)

### Statuts Utilisateurs
- **active**: Compte actif
- **inactive**: Compte inactif
- **suspended**: Compte suspendu
- **pending**: En attente de validation

### Secteurs d'Activité
1. **Transport** (6 types)
2. **Banque & Finance** (6 types)
3. **Santé** (7 types)
4. **Énergie** (6 types)
5. **Télécommunications** (6 types)
6. **Immobilier** (6 types)
7. **Éducation** (6 types)
8. **Commerce** (8 types)

## 🛡️ Sécurité

- **RLS activé** sur toutes les tables sensibles
- **Permissions granulaires** par rôle et action
- **Triggers automatiques** pour la cohérence des données
- **Validation des données** via contraintes et fonctions
- **Audit trail** via les timestamps et notifications

## 🔍 Fonctions Utiles

```sql
-- Obtenir le profil complet d'un utilisateur
SELECT * FROM get_user_profile('user-uuid');

-- Statistiques système
SELECT * FROM get_user_statistics();

-- Rechercher des utilisateurs
SELECT * FROM search_users('jean', 'user', 'active', 'Côte d''Ivoire');

-- Utilisateurs en ligne
SELECT * FROM get_online_users(30);

-- Statistiques temps réel
SELECT * FROM get_realtime_stats();
```

## 🧹 Nettoyage

Pour supprimer les données de test :
```sql
SELECT cleanup_test_data();
```

## 📝 Notes Importantes

1. **Ordre d'exécution**: Respecter l'ordre numérique des fichiers
2. **Permissions**: S'assurer d'avoir les droits administrateur
3. **Sauvegarde**: Faire une sauvegarde avant d'exécuter en production
4. **Tests**: Tester chaque migration sur un environnement de développement
5. **Monitoring**: Surveiller les performances après application

## 🆘 Dépannage

### Erreur de permissions
```sql
-- Vérifier les permissions RLS
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### Erreur de trigger
```sql
-- Vérifier les triggers
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

### Erreur de fonction
```sql
-- Lister les fonctions
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public';
```
