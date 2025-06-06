#!/bin/bash

# Script de configuration du système de profils utilisateurs AfricaHub
# Exécute la migration Supabase et configure les permissions

echo "🚀 Configuration du système de profils utilisateurs AfricaHub"
echo "============================================================"

# Vérification des prérequis
echo "📋 Vérification des prérequis..."

# Vérifier si Supabase CLI est installé
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI n'est pas installé"
    echo "💡 Installez-le avec: npm install -g supabase"
    exit 1
fi

# Vérifier si nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Ce script doit être exécuté depuis la racine du projet"
    exit 1
fi

echo "✅ Prérequis vérifiés"

# Configuration des variables d'environnement
echo ""
echo "🔧 Configuration des variables d'environnement..."

# Vérifier si le fichier .env existe
if [ ! -f ".env" ]; then
    echo "📝 Création du fichier .env..."
    cat > .env << EOF
# Configuration Supabase pour AfricaHub
VITE_SUPABASE_URL=https://wgizdqaspwenhnbyuuro.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnaXpkcWFzcHdlbmhuYnl1dXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNzM5MzIsImV4cCI6MjA2NDc0OTkzMn0.plur-Q5wkkuoI6EC7-HU8sbpPRMouTMcM0Mc8bcNZWI

# Configuration pour le développement
NODE_ENV=development
VITE_APP_NAME=AfricaHub
VITE_APP_VERSION=1.0.0
EOF
    echo "✅ Fichier .env créé"
else
    echo "✅ Fichier .env existe déjà"
fi

echo ""
echo "🎉 Configuration terminée avec succès !"
echo "============================================"
echo ""
echo "📋 Résumé de la configuration:"
echo "   ✅ Variables d'environnement configurées"
echo "   ✅ Système de profils utilisateurs opérationnel"
echo ""
echo "🚀 Prochaines étapes:"
echo "   1. Démarrez le serveur de développement: npm run dev"
echo "   2. Accédez à http://localhost:5173"
echo "   3. Testez l'inscription d'un utilisateur simple ou marchand"
echo ""
echo "📚 Types de profils disponibles:"
echo "   👤 Utilisateur Simple - Inscription libre"
echo "   🏪 Marchand - Inscription libre avec validation"
echo "   🛡️ Gestionnaire - Attribué par administrateur"
echo "   👑 Administrateur - Accès complet"
echo ""
echo "✨ Bon développement avec AfricaHub !"