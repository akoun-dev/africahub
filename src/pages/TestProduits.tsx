// 🧪 Page de test pour vérifier le chargement des produits
import React from "react"
import { useProducts } from "@/hooks/useProducts"
import { getProductsWithFallback } from "@/data/demoProducts"

const TestProduits: React.FC = () => {
    const { data: supabaseProducts, isLoading, error } = useProducts()
    const products = getProductsWithFallback(supabaseProducts || [])

    console.log("🔍 Test Debug:", {
        supabaseProducts: supabaseProducts?.length || 0,
        products: products?.length || 0,
        isLoading,
        error,
        firstProduct: products?.[0]
    })

    if (isLoading) {
        return <div className="p-8">⏳ Chargement...</div>
    }

    if (error) {
        return <div className="p-8 text-red-500">❌ Erreur: {error.message}</div>
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">🧪 Test des Produits</h1>
            
            <div className="mb-4 p-4 bg-gray-100 rounded">
                <h2 className="font-semibold">Statistiques:</h2>
                <p>Produits Supabase: {supabaseProducts?.length || 0}</p>
                <p>Produits Total: {products?.length || 0}</p>
                <p>État de chargement: {isLoading ? "En cours" : "Terminé"}</p>
                <p>Erreur: {error ? error.message : "Aucune"}</p>
            </div>

            <div className="grid gap-4">
                {products?.map((product, index) => (
                    <div key={product.id} className="p-4 border rounded">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-gray-600">{product.description}</p>
                        <p className="text-green-600 font-bold">
                            {product.price?.toLocaleString()} {product.currency}
                        </p>
                        <p className="text-sm text-gray-500">
                            {product.companies?.name} • {product.product_types?.name}
                        </p>
                        <p className="text-xs text-gray-400">
                            Pays: {product.country_availability?.join(", ")}
                        </p>
                    </div>
                )) || <p>Aucun produit trouvé</p>}
            </div>
        </div>
    )
}

export default TestProduits
