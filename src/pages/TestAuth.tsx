import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import Auth from "./Auth"
import { useAuth } from "@/contexts/AuthContext"

/**
 * Page de test pour le formulaire d'authentification corrigé
 * Utilise le bon contexte EnhancedAuthProvider
 */
const TestAuth: React.FC = () => {
    return (
        <Router>
            <div className="min-h-screen">
                <Routes>
                    <Route path="/" element={<Auth />} />
                    <Route path="/auth" element={<Auth />} />

                    {/* Pages de redirection après inscription */}
                    <Route
                        path="/user/dashboard"
                        element={
                            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                                <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg
                                            className="w-8 h-8 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                        🎉 Compte Utilisateur Créé !
                                    </h1>
                                    <p className="text-gray-600 mb-4">
                                        Bienvenue sur AfricaHub ! Votre compte
                                        utilisateur a été créé avec succès.
                                    </p>
                                    <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                                        <p>
                                            <strong>Type :</strong> Utilisateur
                                        </p>
                                        <p>
                                            <strong>Statut :</strong> Actif
                                        </p>
                                        <p>
                                            <strong>Accès :</strong> Comparaison
                                            de produits, avis, favoris
                                        </p>
                                    </div>
                                </div>
                            </div>
                        }
                    />

                    <Route
                        path="/merchant/dashboard"
                        element={
                            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
                                <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
                                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg
                                            className="w-8 h-8 text-amber-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10"
                                            />
                                        </svg>
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                        🏪 Compte Marchand Créé !
                                    </h1>
                                    <p className="text-gray-600 mb-4">
                                        Votre compte marchand a été créé avec
                                        succès. Il est en cours de vérification.
                                    </p>
                                    <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                                        <p>
                                            <strong>Type :</strong> Marchand
                                        </p>
                                        <p>
                                            <strong>Statut :</strong> En attente
                                            de vérification
                                        </p>
                                        <p>
                                            <strong>Prochaine étape :</strong>{" "}
                                            Vérification des documents
                                        </p>
                                    </div>
                                    <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
                                        <p>
                                            <strong>
                                                📧 Email de confirmation envoyé
                                            </strong>
                                        </p>
                                        <p>
                                            Vérifiez votre boîte mail pour
                                            confirmer votre adresse email.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        }
                    />

                    <Route
                        path="/admin/dashboard"
                        element={
                            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100">
                                <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
                                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg
                                            className="w-8 h-8 text-purple-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            />
                                        </svg>
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                        👑 Connexion Admin Réussie !
                                    </h1>
                                    <p className="text-gray-600 mb-4">
                                        Bienvenue dans l'interface
                                        d'administration AfricaHub.
                                    </p>
                                    <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                                        <p>
                                            <strong>Type :</strong>{" "}
                                            Administrateur
                                        </p>
                                        <p>
                                            <strong>Accès :</strong> Gestion
                                            complète de la plateforme
                                        </p>
                                        <p>
                                            <strong>Permissions :</strong>{" "}
                                            Toutes
                                        </p>
                                    </div>
                                </div>
                            </div>
                        }
                    />

                    <Route
                        path="/manager/dashboard"
                        element={
                            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-100">
                                <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
                                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg
                                            className="w-8 h-8 text-teal-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                            />
                                        </svg>
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                        📊 Connexion Manager Réussie !
                                    </h1>
                                    <p className="text-gray-600 mb-4">
                                        Bienvenue dans l'interface de gestion
                                        AfricaHub.
                                    </p>
                                    <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                                        <p>
                                            <strong>Type :</strong> Gestionnaire
                                        </p>
                                        <p>
                                            <strong>Accès :</strong> Modération
                                            et rapports
                                        </p>
                                        <p>
                                            <strong>Permissions :</strong>{" "}
                                            Gestion de contenu
                                        </p>
                                    </div>
                                </div>
                            </div>
                        }
                    />
                </Routes>
            </div>

            {/* Toast notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: "#fff",
                        color: "#2D4A6B",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "14px",
                    },
                }}
            />
        </Router>
    )
}

export default TestAuth
