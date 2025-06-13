/**
 * Page de création et édition de produits pour les marchands - Version moderne
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
    Star,
    CheckCircle,
} from "lucide-react"

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

    if (profileLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-emerald-600 animate-pulse" />
                        </div>
                        <p className="text-gray-600 text-lg">
                            Chargement du formulaire...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
            <div className="p-6 space-y-6">
                {/* En-tête avec design moderne */}
                <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 rounded-xl p-8 text-white shadow-xl relative overflow-hidden">
                    {/* Motifs décoratifs */}
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full"></div>
                    <div className="absolute -left-5 -bottom-5 w-24 h-24 bg-emerald-400/20 rounded-full"></div>

                    <div className="relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center space-x-4">
                                <Link to="/merchant/products">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-white/30 text-white hover:bg-white/10"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Retour
                                    </Button>
                                </Link>
                                <div>
                                    <h1 className="text-4xl font-bold text-white mb-2">
                                        {isEditing
                                            ? "Modifier le produit"
                                            : "Nouveau produit"}
                                    </h1>
                                    <p className="text-emerald-100 text-lg">
                                        {isEditing
                                            ? "Modifiez les informations de votre produit"
                                            : "Créez un nouveau produit pour votre catalogue"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Informations du marchand avec design moderne */}
                        {businessInfo && (
                            <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-50 to-blue-50 border-l-4 border-l-emerald-500">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                                            <Package className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-emerald-900 text-lg">
                                                {businessInfo.name ||
                                                    "Votre entreprise"}
                                            </h3>
                                            <p className="text-emerald-700 mb-2">
                                                {businessInfo.type} -{" "}
                                                {businessInfo.sector}
                                            </p>
                                            {recommendedCategories &&
                                                recommendedCategories.length >
                                                    0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="text-sm text-emerald-600 font-medium">
                                                            Catégories
                                                            recommandées:
                                                        </span>
                                                        {recommendedCategories
                                                            .slice(0, 3)
                                                            .map(category => (
                                                                <Badge
                                                                    key={
                                                                        category
                                                                    }
                                                                    className="bg-emerald-100 text-emerald-800"
                                                                >
                                                                    <Star className="w-3 h-3 mr-1" />
                                                                    {category}
                                                                </Badge>
                                                            ))}
                                                        {recommendedCategories.length >
                                                            3 && (
                                                            <Badge className="bg-emerald-100 text-emerald-800">
                                                                +
                                                                {recommendedCategories.length -
                                                                    3}{" "}
                                                                autres
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                    {!businessInfo.isComplete && (
                                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <AlertCircle className="w-5 h-5 text-yellow-600" />
                                                <p className="text-yellow-800 font-medium">
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

                        {/* Informations de base avec design moderne */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center text-emerald-800">
                                    <Package className="w-5 h-5 mr-2" />
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
                                                <FormLabel className="text-gray-700 font-medium">
                                                    Nom du produit *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Ex: iPhone 15 Pro Max"
                                                        className="border-emerald-200 focus:border-emerald-500"
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
                                                <FormLabel className="text-gray-700 font-medium">
                                                    Marque
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Ex: Apple"
                                                        className="border-emerald-200 focus:border-emerald-500"
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
                                            <FormLabel className="text-gray-700 font-medium">
                                                Description *
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Décrivez votre produit en détail..."
                                                    className="min-h-[120px] border-emerald-200 focus:border-emerald-500"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-emerald-600">
                                                Une description détaillée aide
                                                les clients à mieux comprendre
                                                votre produit
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
                                                <FormLabel className="text-gray-700 font-medium">
                                                    Catégorie *
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                                                            <SelectValue placeholder="Sélectionnez une catégorie" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {/* Catégories recommandées selon le secteur */}
                                                        {recommendedCategories &&
                                                            recommendedCategories.length >
                                                                0 && (
                                                                <>
                                                                    <div className="px-3 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50">
                                                                        ⭐
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
                                                                                className="font-medium text-emerald-700 bg-emerald-50"
                                                                            >
                                                                                <Star className="w-4 h-4 mr-2 inline" />
                                                                                {
                                                                                    category
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                    <div className="border-t my-1"></div>
                                                                    <div className="px-3 py-2 text-sm font-medium text-gray-600">
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
                                                            .map(category => (
                                                                <SelectItem
                                                                    key={
                                                                        category
                                                                    }
                                                                    value={
                                                                        category
                                                                    }
                                                                >
                                                                    {category}
                                                                </SelectItem>
                                                            ))}
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
                                                <FormLabel className="text-gray-700 font-medium">
                                                    Sous-catégorie
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Ex: Smartphones"
                                                        className="border-emerald-200 focus:border-emerald-500"
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

                        {/* Prix et stock avec design moderne */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center text-emerald-800">
                                    <DollarSign className="w-5 h-5 mr-2" />
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
                                                <FormLabel className="text-gray-700 font-medium">
                                                    Prix de vente *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        className="border-emerald-200 focus:border-emerald-500"
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
                                                <FormLabel className="text-gray-700 font-medium">
                                                    Prix original (optionnel)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        className="border-emerald-200 focus:border-emerald-500"
                                                        {...field}
                                                        onChange={e =>
                                                            field.onChange(
                                                                parseFloat(
                                                                    e.target
                                                                        .value
                                                                ) || undefined
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-emerald-600">
                                                    Pour afficher une réduction
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
                                                <FormLabel className="text-gray-700 font-medium">
                                                    Devise
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
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
                                                <FormLabel className="text-gray-700 font-medium">
                                                    Quantité en stock *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        className="border-emerald-200 focus:border-emerald-500"
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
                                                <FormLabel className="text-gray-700 font-medium">
                                                    Quantité minimale de
                                                    commande
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="1"
                                                        className="border-emerald-200 focus:border-emerald-500"
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

                        {/* Images avec design moderne */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center text-emerald-800">
                                    <ImageIcon className="w-5 h-5 mr-2" />
                                    Images du produit
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-gray-600">
                                            Ajoutez des images pour présenter
                                            votre produit
                                        </p>
                                        <label className="cursor-pointer">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                            >
                                                <Upload className="w-4 h-4 mr-2" />
                                                Ajouter des images
                                            </Button>
                                        </label>
                                    </div>

                                    {images.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {images.map((image, index) => (
                                                <div
                                                    key={index}
                                                    className={`relative group rounded-lg overflow-hidden border-2 ${
                                                        index === mainImageIndex
                                                            ? "border-emerald-500 ring-2 ring-emerald-200"
                                                            : "border-gray-200"
                                                    }`}
                                                >
                                                    <img
                                                        src={image}
                                                        alt={`Produit ${
                                                            index + 1
                                                        }`}
                                                        className="w-full h-32 object-cover"
                                                    />
                                                    {index ===
                                                        mainImageIndex && (
                                                        <div className="absolute top-2 left-2">
                                                            <Badge className="bg-emerald-600 text-white">
                                                                <Star className="w-3 h-3 mr-1" />
                                                                Principal
                                                            </Badge>
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                                        {index !==
                                                            mainImageIndex && (
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                onClick={() =>
                                                                    setAsMainImage(
                                                                        index
                                                                    )
                                                                }
                                                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                            >
                                                                <Star className="w-3 h-3" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                removeImage(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {images.length === 0 && (
                                        <div className="border-2 border-dashed border-emerald-300 rounded-lg p-8 text-center">
                                            <ImageIcon className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                                            <p className="text-gray-600 mb-4">
                                                Aucune image ajoutée
                                            </p>
                                            <label className="cursor-pointer">
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                                <Button
                                                    type="button"
                                                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
                                                >
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Choisir des images
                                                </Button>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Options avancées avec design moderne */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center text-emerald-800">
                                    <Tag className="w-5 h-5 mr-2" />
                                    Options avancées
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium">
                                                Statut du produit
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="draft">
                                                        <div className="flex items-center">
                                                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                                                            Brouillon
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="active">
                                                        <div className="flex items-center">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                            Actif
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="inactive">
                                                        <div className="flex items-center">
                                                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                                            Inactif
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription className="text-emerald-600">
                                                Les produits actifs sont
                                                visibles par les clients
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="is_featured"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-emerald-200 p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-gray-700 font-medium">
                                                        Produit vedette
                                                    </FormLabel>
                                                    <FormDescription className="text-emerald-600">
                                                        Mettre en avant ce
                                                        produit
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="is_promoted"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-emerald-200 p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-gray-700 font-medium">
                                                        En promotion
                                                    </FormLabel>
                                                    <FormDescription className="text-emerald-600">
                                                        Produit en promotion
                                                        spéciale
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="tags"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">
                                                    Tags (séparés par des
                                                    virgules)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Ex: nouveau, tendance, populaire"
                                                        className="border-emerald-200 focus:border-emerald-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-emerald-600">
                                                    Aidez les clients à trouver
                                                    votre produit
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="keywords"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">
                                                    Mots-clés (séparés par des
                                                    virgules)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Ex: smartphone, apple, téléphone"
                                                        className="border-emerald-200 focus:border-emerald-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-emerald-600">
                                                    Améliorez le référencement
                                                    de votre produit
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Boutons d'action avec design moderne */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        {isEditing
                                            ? "Mise à jour..."
                                            : "Création..."}
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        {isEditing
                                            ? "Mettre à jour"
                                            : "Créer le produit"}
                                    </>
                                )}
                            </Button>
                            <Link to="/merchant/products">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isLoading}
                                    className="w-full sm:w-auto border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                >
                                    Annuler
                                </Button>
                            </Link>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default MerchantProductFormPage
