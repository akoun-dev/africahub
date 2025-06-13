// Test de la fonction create_profile_after_signup depuis l'application
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://gpjkwjdtgbxkvcpzfodb.supabase.co"
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwamt3amR0Z2J4a3ZjcHpmb2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NTI5NzQsImV4cCI6MjA0OTUyODk3NH0.Hs_Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8"

const supabase = createClient(supabaseUrl, supabaseKey)

async function testProfileCreation() {
    console.log("🧪 Test de la fonction create_profile_after_signup...")

    try {
        const { data, error } = await supabase.rpc(
            "create_profile_after_signup",
            {
                p_user_id: "0dc50637-7c5b-407f-ae5b-59a21c8851ec",
                p_email: "test@example.com",
                p_first_name: "Test",
                p_last_name: "User",
                p_role: "user",
                p_business_info: null,
            }
        )

        if (error) {
            console.error("❌ Erreur:", error)
        } else {
            console.log("✅ Succès:", data)
        }
    } catch (err) {
        console.error("💥 Exception:", err)
    }
}

testProfileCreation()
