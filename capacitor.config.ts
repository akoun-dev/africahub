import { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
    appId: "com.africahub.assurcompare",
    appName: "AssurCompare",
    webDir: "dist",
    server: {
        url: "https://63fba823-bbd4-46d8-b179-cb06c7842b6c.lovableproject.com?forceHideBadge=true",
        cleartext: true,
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 3000,
            launchAutoHide: true,
            backgroundColor: "#009639",
            androidSplashResourceName: "splash",
            androidScaleType: "CENTER_CROP",
            showSpinner: true,
            androidSpinnerStyle: "large",
            iosSpinnerStyle: "small",
            spinnerColor: "#ffffff",
        },
        StatusBar: {
            style: "DARK",
        },
        PushNotifications: {
            presentationOptions: ["badge", "sound", "alert"],
        },
    },
}

export default config
