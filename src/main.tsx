import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./index.css"

// Import des tests de profil pour le développement
if (import.meta.env.DEV) {
    import("./utils/testUserProfile")
}

const container = document.getElementById("root")
if (!container) {
    throw new Error("Root element not found")
}

const root = createRoot(container)
root.render(<App />)
