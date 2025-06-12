import React from "react"

const PublicAPI: React.FC = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brandSky/10 via-white to-marineBlue-50/20">
        <div className="max-w-2xl w-full p-8 bg-white rounded-xl shadow-lg mt-16">
            <h1 className="text-3xl font-bold mb-4 text-marineBlue-700">
                API Publique AfricaHub
            </h1>
            <p className="text-gray-700 mb-6">
                Accédez à notre documentation API pour intégrer les données et
                fonctionnalités d'AfricaHub dans vos propres applications et
                services.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Documentation interactive</li>
                <li>Exemples d'intégration</li>
                <li>Clés API gratuites (usage limité)</li>
                <li>Support développeur</li>
            </ul>
        </div>
    </div>
)

export default PublicAPI
