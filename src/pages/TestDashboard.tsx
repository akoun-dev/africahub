import React from "react"

/**
 * Page de test ultra-simple pour vérifier le routage
 * Sans aucune vérification d'authentification
 */
const TestDashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* En-tête */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h1 className="text-3xl font-bold text-blue-800 mb-2">
                        🎉 Succès ! Dashboard Utilisateur
                    </h1>
                    <p className="text-gray-600">
                        Félicitations ! Vous êtes maintenant connecté et sur votre dashboard.
                    </p>
                </div>

                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                ❤️
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800">Favoris</h3>
                                <p className="text-2xl font-bold text-blue-600">12</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                ⭐
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800">Avis</h3>
                                <p className="text-2xl font-bold text-green-600">8</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                📊
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800">Comparaisons</h3>
                                <p className="text-2xl font-bold text-purple-600">5</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                                🔔
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                                <p className="text-2xl font-bold text-orange-600">3</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions rapides */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Actions rapides</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                            🛍️ Parcourir les produits
                        </button>
                        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                            📝 Écrire un avis
                        </button>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                            ⚙️ Paramètres
                        </button>
                    </div>
                </div>

                {/* Informations de débogage */}
                <div className="bg-gray-100 rounded-lg p-6 mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">🔧 Informations de débogage</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p>✅ Routage fonctionnel</p>
                        <p>✅ Page chargée sans vérifications d'auth</p>
                        <p>✅ URL: /user/dashboard</p>
                        <p>✅ Composant: TestDashboard</p>
                        <p>⏰ Chargé le: {new Date().toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TestDashboard
