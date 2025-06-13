# 📱 Guide de Développement Mobile - AfricaHub

Ce guide vous explique comment développer et déployer l'application mobile AfricaHub avec Capacitor.

## 🚀 Scripts Disponibles

### Développement
```bash
# Développement avec live reload
npm run mobile:live

# Build et test sur Android
npm run mobile:dev
npm run android:dev

# Synchroniser les changements
npm run mobile:sync
```

### Production
```bash
# Build pour la production
npm run mobile:build
npm run android:build

# Synchroniser avec la config de production
npm run mobile:sync:prod
```

### Utilitaires
```bash
# Ouvrir Android Studio
npm run mobile:open
npm run android:open

# Synchronisation simple
npm run mobile:sync
```

## 🔧 Configuration

### Développement
- **Fichier**: `capacitor.config.ts`
- **Serveur**: `http://192.168.1.5:8081` (live reload)
- **Debug**: Activé

### Production
- **Fichier**: `capacitor.config.prod.ts`
- **Serveur**: Fichiers locaux (pas de serveur externe)
- **Debug**: Désactivé

## 📋 Prérequis

### Android
1. **Android Studio** installé
2. **SDK Android** configuré
3. **Java 11+** installé
4. **Variables d'environnement** configurées :
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

## 🛠️ Workflow de Développement

### 1. Développement Local
```bash
# Démarrer le serveur de développement
npm run dev

# Dans un autre terminal, synchroniser avec l'app mobile
npm run mobile:sync

# Ouvrir Android Studio pour tester
npm run mobile:open
```

### 2. Live Reload (Recommandé)
```bash
# Démarre le serveur et l'app avec live reload
npm run mobile:live
```

### 3. Build et Test
```bash
# Build complet et test
npm run mobile:dev
```

## 🎨 Personnalisation

### Splash Screen
- **Couleur**: `#059669` (emerald-600)
- **Durée**: 2000ms
- **Spinner**: Blanc

### Status Bar
- **Style**: Light (texte blanc)
- **Couleur de fond**: `#059669`

### App Info
- **ID**: `com.africahub.app`
- **Nom**: `AfricaHub`

## 🔍 Debugging

### Logs Android
```bash
# Voir les logs de l'app
adb logcat | grep -i capacitor

# Logs spécifiques à AfricaHub
adb logcat | grep -i africahub
```

### Chrome DevTools
1. Ouvrir Chrome
2. Aller à `chrome://inspect`
3. Sélectionner votre appareil/émulateur
4. Cliquer sur "Inspect"

## 📦 Plugins Installés

- **@capacitor/filesystem**: Gestion des fichiers
- **@capacitor/android**: Support Android

## 🚨 Résolution de Problèmes

### Erreur de Build
```bash
# Nettoyer et reconstruire
rm -rf dist android/app/src/main/assets/public
npm run build
npm run mobile:sync
```

### Problème de Permissions
```bash
# Vérifier les permissions Android
npx cap doctor android
```

### Live Reload ne fonctionne pas
1. Vérifier que l'IP dans `capacitor.config.ts` correspond à votre réseau
2. S'assurer que le firewall autorise le port 8081
3. Redémarrer l'app mobile

## 📱 Test sur Appareil Physique

1. Activer le **Mode Développeur** sur Android
2. Activer le **Débogage USB**
3. Connecter l'appareil via USB
4. Autoriser le débogage sur l'appareil
5. Lancer `npm run mobile:dev`

## 🔄 Mise à Jour

Après chaque modification du code web :
```bash
npm run build
npm run mobile:sync
```

Ou utilisez le live reload pour un développement plus fluide :
```bash
npm run mobile:live
```
