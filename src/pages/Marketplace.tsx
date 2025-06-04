import React from "react"

const Marketplace: React.FC = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-marineBlue-50 via-white to-brandSky/5">
        <div className="max-w-2xl w-full p-8 bg-white rounded-xl shadow-lg mt-16">
            <h1 className="text-3xl font-bold mb-4 text-marineBlue-700">
                Marketplace AfricaHub
            </h1>
            <p className="text-gray-700 mb-6">
                Achetez directement les meilleurs produits et services auprès de
                nos partenaires certifiés. Paiement sécurisé et livraison rapide
                partout en Afrique.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Catalogue multi-secteurs</li>
                <li>Offres exclusives partenaires</li>
                <li>Paiement sécurisé</li>
                <li>Support client dédié</li>
            </ul>
        </div>
    </div>
)

export default Marketplace
