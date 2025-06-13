import { CapacitorConfig } from "@capacitor/cli"

/**
 * Configuration Capacitor pour la production
 * Utilisez cette configuration pour les builds de production
 * Commande: npx cap sync --config capacitor.config.prod.ts
 */
const config: CapacitorConfig = {
    appId: "com.africahub.app",
    appName: "AfricaHub",
    webDir: "dist",
    // Pas de serveur pour la production - utilise les fichiers locaux
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            launchAutoHide: true,
            // Couleur verte d'AfricaHub (emerald-600)
            backgroundColor: "#059669",
            androidSplashResourceName: "splash",
            androidScaleType: "CENTER_CROP",
            showSpinner: true,
            androidSpinnerStyle: "large",
            iosSpinnerStyle: "small",
            spinnerColor: "#ffffff",
        },
        StatusBar: {
            // Style adapté au thème d'AfricaHub
            style: "LIGHT",
            backgroundColor: "#059669",
        },
        PushNotifications: {
            presentationOptions: ["badge", "sound", "alert"],
        },
        // Configuration pour le plugin Filesystem
        Filesystem: {
            iosScheme: "capacitor",
            androidScheme: "https",
        },
    },
    // Configuration Android pour la production
    android: {
        allowMixedContent: false,
        webContentsDebuggingEnabled: false,
    },
    // Configuration iOS pour la production
    ios: {
        scheme: "AfricaHub",
        contentInset: "automatic",
    },
}

export default config
