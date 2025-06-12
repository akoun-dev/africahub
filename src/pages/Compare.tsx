import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { DynamicComparisonTable } from "@/components/comparison/DynamicComparisonTable"
import {
    useProductsWithCriteria,
    ProductWithCriteria,
} from "@/hooks/useProductsWithCriteria"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

const Compare = () => {
    const [searchParams] = useSearchParams()
    const productIds = searchParams.get("products")?.split(",") || []
    const selectedCountry = searchParams.get("country") || ""
    const productType = searchParams.get("type") || ""

    const { data: allProducts, isLoading } =
        useProductsWithCriteria(productType)
    const [selectedProducts, setSelectedProducts] = useState<
        ProductWithCriteria[]
    >([])

    useEffect(() => {
        if (allProducts && productIds.length > 0) {
            const filtered = allProducts.filter(product =>
                productIds.includes(product.id)
            )
            setSelectedProducts(filtered)
        }
    }, [allProducts, productIds])

    if (isLoading) {
        return (
            <div className="py-16">
                <div className="container mx-auto px-4 text-center">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-600">
                        Chargement de la comparaison...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Comparaison de produits
                        </h1>
                        <p className="text-gray-600">
                            Comparez {selectedProducts.length} produit
                            {selectedProducts.length !== 1 ? "s" : ""}
                            {selectedCountry &&
                                ` disponibles en ${selectedCountry}`}
                        </p>
                    </div>

                    {selectedProducts.length === 0 ? (
                        <Card>
                            <CardContent className="py-16 text-center">
                                <h3 className="text-xl font-semibold mb-2">
                                    Aucun produit à comparer
                                </h3>
                                <p className="text-gray-600">
                                    Retournez à la page principale pour
                                    sélectionner des produits à comparer
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <DynamicComparisonTable
                            products={selectedProducts}
                            selectedCountry={selectedCountry}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Compare
