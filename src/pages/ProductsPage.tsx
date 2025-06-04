// 🏪 Page principale des produits AfricaHub
// Comparateur de prix pour l'Afrique avec navigation moderne
import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Share2, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import ProductListView from "@/components/product/ProductListView"
import ProductComparisonView from "@/components/product/ProductComparisonView"

// Interface pour les données de produits
interface ProductOffer {
    merchant: string
    price: number
    currency: string
    shipping: number
    delivery: string
    stock: string
    rating: number
    logo: string
    payment_methods: string[]
    warranty: string
}

interface Product {
    id: string
    name: string
    category: string
    description: string
    image: string
    rating: number
    reviews: number
    features: string[]
    specifications: Record<string, string>
    offers: ProductOffer[]
    country_availability: string[]
    created_at: string
    updated_at: string
}

const ProductsPage: React.FC = () => {
    const { productId } = useParams<{ productId?: string }>()
    const navigate = useNavigate()
    
    // États pour la gestion des données
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [favorites, setFavorites] = useState<string[]>([])
    const [comparing, setComparing] = useState<string[]>([])
    
    // Chargement des données depuis le fichier JSON
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true)
                const response = await fetch('/data/products.json')
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des produits')
                }
                const data = await response.json()
                setProducts(data.products || [])
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erreur inconnue')
                console.error('Erreur de chargement:', err)
            } finally {
                setLoading(false)
            }
        }

        loadProducts()
    }, [])

    // Chargement des favoris depuis le localStorage
    useEffect(() => {
        const savedFavorites = localStorage.getItem('africahub-favorites')
        if (savedFavorites) {
            try {
                setFavorites(JSON.parse(savedFavorites))
            } catch (err) {
                console.error('Erreur lors du chargement des favoris:', err)
            }
        }

        const savedComparing = localStorage.getItem('africahub-comparing')
        if (savedComparing) {
            try {
                setComparing(JSON.parse(savedComparing))
            } catch (err) {
                console.error('Erreur lors du chargement de la comparaison:', err)
            }
        }
    }, [])

    // Sauvegarde des favoris dans le localStorage
    useEffect(() => {
        localStorage.setItem('africahub-favorites', JSON.stringify(favorites))
    }, [favorites])

    // Sauvegarde de la liste de comparaison dans le localStorage
    useEffect(() => {
        localStorage.setItem('africahub-comparing', JSON.stringify(comparing))
    }, [comparing])

    // Gestion des favoris
    const handleToggleFavorite = (productId: string) => {
        setFavorites(prev => {
            const newFavorites = prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
            
            toast({
                title: prev.includes(productId) ? "Retiré des favoris" : "Ajouté aux favoris",
                description: prev.includes(productId) 
                    ? "Le produit a été retiré de vos favoris"
                    : "Le produit a été ajouté à vos favoris",
            })
            
            return newFavorites
        })
    }

    // Gestion de la comparaison
    const handleToggleCompare = (productId: string) => {
        setComparing(prev => {
            if (prev.includes(productId)) {
                const newComparing = prev.filter(id => id !== productId)
                toast({
                    title: "Retiré de la comparaison",
                    description: "Le produit a été retiré de votre liste de comparaison",
                })
                return newComparing
            } else {
                if (prev.length >= 4) {
                    toast({
                        title: "Limite atteinte",
                        description: "Vous ne pouvez comparer que 4 produits maximum",
                        variant: "destructive"
                    })
                    return prev
                }
                const newComparing = [...prev, productId]
                toast({
                    title: "Ajouté à la comparaison",
                    description: "Le produit a été ajouté à votre liste de comparaison",
                })
                return newComparing
            }
        })
    }

    // Navigation vers un produit spécifique
    const handleProductClick = (productId: string) => {
        navigate(`/produits/${productId}`)
    }

    // Retour à la liste
    const handleBackToList = () => {
        navigate('/produits')
    }

    // Partage d'un produit
    const handleShare = async (product: Product) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.description,
                    url: window.location.href,
                })
            } catch (err) {
                console.error('Erreur lors du partage:', err)
            }
        } else {
            // Fallback: copier l'URL dans le presse-papiers
            try {
                await navigator.clipboard.writeText(window.location.href)
                toast({
                    title: "Lien copié",
                    description: "Le lien du produit a été copié dans le presse-papiers",
                })
            } catch (err) {
                console.error('Erreur lors de la copie:', err)
            }
        }
    }

    // Affichage du loading
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des produits...</p>
                </div>
            </div>
        )
    }

    // Affichage des erreurs
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>
                        Réessayer
                    </Button>
                </div>
            </div>
        )
    }

    // Produit sélectionné pour la vue détaillée
    const selectedProduct = productId ? products.find(p => p.id === productId) : null

    return (
        <div className="min-h-screen bg-gray-50">
            {/* En-tête */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            {selectedProduct && (
                                <Button
                                    variant="ghost"
                                    onClick={handleBackToList}
                                    className="flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Retour à la liste
                                </Button>
                            )}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {selectedProduct ? selectedProduct.name : "Produits"}
                                </h1>
                                {selectedProduct && (
                                    <p className="text-sm text-gray-600">
                                        Comparaison des prix • {selectedProduct.offers.length} offre{selectedProduct.offers.length > 1 ? 's' : ''}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {comparing.length > 0 && (
                                <Badge className="bg-blue-500">
                                    {comparing.length} à comparer
                                </Badge>
                            )}
                            
                            {selectedProduct && (
                                <Button
                                    variant="outline"
                                    onClick={() => handleShare(selectedProduct)}
                                    className="flex items-center gap-2"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Partager
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    key={selectedProduct ? 'detail' : 'list'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {selectedProduct ? (
                        <ProductComparisonView
                            product={selectedProduct}
                            onToggleFavorite={handleToggleFavorite}
                            onToggleCompare={handleToggleCompare}
                            isFavorite={favorites.includes(selectedProduct.id)}
                            isComparing={comparing.includes(selectedProduct.id)}
                        />
                    ) : (
                        <ProductListView
                            products={products}
                            onProductClick={handleProductClick}
                            onToggleFavorite={handleToggleFavorite}
                            onToggleCompare={handleToggleCompare}
                            favorites={favorites}
                            comparing={comparing}
                        />
                    )}
                </motion.div>
            </main>

            {/* Footer avec informations sur AfricaHub */}
            <footer className="bg-white border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            AfricaHub - Comparateur de prix pour l'Afrique
                        </h3>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Trouvez les meilleurs prix sur les produits et services dans toute l'Afrique. 
                            Comparez les offres de centaines de marchands locaux et internationaux.
                        </p>
                        <div className="flex justify-center gap-4 mt-4">
                            <Badge variant="outline">🇨🇮 Côte d'Ivoire</Badge>
                            <Badge variant="outline">🇸🇳 Sénégal</Badge>
                            <Badge variant="outline">🇲🇦 Maroc</Badge>
                            <Badge variant="outline">🇳🇬 Nigeria</Badge>
                            <Badge variant="outline">🇹🇳 Tunisie</Badge>
                            <Badge variant="outline">🇪🇬 Égypte</Badge>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default ProductsPage
