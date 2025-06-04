
# Architecture Microservices - Plateforme de Comparaison

## 📋 Vue d'ensemble

Cette plateforme utilise une architecture microservices moderne avec des APIs REST pures, optimisée pour la scalabilité et la maintenance.

## 🏗️ Services Disponibles

### Services Core Métier
1. **Product Catalog Service** (Port 3006)
   - Gestion des produits et critères
   - CRUD complet avec validation
   - Recherche et filtrage avancés
   - Duplication multi-pays

2. **Comparison Engine Service** (Port 3007)
   - Moteur de comparaison intelligent
   - Algorithmes de scoring
   - Recommandations personnalisées
   - Matrices de comparaison

3. **User Management Service** (Port 3008)
   - Gestion des profils utilisateurs
   - Préférences personnalisées
   - Suivi des interactions
   - Authentification JWT

### Services Support
4. **AI Recommendations Service** (Port 3001)
   - Recommandations IA
   - Analyse comportementale
   - Machine Learning

5. **Analytics Service** (Port 3003)
   - Métriques en temps réel
   - Rapports avancés
   - Tracking événements

6. **Notifications Service** (Port 3002)
   - Notifications multi-canal
   - Templates personnalisables
   - Préférences utilisateur

7. **CMS Service** (Port 3005)
   - Gestion de contenu
   - Localisation multi-pays
   - Workflow de publication

### Infrastructure
8. **API Gateway** (Kong - Port 8000)
   - Point d'entrée unique
   - Rate limiting
   - CORS et sécurité
   - Load balancing

## 🚀 Déploiement

### Démarrage rapide
```bash
# Démarrer tous les services
docker-compose -f infrastructure/docker-compose.microservices.yml up -d

# Vérifier le statut
docker-compose ps

# Logs d'un service spécifique
docker-compose logs -f product-catalog-service
```

### URLs d'accès
- **API Gateway**: http://localhost:8000
- **Kong Admin**: http://localhost:8001
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000
- **Jaeger**: http://localhost:16686
- **RabbitMQ**: http://localhost:15672

## 📡 APIs REST

### Product Catalog Service
```bash
# Récupérer tous les produits
GET /api/v1/products

# Créer un produit
POST /api/v1/products
{
  "name": "Assurance Auto Premium",
  "product_type_id": "uuid",
  "company_id": "uuid",
  "price": 50000,
  "currency": "XOF"
}

# Dupliquer vers d'autres pays
POST /api/v1/products/{id}/duplicate
{
  "target_countries": ["SN", "CI"],
  "price_multiplier": 1.2
}
```

### Comparison Engine
```bash
# Comparer des produits
POST /api/v1/compare/products
{
  "product_ids": ["uuid1", "uuid2"],
  "criteria_weights": {"price": 0.4, "coverage": 0.6}
}

# Recommandations
POST /api/v1/compare/recommendations
{
  "sector_slug": "auto",
  "country_code": "SN",
  "user_preferences": {"budget": "medium"}
}
```

## 🔧 Configuration

### Variables d'environnement
```env
# Database
DB_HOST=postgres
DB_NAME=microservices_db
DB_USER=postgres
DB_PASSWORD=password

# Redis
REDIS_URL=redis://redis:6379

# RabbitMQ
RABBITMQ_URL=amqp://rabbitmq:5672

# JWT
JWT_SECRET=your-secret-key

# API Gateway
KONG_ADMIN_URL=http://kong:8001
```

### Monitoring et Observabilité
- **Prometheus**: Métriques système et applicatives
- **Grafana**: Dashboards visuels
- **Jaeger**: Tracing distribué
- **Logs centralisés**: Winston + ELK Stack

## 🛡️ Sécurité

### Authentification
- JWT tokens pour l'auth utilisateur
- API keys pour l'accès service-to-service
- Rate limiting par service
- CORS configuré par environnement

### Validation
- Joi schemas pour tous les endpoints
- Sanitization des entrées
- Validation des permissions

## 📊 Performance

### Optimisations
- Cache Redis pour les données fréquentes
- Connection pooling PostgreSQL
- Compression gzip
- CDN ready pour les assets

### Scalabilité
- Services indépendants
- Load balancing Kong
- Auto-scaling Docker
- Database sharding ready

## 🔄 CI/CD

### Pipeline recommandé
1. **Tests unitaires** par service
2. **Tests d'intégration** inter-services
3. **Build Docker** automatique
4. **Déploiement rolling** sans downtime
5. **Health checks** post-déploiement

### Commandes utiles
```bash
# Tests
npm test

# Build
npm run build

# Health check
curl http://localhost:8000/health

# Metrics
curl http://localhost:8000/metrics
```

## 📈 Monitoring

### KPIs principaux
- **Latence**: < 200ms p95
- **Disponibilité**: > 99.9%
- **Erreurs**: < 0.1%
- **Throughput**: 1000+ req/s

### Alertes configurées
- Service down
- Latence élevée
- Taux d'erreur
- Utilisation ressources

Cette architecture microservices vous donne une base solide pour une croissance rapide sur le marché africain !
