import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
    getProductsWithFallback,
    getProductForComparison,
} from "@/data/demoProducts"
import ProductComparisonView from "@/components/product/ProductComparisonView"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { RelatedProducts } from "@/components/product/RelatedProducts"
import { Home } from "lucide-react"

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [product, setProduct] = useState<any>(null)
    const [isFavorite, setIsFavorite] = useState(false)
    const [isComparing, setIsComparing] = useState(false)

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setIsLoading(true)
                setError(null)

                // Simuler un appel API avec les données de démonstration
                const products = getProductsWithFallback([])
                const foundProduct = products.find((p: any) => p.id === id)

                if (!foundProduct) {
                    setError("Produit non trouvé")
                    return
                }

                setProduct(foundProduct)
            } catch (err) {
                console.error("Erreur lors du chargement du produit:", err)
                setError("Erreur lors du chargement du produit")
            } finally {
                setIsLoading(false)
            }
        }

        if (id) {
            loadProduct()
        }
    }, [id])

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-6 bg-gray-200 rounded w-1/4" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="aspect-square bg-gray-200 rounded-lg" />
                        <div className="space-y-4">
                            <div className="h-8 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                            <div className="h-6 bg-gray-200 rounded w-1/3" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Produit non trouvé
                </h1>
                <p className="text-gray-600 mb-6">
                    Le produit que vous recherchez n'existe pas ou n'est plus
                    disponible.
                </p>
                <Button asChild>
                    <Link to="/produits">Retour aux produits</Link>
                </Button>
            </div>
        )
    }

    // Obtenir les données enrichies pour la vue de comparaison
    const comparisonProduct = getProductForComparison(id || "")

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb personnalisé */}
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/" className="flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                Accueil
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/produits">Produits</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link
                                to={`/search?category=${product.product_types?.slug}`}
                            >
                                {product.product_types?.name || "Produit"}
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{product.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Vue de comparaison moderne */}
            {comparisonProduct ? (
                <ProductComparisonView
                    product={comparisonProduct}
                    onToggleFavorite={() => setIsFavorite(!isFavorite)}
                    onToggleCompare={() => setIsComparing(!isComparing)}
                    isFavorite={isFavorite}
                    isComparing={isComparing}
                />
            ) : (
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Produit non disponible
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Les données de ce produit ne sont pas disponibles pour
                        la vue de comparaison.
                    </p>
                    <Button asChild>
                        <Link to="/produits">Retour aux produits</Link>
                    </Button>
                </div>
            )}

            {/* Produits similaires */}
            <div className="mt-12">
                <RelatedProducts
                    currentProductId={product.id}
                    productTypeId={product.product_type_id}
                />
            </div>
        </div>
    )
}

export default ProductDetail
