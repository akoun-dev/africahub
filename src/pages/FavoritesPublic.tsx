import React from "react"

const FavoritesPublic: React.FC = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-marineBlue-50 via-white to-brandSky/5">
        <div className="max-w-2xl w-full p-8 bg-white rounded-xl shadow-lg mt-16">
            <h1 className="text-3xl font-bold mb-4 text-marineBlue-700">
                Mes Favoris
            </h1>
            <p className="text-gray-700 mb-6">
                Consultez une sélection des produits et services les plus
                ajoutés en favoris par la communauté AfricaHub.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Classement des favoris par secteur</li>
                <li>Produits les plus populaires</li>
                <li>Accès rapide à la comparaison</li>
            </ul>
        </div>
    </div>
)

export default FavoritesPublic
