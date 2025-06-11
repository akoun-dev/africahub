import React from "react"

const Alerts: React.FC = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brandSky/10 via-white to-marineBlue-50/20">
        <div className="max-w-2xl w-full p-8 bg-white rounded-xl shadow-lg mt-16">
            <h1 className="text-3xl font-bold mb-4 text-marineBlue-700">
                Alertes Prix
            </h1>
            <p className="text-gray-700 mb-6">
                Créez et gérez vos alertes pour être notifié dès qu'un produit
                ou service correspond à vos critères de prix ou de
                disponibilité.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Alertes personnalisées par secteur</li>
                <li>Notifications email & in-app</li>
                <li>Historique de vos alertes</li>
            </ul>
        </div>
    </div>
)

export default Alerts
