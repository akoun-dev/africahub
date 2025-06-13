// Configuration Supabase pour AfricaHub
import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

// Récupérer les variables d'environnement avec des valeurs par défaut
const SUPABASE_URL =
    import.meta.env.VITE_SUPABASE_URL ||
    "https://gpjkwjdtgbxkvcpzfodb.supabase.co"
const SUPABASE_PUBLISHABLE_KEY =
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwamt3amR0Z2J4a3ZjcHpmb2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyODgxOTUsImV4cCI6MjA2NDg2NDE5NX0.pQrp1QRfNjTFiPo7RSTwfeAWsVdp1x0_oh5Rxr9GZzY"

// Vérifier que les variables d'environnement sont définies
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    console.error("❌ Variables d'environnement Supabase manquantes!")
    console.error("Créez un fichier .env.local avec:")
    console.error("VITE_SUPABASE_URL=https://votre-projet.supabase.co")
    console.error("VITE_SUPABASE_ANON_KEY=votre_cle_publique")
}

// Vérifier que l'URL est valide
try {
    new URL(SUPABASE_URL)
} catch (error) {
    console.error("❌ URL Supabase invalide:", SUPABASE_URL)
    console.error("Vérifiez votre configuration dans .env.local")
}

console.log("🔧 Configuration Supabase:", {
    url: SUPABASE_URL,
    hasKey: !!SUPABASE_PUBLISHABLE_KEY,
    keyPreview: SUPABASE_PUBLISHABLE_KEY
        ? SUPABASE_PUBLISHABLE_KEY.substring(0, 20) + "..."
        : "MANQUANTE",
})

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            flowType: "pkce",
        },
        global: {
            headers: {
                "X-Client-Info": "africahub-web",
                "Content-Type": "application/json",
            },
            fetch: (url, options = {}) => {
                console.log("🌐 Requête Supabase:", url, options)

                // Ajouter des options pour contourner les problèmes CORS/réseau
                const enhancedOptions = {
                    ...options,
                    mode: "cors" as RequestMode,
                    credentials: "omit" as RequestCredentials,
                    headers: {
                        ...options.headers,
                        "Cache-Control": "no-cache",
                        Pragma: "no-cache",
                        // S'assurer que l'API key est toujours présente
                        apikey: SUPABASE_PUBLISHABLE_KEY,
                        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
                    },
                }

                return fetch(url, enhancedOptions)
                    .then(response => {
                        console.log(
                            "✅ Réponse Supabase:",
                            response.status,
                            response.statusText
                        )
                        return response
                    })
                    .catch(error => {
                        console.error("❌ Erreur fetch Supabase:", error)
                        throw error
                    })
            },
        },
        db: {
            schema: "public",
        },
        realtime: {
            params: {
                eventsPerSecond: 10,
            },
        },
    }
)
