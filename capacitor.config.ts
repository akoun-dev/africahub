import { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
    appId: "com.africahub.app",
    appName: "AfricaHub",
    webDir: "dist",
    // Configuration du serveur pour le développement
    // Commentez la section server pour la production
    server: {
        // URL pour le développement local - changez l'IP selon votre réseau
        url: "http://192.168.1.5:8081",
        cleartext: true,
        // Permet le live reload pendant le développement
        androidScheme: "http",
    },
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
            // Permissions pour l'accès aux fichiers
            iosScheme: "capacitor",
            androidScheme: "https",
        },
    },
    // Configuration Android spécifique
    android: {
        allowMixedContent: true,
        // Permissions nécessaires pour AfricaHub
        webContentsDebuggingEnabled: true,
    },
    // Configuration iOS spécifique (pour le futur)
    ios: {
        scheme: "AfricaHub",
        contentInset: "automatic",
    },
}

export default config
