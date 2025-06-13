import React from "react"
import { supabase } from "@/lib/supabase"

export function TestProfileCreation() {
    const testDirectInsert = async () => {
        console.log("🧪 Test d'insertion directe...")

        try {
            // Test d'insertion directe dans user_profiles
            const testUserId = crypto.randomUUID()
            const { data, error } = await supabase
                .from("user_profiles")
                .insert({
                    user_id: testUserId,
                    email: "test-direct@example.com",
                    first_name: "Test",
                    last_name: "Direct",
                    role: "user",
                    status: "active",
                })
                .select()
                .single()

            console.log("📊 Résultat insertion directe:", { data, error })

            if (error) {
                alert("❌ Erreur insertion directe: " + error.message)
            } else {
                alert("✅ Succès insertion directe: " + JSON.stringify(data))
            }
        } catch (err) {
            console.error("💥 Exception:", err)
            alert("💥 Exception: " + err)
        }
    }

    const testTableAccess = async () => {
        console.log("🧪 Test d'accès aux tables...")

        try {
            // Test de lecture de user_profiles
            const { data, error } = await supabase
                .from("user_profiles")
                .select("*")
                .limit(1)

            console.log("📊 Résultat lecture:", { data, error })

            if (error) {
                alert("❌ Erreur lecture: " + error.message)
            } else {
                alert("✅ Succès lecture: " + data.length + " profils trouvés")
            }
        } catch (err) {
            console.error("💥 Exception:", err)
            alert("💥 Exception: " + err)
        }
    }

    const createProfileForCurrentUser = async () => {
        console.log("🧪 Création profil pour utilisateur connecté...")

        try {
            // Récupérer l'utilisateur connecté
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (!user) {
                alert("❌ Aucun utilisateur connecté")
                return
            }

            console.log("👤 Utilisateur connecté:", user.id, user.email)

            // Créer le profil
            const { data, error } = await supabase
                .from("user_profiles")
                .insert({
                    user_id: user.id,
                    email: user.email,
                    first_name: "Utilisateur",
                    last_name: "Test",
                    role: "user",
                    status: "active",
                })
                .select()
                .single()

            console.log("📊 Résultat création profil:", { data, error })

            if (error) {
                alert("❌ Erreur création profil: " + error.message)
            } else {
                alert("✅ Profil créé avec succès! Rechargez la page.")
            }
        } catch (err) {
            console.error("💥 Exception:", err)
            alert("💥 Exception: " + err)
        }
    }

    return (
        <div className="p-4 border rounded mb-4">
            <h3 className="text-lg font-bold mb-2">Tests de diagnostic</h3>
            <div className="space-y-2">
                <button
                    onClick={testTableAccess}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                >
                    Test lecture user_profiles
                </button>
                <button
                    onClick={testDirectInsert}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                >
                    Test insertion directe
                </button>
                <button
                    onClick={createProfileForCurrentUser}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Créer profil pour utilisateur connecté
                </button>
            </div>
        </div>
    )
}
