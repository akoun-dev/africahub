#!/usr/bin/env node

/**
 * Script de vérification de la configuration mobile AfricaHub
 * Vérifie que tous les prérequis sont installés et configurés
 */

import { execSync } from "child_process"
import { existsSync } from "fs"

console.log("🔍 Vérification de la configuration mobile AfricaHub...\n")

const checks = [
    {
        name: "Node.js",
        check: () => {
            try {
                const version = execSync("node --version", {
                    encoding: "utf8",
                }).trim()
                return { success: true, message: `✅ Node.js ${version}` }
            } catch {
                return { success: false, message: "❌ Node.js non installé" }
            }
        },
    },
    {
        name: "NPM",
        check: () => {
            try {
                const version = execSync("npm --version", {
                    encoding: "utf8",
                }).trim()
                return { success: true, message: `✅ NPM ${version}` }
            } catch {
                return { success: false, message: "❌ NPM non installé" }
            }
        },
    },
    {
        name: "Capacitor CLI",
        check: () => {
            try {
                const version = execSync("npx cap --version", {
                    encoding: "utf8",
                }).trim()
                return { success: true, message: `✅ Capacitor ${version}` }
            } catch {
                return {
                    success: false,
                    message: "❌ Capacitor CLI non installé",
                }
            }
        },
    },
    {
        name: "Android SDK",
        check: () => {
            const androidHome =
                process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT
            if (!androidHome) {
                return { success: false, message: "❌ ANDROID_HOME non défini" }
            }
            if (!existsSync(androidHome)) {
                return { success: false, message: "❌ Android SDK non trouvé" }
            }
            return { success: true, message: `✅ Android SDK: ${androidHome}` }
        },
    },
    {
        name: "Java",
        check: () => {
            try {
                const version = execSync("java --version", {
                    encoding: "utf8",
                }).split("\n")[0]
                return { success: true, message: `✅ ${version}` }
            } catch {
                try {
                    execSync("java -version", {
                        encoding: "utf8",
                        stdio: "pipe",
                    })
                    return { success: true, message: "✅ Java installé" }
                } catch {
                    return { success: false, message: "❌ Java non installé" }
                }
            }
        },
    },
    {
        name: "Dossier dist",
        check: () => {
            if (existsSync("dist")) {
                return { success: true, message: "✅ Dossier dist présent" }
            }
            return {
                success: false,
                message: "❌ Dossier dist manquant (lancez npm run build)",
            }
        },
    },
    {
        name: "Dossier android",
        check: () => {
            if (existsSync("android")) {
                return { success: true, message: "✅ Projet Android présent" }
            }
            return {
                success: false,
                message:
                    "❌ Projet Android manquant (lancez npx cap add android)",
            }
        },
    },
    {
        name: "Configuration Capacitor",
        check: () => {
            if (existsSync("capacitor.config.ts")) {
                return {
                    success: true,
                    message: "✅ capacitor.config.ts présent",
                }
            }
            return {
                success: false,
                message: "❌ capacitor.config.ts manquant",
            }
        },
    },
]

let allPassed = true

checks.forEach(({ name, check }) => {
    const result = check()
    console.log(`${name.padEnd(20)} ${result.message}`)
    if (!result.success) {
        allPassed = false
    }
})

console.log("\n" + "=".repeat(50))

if (allPassed) {
    console.log("🎉 Toutes les vérifications sont passées !")
    console.log("\n📱 Commandes disponibles :")
    console.log("  npm run mobile:dev     - Build et test Android")
    console.log("  npm run mobile:live    - Développement avec live reload")
    console.log("  npm run mobile:open    - Ouvrir Android Studio")
    console.log("  npm run mobile:sync    - Synchroniser les changements")
} else {
    console.log("⚠️  Certaines vérifications ont échoué.")
    console.log("📖 Consultez MOBILE.md pour les instructions d'installation.")
    process.exit(1)
}
