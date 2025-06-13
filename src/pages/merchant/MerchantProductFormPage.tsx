/**
 * Page de création et édition de produits pour les marchands
 * Formulaire complet avec validation et gestion d'images
 */

import React, { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    ArrowLeft,
    Save,
    Upload,
    X,
    Plus,
    Package,
    DollarSign,
    Tag,
    Image as ImageIcon,
    AlertCircle,
} from "lucide-react"
import { AuthGuard } from "@/components/auth/AuthGuard"
import useMerchantProducts, {
    CreateProductData,
    UpdateProductData,
} from "@/hooks/useMerchantProducts"
import useMerchantProfile from "@/hooks/useMerchantProfile"
import { toast } from "sonner"

// Schéma de validation
const productSchema = z.object({
    name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
    description: z
        .string()
        .min(10, "La description doit contenir au moins 10 caractères"),
    category: z.string().min(1, "Veuillez sélectionner une catégorie"),
    subcategory: z.string().optional(),
    brand: z.string().optional(),
    price: z.number().min(0, "Le prix doit être positif"),
    original_price: z.number().optional(),
    currency: z.string().default("XOF"),
    stock_quantity: z.number().min(0, "Le stock doit être positif"),
    min_order_quantity: z
        .number()
        .min(1, "La quantité minimale doit être d'au moins 1")
        .default(1),
    status: z.enum(["active", "inactive", "draft"]).default("draft"),
    is_featured: z.boolean().default(false),
    is_promoted: z.boolean().default(false),
    tags: z.string().optional(),
    keywords: z.string().optional(),
})

type ProductFormData = z.infer<typeof productSchema>

// Catégories de base (seront complétées par les recommandations du secteur)
const BASE_CATEGORIES = [
    "Électronique",
    "Mode et Vêtements",
    "Maison et Jardin",
    "Sports et Loisirs",
    "Beauté et Santé",
    "Automobile",
    "Livres et Médias",
    "Alimentation",
    "Bijoux et Accessoires",
    "Jouets et Enfants",
    "Services",
    "Autres",
]

const CURRENCIES = [
    { value: "XOF", label: "XOF (Franc CFA)" },
    { value: "EUR", label: "EUR (Euro)" },
    { value: "USD", label: "USD (Dollar)" },
]

export const MerchantProductFormPage: React.FC = () => {
    const navigate = useNavigate()
    const { productId } = useParams()
    const isEditing = !!productId

    const { products, createProduct, updateProduct, isCreating, isUpdating } =
        useMerchantProducts()
    const {
        merchantProfile,
        businessInfo,
        recommendedCategories,
        isLoading: profileLoading,
    } = useMerchantProfile()
    const [images, setImages] = useState<string[]>([])
    const [mainImageIndex, setMainImageIndex] = useState(0)

    // Récupérer le produit à éditer
    const existingProduct = isEditing
        ? products?.find(p => p.id === productId)
        : null

    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            category: "",
            subcategory: "",
            brand: "",
            price: 0,
            original_price: undefined,
            currency: "XOF",
            stock_quantity: 0,
            min_order_quantity: 1,
            status: "draft",
            is_featured: false,
            is_promoted: false,
            tags: "",
            keywords: "",
        },
    })

    // Charger les données du produit existant
    useEffect(() => {
        if (existingProduct) {
            form.reset({
                name: existingProduct.name,
                description: existingProduct.description,
                category: existingProduct.category,
                subcategory: existingProduct.subcategory || "",
                brand: existingProduct.brand || "",
                price: existingProduct.price,
                original_price: existingProduct.original_price,
                currency: existingProduct.currency,
                stock_quantity: existingProduct.stock_quantity,
                min_order_quantity: existingProduct.min_order_quantity || 1,
                status: existingProduct.status as
                    | "active"
                    | "inactive"
                    | "draft",
                is_featured: existingProduct.is_featured,
                is_promoted: existingProduct.is_promoted,
                tags: existingProduct.tags?.join(", ") || "",
                keywords: existingProduct.keywords?.join(", ") || "",
            })
            setImages(existingProduct.images || [])
            if (existingProduct.main_image && existingProduct.images) {
                const mainIndex = existingProduct.images.indexOf(
                    existingProduct.main_image
                )
                setMainImageIndex(mainIndex >= 0 ? mainIndex : 0)
            }
        }
    }, [existingProduct, form])

    const onSubmit = async (data: ProductFormData) => {
        try {
            const productData = {
                ...data,
                images,
                main_image: images[mainImageIndex] || undefined,
                tags: data.tags
                    ? data.tags
                          .split(",")
                          .map(t => t.trim())
                          .filter(Boolean)
                    : undefined,
                keywords: data.keywords
                    ? data.keywords
                          .split(",")
                          .map(k => k.trim())
                          .filter(Boolean)
                    : undefined,
            }

            if (isEditing && productId) {
                await updateProduct({
                    id: productId,
                    ...productData,
                } as UpdateProductData)
                toast.success("Produit mis à jour avec succès !")
            } else {
                await createProduct(productData as CreateProductData)
                toast.success("Produit créé avec succès !")
            }

            navigate("/merchant/products")
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error)
            toast.error("Erreur lors de la sauvegarde du produit")
        }
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (!files) return

        // Simulation d'upload - à remplacer par un vrai service d'upload
        Array.from(files).forEach(file => {
            const reader = new FileReader()
            reader.onload = e => {
                if (e.target?.result) {
                    setImages(prev => [...prev, e.target!.result as string])
                }
            }
            reader.readAsDataURL(file)
        })
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
        if (mainImageIndex >= index && mainImageIndex > 0) {
            setMainImageIndex(prev => prev - 1)
        }
    }

    const setAsMainImage = (index: number) => {
        setMainImageIndex(index)
    }

    // Obtenir les catégories disponibles (recommandées + de base)
    const getAvailableCategories = () => {
        const recommended = recommendedCategories || []
        const combined = [...new Set([...recommended, ...BASE_CATEGORIES])]
        return combined.sort()
    }

    const isLoading = isCreating || isUpdating || profileLoading

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* En-tête */}
                    <div className="flex items-center space-x-4">
                        <Link to="/merchant/products">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <div>
                            <h1
                                className="text-3xl font-bold"
                                style={{ color: "#2D4A6B" }}
                            >
                                {isEditing
                                    ? "Modifier le produit"
                                    : "Nouveau produit"}
                            </h1>
                            <p className="text-slate-600">
                                {isEditing
                                    ? "Modifiez les informations de votre produit"
                                    : "Créez un nouveau produit pour votre catalogue"}
                            </p>
                        </div>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            {/* Informations du marchand */}
                            {businessInfo && (
                                <Card className="border-blue-200 bg-blue-50">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                                <Package className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-blue-900">
                                                    {businessInfo.name ||
                                                        "Votre entreprise"}
                                                </h3>
                                                <p className="text-sm text-blue-700">
                                                    {businessInfo.type} -{" "}
                                                    {businessInfo.sector}
                                                </p>
                                                {recommendedCategories &&
                                                    recommendedCategories.length >
                                                        0 && (
                                                        <p className="text-xs text-blue-600 mt-1">
                                                            Catégories
                                                            recommandées :{" "}
                                                            {recommendedCategories
                                                                .slice(0, 3)
                                                                .join(", ")}
                                                            {recommendedCategories.length >
                                                                3 && "..."}
                                                        </p>
                                                    )}
                                            </div>
                                        </div>
                                        {!businessInfo.isComplete && (
                                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <div className="flex items-center space-x-2">
                                                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                                                    <p className="text-sm text-yellow-800">
                                                        Complétez votre profil
                                                        business pour des
                                                        recommandations
                                                        personnalisées.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Informations de base */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Package
                                            className="w-5 h-5 mr-2"
                                            style={{ color: "#2D4A6B" }}
                                        />
                                        Informations de base
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Nom du produit *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Ex: iPhone 15 Pro Max"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="brand"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Marque
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Ex: Apple"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Description *
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Décrivez votre produit en détail..."
                                                        className="min-h-[120px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Une description détaillée
                                                    aide les clients à mieux
                                                    comprendre votre produit
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="category"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Catégorie *
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        value={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Sélectionnez une catégorie" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {/* Catégories recommandées selon le secteur */}
                                                            {recommendedCategories &&
                                                                recommendedCategories.length >
                                                                    0 && (
                                                                    <>
                                                                        <div className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50">
                                                                            Recommandées
                                                                            pour
                                                                            votre
                                                                            secteur
                                                                            (
                                                                            {
                                                                                businessInfo?.sector
                                                                            }
                                                                            )
                                                                        </div>
                                                                        {recommendedCategories.map(
                                                                            category => (
                                                                                <SelectItem
                                                                                    key={`rec-${category}`}
                                                                                    value={
                                                                                        category
                                                                                    }
                                                                                    className="font-medium text-blue-700"
                                                                                >
                                                                                    ⭐{" "}
                                                                                    {
                                                                                        category
                                                                                    }
                                                                                </SelectItem>
                                                                            )
                                                                        )}
                                                                        <div className="border-t my-1"></div>
                                                                        <div className="px-2 py-1 text-xs font-medium text-gray-600">
                                                                            Autres
                                                                            catégories
                                                                        </div>
                                                                    </>
                                                                )}
                                                            {getAvailableCategories()
                                                                .filter(
                                                                    category =>
                                                                        !recommendedCategories?.includes(
                                                                            category
                                                                        )
                                                                )
                                                                .map(
                                                                    category => (
                                                                        <SelectItem
                                                                            key={
                                                                                category
                                                                            }
                                                                            value={
                                                                                category
                                                                            }
                                                                        >
                                                                            {
                                                                                category
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="subcategory"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Sous-catégorie
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Ex: Smartphones"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Prix et stock */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <DollarSign
                                            className="w-5 h-5 mr-2"
                                            style={{ color: "#2D4A6B" }}
                                        />
                                        Prix et stock
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Prix de vente *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="0"
                                                            {...field}
                                                            onChange={e =>
                                                                field.onChange(
                                                                    parseFloat(
                                                                        e.target
                                                                            .value
                                                                    ) || 0
                                                                )
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="original_price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Prix original
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="0"
                                                            {...field}
                                                            onChange={e =>
                                                                field.onChange(
                                                                    parseFloat(
                                                                        e.target
                                                                            .value
                                                                    ) ||
                                                                        undefined
                                                                )
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Pour afficher une
                                                        réduction
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="currency"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Devise
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        value={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {CURRENCIES.map(
                                                                currency => (
                                                                    <SelectItem
                                                                        key={
                                                                            currency.value
                                                                        }
                                                                        value={
                                                                            currency.value
                                                                        }
                                                                    >
                                                                        {
                                                                            currency.label
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="stock_quantity"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Quantité en stock *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="0"
                                                            {...field}
                                                            onChange={e =>
                                                                field.onChange(
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    ) || 0
                                                                )
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="min_order_quantity"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Quantité minimale de
                                                        commande
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="1"
                                                            {...field}
                                                            onChange={e =>
                                                                field.onChange(
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    ) || 1
                                                                )
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Images */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <ImageIcon
                                            className="w-5 h-5 mr-2"
                                            style={{ color: "#2D4A6B" }}
                                        />
                                        Images du produit
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="cursor-pointer"
                                        >
                                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 mb-2">
                                                Cliquez pour ajouter des images
                                                ou glissez-déposez
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                PNG, JPG, JPEG jusqu'à 10MB
                                            </p>
                                        </label>
                                    </div>

                                    {images.length > 0 && (
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            {images.map((image, index) => (
                                                <div
                                                    key={index}
                                                    className="relative group"
                                                >
                                                    <img
                                                        src={image}
                                                        alt={`Produit ${
                                                            index + 1
                                                        }`}
                                                        className="w-full h-32 object-cover rounded-lg border"
                                                    />
                                                    {index ===
                                                        mainImageIndex && (
                                                        <Badge className="absolute top-2 left-2 bg-green-500">
                                                            Principal
                                                        </Badge>
                                                    )}
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() =>
                                                                removeImage(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                    {index !==
                                                        mainImageIndex && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={() =>
                                                                setAsMainImage(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            Définir comme
                                                            principal
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <div className="flex justify-end space-x-4">
                                <Link to="/merchant/products">
                                    <Button
                                        variant="outline"
                                        disabled={isLoading}
                                    >
                                        Annuler
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    style={{ backgroundColor: "#2D4A6B" }}
                                    className="text-white"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {isLoading
                                        ? "Sauvegarde..."
                                        : isEditing
                                        ? "Mettre à jour"
                                        : "Créer le produit"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </AuthGuard>
    )
}

export default MerchantProductFormPage
