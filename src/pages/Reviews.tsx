import React from "react"

const Reviews: React.FC = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brandSky/10 via-white to-marineBlue-50/20">
        <div className="max-w-2xl w-full p-8 bg-white rounded-xl shadow-lg mt-16">
            <h1 className="text-3xl font-bold mb-4 text-marineBlue-700">
                Avis Clients
            </h1>
            <p className="text-gray-700 mb-6">
                Découvrez les avis et retours d'expérience des utilisateurs sur
                les différents produits et services référencés sur AfricaHub.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Notes et commentaires vérifiés</li>
                <li>Classement par secteur et popularité</li>
                <li>Partage d'expérience communautaire</li>
            </ul>
        </div>
    </div>
)

export default Reviews
