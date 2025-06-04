
# Domaine Sectors - Architecture en couches

## 📁 Structure technique

```
src/domains/sectors/
├── repositories/
│   └── sector.repository.ts    # Accès direct Supabase (typé)
├── services/
│   └── sector.service.ts       # Logique métier pure
├── hooks/
│   ├── useSectors.ts          # Liste des secteurs
│   ├── useSector.ts           # Secteur unique
│   └── useSectorMutations.ts  # CRUD operations
└── README.md                  # Cette documentation
```

## 🎯 Cas métier supportés

### Lecture
- ✅ Récupération de tous les secteurs actifs
- ✅ Récupération d'un secteur par slug
- ✅ Cache intelligent avec React Query
- ✅ Gestion des états de chargement et erreurs

### Écriture (Admin uniquement)
- ✅ Création de nouveaux secteurs
- ✅ Modification des secteurs existants
- ✅ Suppression soft (désactivation)
- ✅ Validation avec Zod

## 🔐 Sécurité

### Validation des données
- Schémas Zod stricts pour toutes les entrées
- Validation côté service avant accès repository
- Sanitisation des slugs et noms

### Contrôle d'accès
- Lecture : accessible à tous
- Écriture : réservée aux administrateurs
- RLS Supabase activé (à configurer)

## ⚡ Performance

### Cache Strategy
- **staleTime**: 5 minutes (données considérées fraîches)
- **cacheTime**: 10 minutes (données gardées en mémoire)
- **retry**: 2 tentatives en cas d'échec

### Optimisations
- Requêtes SELECT précises (pas de `select *`)
- Invalidation ciblée du cache lors des mutations
- Lazy loading des hooks non critiques

## 🧪 Tests

```bash
# Tests unitaires des services
npm run test src/services/sector.service.test.ts

# Tests des hooks
npm run test src/hooks/sector/
```

## 🔄 Flux de données

```
UI Component
    ↓
React Hook (useSector)
    ↓
Service Layer (validation, business logic)
    ↓
Repository Layer (Supabase queries)
    ↓
Supabase Database
```

## 📋 Edge Functions utilisées

- `validate-sector` : Validation côté serveur
- `sector-analytics` : Métriques et analytics

## 🚀 Utilisation

```typescript
// Lecture de tous les secteurs
const { data: sectors, isLoading } = useSectors();

// Lecture d'un secteur unique
const { data: sector, isFromCache, refreshData } = useSector(slug);

// Mutations (admin)
const { createSector, updateSector, deleteSector } = useSectorMutations();
```
