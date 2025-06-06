import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext"
import { UserRole } from "@/types/user"
import { useNavigate, Link } from "react-router-dom"
import {
    Lock,
    Mail,
    User,
    Eye,
    EyeOff,
    ArrowLeft,
    Shield,
    Globe,
    Users,
    Building,
    MapPin,
} from "lucide-react"
import { toast } from "sonner"

/**
 * Page d'authentification améliorée pour AfricaHub
 * Inscription limitée aux utilisateurs simples et marchands
 * Intégration de tous les secteurs d'activité
 */
const AuthImproved: React.FC = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    // États spécifiques aux marchands
    const [businessName, setBusinessName] = useState("")
    const [businessSector, setBusinessSector] = useState("")
    const [businessType, setBusinessType] = useState("")
    const [businessDescription, setBusinessDescription] = useState("")
    const [businessAddress, setBusinessAddress] = useState("")
    const [businessPhone, setBusinessPhone] = useState("")
    const [businessEmail, setBusinessEmail] = useState("")

    const { signIn, signUp } = useEnhancedAuth()
    const navigate = useNavigate()

    // Secteurs d'activité disponibles sur AfricaHub
    const businessSectors = [
        {
            name: "Transport",
            types: [
                "Transport Public",
                "Taxi/VTC",
                "Livraison",
                "Location de Véhicules",
                "Transport de Marchandises",
                "Transport Scolaire",
            ],
        },
        {
            name: "Banque & Finance",
            types: [
                "Banque Commerciale",
                "Banque d'Investissement",
                "Microfinance",
                "Assurance",
                "Bureau de Change",
                "Services de Paiement Mobile",
            ],
        },
        {
            name: "Santé",
            types: [
                "Clinique/Hôpital",
                "Pharmacie",
                "Laboratoire d'Analyses",
                "Cabinet Médical",
                "Cabinet Dentaire",
                "Optique",
                "Kinésithérapie",
            ],
        },
        {
            name: "Énergie",
            types: [
                "Fourniture d'Électricité",
                "Énergie Solaire",
                "Fourniture de Gaz",
                "Énergie Éolienne",
                "Installation Électrique",
                "Maintenance Énergétique",
            ],
        },
        {
            name: "Télécommunications",
            types: [
                "Opérateur Mobile",
                "Fournisseur Internet",
                "Réparation Mobile",
                "Vente d'Équipements Télécoms",
                "Services Cloud",
                "Cybersécurité",
            ],
        },
        {
            name: "Immobilier",
            types: [
                "Agence Immobilière",
                "Promotion Immobilière",
                "Construction",
                "Architecture",
                "Gestion Locative",
                "Expertise Immobilière",
            ],
        },
        {
            name: "Éducation",
            types: [
                "École Primaire",
                "École Secondaire",
                "Université/Institut",
                "Centre de Formation",
                "Cours Particuliers",
                "Formation Professionnelle",
            ],
        },
        {
            name: "Commerce",
            types: [
                "Électronique & High-Tech",
                "Mode & Vêtements",
                "Alimentation & Boissons",
                "Pharmacie & Parapharmacie",
                "Librairie & Fournitures",
                "Automobile",
                "Ameublement & Décoration",
                "Cosmétiques & Beauté",
            ],
        },
    ]

    const getBusinessTypes = () => {
        if (!businessSector) return []
        const sector = businessSectors.find(s => s.name === businessSector)
        return sector ? sector.types : []
    }

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            console.log("🔐 Starting sign in for:", email)

            const result = await signIn(email, password)

            if (result.error) {
                console.error("❌ Sign in failed:", result.error)

                if (
                    result.error.message.includes("Invalid login credentials")
                ) {
                    toast.error("Email ou mot de passe incorrect")
                } else if (
                    result.error.message.includes("Email not confirmed")
                ) {
                    toast.error(
                        "Veuillez confirmer votre email avant de vous connecter"
                    )
                } else {
                    toast.error("Erreur de connexion: " + result.error.message)
                }
                return
            }

            console.log("✅ Sign in successful")
            toast.success("Connexion réussie!")

            // Redirection basée sur le rôle
            const userRoles = result.userRoles || []
            if (userRoles.includes("admin")) {
                navigate("/admin/dashboard")
            } else if (userRoles.includes("manager")) {
                navigate("/manager/dashboard")
            } else if (userRoles.includes("merchant")) {
                navigate("/merchant/dashboard")
            } else {
                navigate("/user/dashboard")
            }
        } catch (error) {
            console.error("💥 Unexpected error during sign in:", error)
            toast.error("Une erreur inattendue s'est produite")
        } finally {
            setLoading(false)
        }
    }

    const handleSignUpUser = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas")
            return
        }

        if (password.length < 6) {
            toast.error("Le mot de passe doit contenir au moins 6 caractères")
            return
        }

        setLoading(true)

        try {
            console.log("📝 Starting user sign up for:", email)

            const userData = {
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                role: UserRole.USER,
            }

            const result = await signUp(userData)

            if (result.error) {
                console.error("❌ User sign up failed:", result.error)

                if (result.error.message.includes("User already registered")) {
                    toast.error("Un compte existe déjà avec cet email")
                } else {
                    toast.error(
                        "Erreur lors de la création du compte: " +
                            result.error.message
                    )
                }
                return
            }

            console.log("✅ User sign up successful")
            toast.success(
                "Compte utilisateur créé avec succès! Bienvenue sur AfricaHub."
            )
            navigate("/user/dashboard")
        } catch (error) {
            console.error("💥 Unexpected error during user sign up:", error)
            toast.error("Une erreur inattendue s'est produite")
        } finally {
            setLoading(false)
        }
    }

    const handleSignUpMerchant = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas")
            return
        }

        if (password.length < 6) {
            toast.error("Le mot de passe doit contenir au moins 6 caractères")
            return
        }

        if (!businessName || !businessSector || !businessType) {
            toast.error(
                "Veuillez remplir toutes les informations business obligatoires"
            )
            return
        }

        setLoading(true)

        try {
            console.log("📝 Starting merchant sign up for:", email)

            // Créer le compte avec les informations business
            const userData = {
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                role: UserRole.MERCHANT,
                business_info: {
                    business_name: businessName,
                    business_sector: businessSector,
                    business_type: businessType,
                    business_description: businessDescription,
                    business_address: businessAddress,
                    business_phone: businessPhone,
                    business_email: businessEmail,
                },
            }

            const result = await signUp(userData)

            if (result.error) {
                console.error("❌ Merchant sign up failed:", result.error)

                if (result.error.message.includes("User already registered")) {
                    toast.error("Un compte existe déjà avec cet email")
                } else {
                    toast.error(
                        "Erreur lors de la création du compte: " +
                            result.error.message
                    )
                }
                return
            }

            console.log("✅ Merchant sign up successful")
            toast.success(
                "Compte marchand créé avec succès! Votre demande est en cours de vérification."
            )
            navigate("/merchant/dashboard")
        } catch (error) {
            console.error("💥 Unexpected error during merchant sign up:", error)
            toast.error("Une erreur inattendue s'est produite")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen flex"
            style={{
                background:
                    "linear-gradient(135deg, #2D4A6B 0%, #1E3A5F 50%, #0F2A44 100%)",
            }}
        >
            {/* Section gauche - Informations et branding */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 text-white">
                <div className="max-w-md">
                    <Link
                        to="/"
                        className="inline-flex items-center text-white hover:text-slate-200 mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour à l'accueil
                    </Link>

                    <h1 className="text-4xl font-bold mb-6">
                        Rejoignez AfricaHub
                    </h1>
                    <p className="text-xl text-slate-200 mb-8">
                        La plateforme panafricaine de comparaison de produits et
                        services. Créez votre compte utilisateur ou marchand dès
                        maintenant.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div
                                className="p-2 rounded-lg"
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                }}
                            >
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">
                                    Compte Utilisateur
                                </h3>
                                <p className="text-slate-300 text-sm">
                                    Comparez les produits, laissez des avis,
                                    gérez vos favoris
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div
                                className="p-2 rounded-lg"
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                }}
                            >
                                <Building className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">
                                    Compte Marchand
                                </h3>
                                <p className="text-slate-300 text-sm">
                                    Présentez vos produits/services, gérez votre
                                    boutique
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div
                                className="p-2 rounded-lg"
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                }}
                            >
                                <Globe className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">
                                    Tous Secteurs
                                </h3>
                                <p className="text-slate-300 text-sm">
                                    Transport, Banque, Santé, Énergie, Télécoms,
                                    et plus
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section droite - Formulaires d'authentification */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12">
                <div className="w-full max-w-md">
                    {/* Bouton retour pour mobile */}
                    <div className="lg:hidden mb-6">
                        <Link
                            to="/"
                            className="inline-flex items-center text-white hover:text-slate-200 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour à l'accueil
                        </Link>
                    </div>

                    <Card
                        className="backdrop-blur-sm border-white/20 shadow-2xl"
                        style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
                    >
                        <CardHeader className="text-center pb-4">
                            <CardTitle
                                className="text-2xl font-bold"
                                style={{ color: "#2D4A6B" }}
                            >
                                Authentification
                            </CardTitle>
                            <CardDescription className="text-slate-600">
                                Connectez-vous ou créez votre compte
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <Tabs defaultValue="signin" className="w-full">
                                <TabsList
                                    className="grid w-full grid-cols-3 mb-6"
                                    style={{ backgroundColor: "#2D4A6B10" }}
                                >
                                    <TabsTrigger
                                        value="signin"
                                        className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs"
                                        style={{ color: "#2D4A6B" }}
                                    >
                                        Connexion
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="signup-user"
                                        className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs"
                                        style={{ color: "#2D4A6B" }}
                                    >
                                        Utilisateur
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="signup-merchant"
                                        className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs"
                                        style={{ color: "#2D4A6B" }}
                                    >
                                        Marchand
                                    </TabsTrigger>
                                </TabsList>

                                {/* Formulaire de connexion */}
                                <TabsContent value="signin" className="mt-6">
                                    <form
                                        onSubmit={handleSignIn}
                                        className="space-y-5"
                                    >
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="email"
                                                className="text-sm font-medium"
                                                style={{ color: "#2D4A6B" }}
                                            >
                                                Adresse email
                                            </label>
                                            <div className="relative">
                                                <Mail
                                                    className="absolute left-3 top-3 h-4 w-4"
                                                    style={{ color: "#2D4A6B" }}
                                                />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="votre@email.com"
                                                    value={email}
                                                    onChange={e =>
                                                        setEmail(e.target.value)
                                                    }
                                                    className="pl-10 border-slate-300 focus:border-2 focus:ring-0"
                                                    style={{
                                                        "--tw-ring-color":
                                                            "#2D4A6B",
                                                    }}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="password"
                                                className="text-sm font-medium"
                                                style={{ color: "#2D4A6B" }}
                                            >
                                                Mot de passe
                                            </label>
                                            <div className="relative">
                                                <Lock
                                                    className="absolute left-3 top-3 h-4 w-4"
                                                    style={{ color: "#2D4A6B" }}
                                                />
                                                <Input
                                                    id="password"
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={e =>
                                                        setPassword(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="pl-10 pr-10 border-slate-300 focus:border-2 focus:ring-0"
                                                    style={{
                                                        "--tw-ring-color":
                                                            "#2D4A6B",
                                                    }}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword
                                                        )
                                                    }
                                                    className="absolute right-3 top-3 hover:opacity-70 transition-opacity"
                                                    style={{ color: "#2D4A6B" }}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-slate-300"
                                                    style={{
                                                        accentColor: "#2D4A6B",
                                                    }}
                                                />
                                                <span className="text-slate-600">
                                                    Se souvenir de moi
                                                </span>
                                            </label>
                                            <a
                                                href="#"
                                                className="hover:underline"
                                                style={{ color: "#2D4A6B" }}
                                            >
                                                Mot de passe oublié ?
                                            </a>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-11 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                            style={{
                                                backgroundColor: "#2D4A6B",
                                            }}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Connexion...</span>
                                                </div>
                                            ) : (
                                                "Se connecter"
                                            )}
                                        </Button>
                                    </form>
                                </TabsContent>

                                {/* Formulaire d'inscription utilisateur */}
                                <TabsContent
                                    value="signup-user"
                                    className="mt-6"
                                >
                                    <form
                                        onSubmit={handleSignUpUser}
                                        className="space-y-5"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="userFirstName"
                                                    className="text-sm font-medium"
                                                    style={{ color: "#2D4A6B" }}
                                                >
                                                    Prénom
                                                </label>
                                                <div className="relative">
                                                    <User
                                                        className="absolute left-3 top-3 h-4 w-4"
                                                        style={{
                                                            color: "#2D4A6B",
                                                        }}
                                                    />
                                                    <Input
                                                        id="userFirstName"
                                                        type="text"
                                                        placeholder="John"
                                                        value={firstName}
                                                        onChange={e =>
                                                            setFirstName(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="pl-10 border-slate-300 focus:border-2 focus:ring-0"
                                                        style={{
                                                            "--tw-ring-color":
                                                                "#2D4A6B",
                                                        }}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="userLastName"
                                                    className="text-sm font-medium"
                                                    style={{ color: "#2D4A6B" }}
                                                >
                                                    Nom
                                                </label>
                                                <Input
                                                    id="userLastName"
                                                    type="text"
                                                    placeholder="Doe"
                                                    value={lastName}
                                                    onChange={e =>
                                                        setLastName(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border-slate-300 focus:border-2 focus:ring-0"
                                                    style={{
                                                        "--tw-ring-color":
                                                            "#2D4A6B",
                                                    }}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="userEmail"
                                                className="text-sm font-medium"
                                                style={{ color: "#2D4A6B" }}
                                            >
                                                Adresse email
                                            </label>
                                            <div className="relative">
                                                <Mail
                                                    className="absolute left-3 top-3 h-4 w-4"
                                                    style={{ color: "#2D4A6B" }}
                                                />
                                                <Input
                                                    id="userEmail"
                                                    type="email"
                                                    placeholder="votre@email.com"
                                                    value={email}
                                                    onChange={e =>
                                                        setEmail(e.target.value)
                                                    }
                                                    className="pl-10 border-slate-300 focus:border-2 focus:ring-0"
                                                    style={{
                                                        "--tw-ring-color":
                                                            "#2D4A6B",
                                                    }}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="userPassword"
                                                className="text-sm font-medium"
                                                style={{ color: "#2D4A6B" }}
                                            >
                                                Mot de passe
                                            </label>
                                            <div className="relative">
                                                <Lock
                                                    className="absolute left-3 top-3 h-4 w-4"
                                                    style={{ color: "#2D4A6B" }}
                                                />
                                                <Input
                                                    id="userPassword"
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={e =>
                                                        setPassword(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="pl-10 pr-10 border-slate-300 focus:border-2 focus:ring-0"
                                                    style={{
                                                        "--tw-ring-color":
                                                            "#2D4A6B",
                                                    }}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword
                                                        )
                                                    }
                                                    className="absolute right-3 top-3 hover:opacity-70 transition-opacity"
                                                    style={{ color: "#2D4A6B" }}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="userConfirmPassword"
                                                className="text-sm font-medium"
                                                style={{ color: "#2D4A6B" }}
                                            >
                                                Confirmer le mot de passe
                                            </label>
                                            <div className="relative">
                                                <Lock
                                                    className="absolute left-3 top-3 h-4 w-4"
                                                    style={{ color: "#2D4A6B" }}
                                                />
                                                <Input
                                                    id="userConfirmPassword"
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="••••••••"
                                                    value={confirmPassword}
                                                    onChange={e =>
                                                        setConfirmPassword(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="pl-10 border-slate-300 focus:border-2 focus:ring-0"
                                                    style={{
                                                        "--tw-ring-color":
                                                            "#2D4A6B",
                                                    }}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
                                            En créant un compte utilisateur,
                                            vous acceptez nos{" "}
                                            <a
                                                href="#"
                                                className="underline"
                                                style={{ color: "#2D4A6B" }}
                                            >
                                                Conditions d'utilisation
                                            </a>{" "}
                                            et notre{" "}
                                            <a
                                                href="#"
                                                className="underline"
                                                style={{ color: "#2D4A6B" }}
                                            >
                                                Politique de confidentialité
                                            </a>
                                            .
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-11 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                            style={{
                                                backgroundColor: "#2D4A6B",
                                            }}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Création...</span>
                                                </div>
                                            ) : (
                                                "Créer mon compte utilisateur"
                                            )}
                                        </Button>
                                    </form>
                                </TabsContent>

                                {/* Formulaire d'inscription marchand */}
                                <TabsContent
                                    value="signup-merchant"
                                    className="mt-6"
                                >
                                    <form
                                        onSubmit={handleSignUpMerchant}
                                        className="space-y-4"
                                    >
                                        {/* Informations personnelles */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="merchantFirstName"
                                                    className="text-sm font-medium"
                                                    style={{ color: "#2D4A6B" }}
                                                >
                                                    Prénom
                                                </label>
                                                <div className="relative">
                                                    <User
                                                        className="absolute left-3 top-3 h-4 w-4"
                                                        style={{
                                                            color: "#2D4A6B",
                                                        }}
                                                    />
                                                    <Input
                                                        id="merchantFirstName"
                                                        type="text"
                                                        placeholder="John"
                                                        value={firstName}
                                                        onChange={e =>
                                                            setFirstName(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="pl-10 border-slate-300 focus:border-2 focus:ring-0"
                                                        style={{
                                                            "--tw-ring-color":
                                                                "#2D4A6B",
                                                        }}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="merchantLastName"
                                                    className="text-sm font-medium"
                                                    style={{ color: "#2D4A6B" }}
                                                >
                                                    Nom
                                                </label>
                                                <Input
                                                    id="merchantLastName"
                                                    type="text"
                                                    placeholder="Doe"
                                                    value={lastName}
                                                    onChange={e =>
                                                        setLastName(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border-slate-300 focus:border-2 focus:ring-0"
                                                    style={{
                                                        "--tw-ring-color":
                                                            "#2D4A6B",
                                                    }}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="merchantEmail"
                                                className="text-sm font-medium"
                                                style={{ color: "#2D4A6B" }}
                                            >
                                                Adresse email
                                            </label>
                                            <div className="relative">
                                                <Mail
                                                    className="absolute left-3 top-3 h-4 w-4"
                                                    style={{ color: "#2D4A6B" }}
                                                />
                                                <Input
                                                    id="merchantEmail"
                                                    type="email"
                                                    placeholder="votre@email.com"
                                                    value={email}
                                                    onChange={e =>
                                                        setEmail(e.target.value)
                                                    }
                                                    className="pl-10 border-slate-300 focus:border-2 focus:ring-0"
                                                    style={{
                                                        "--tw-ring-color":
                                                            "#2D4A6B",
                                                    }}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Mots de passe */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="merchantPassword"
                                                    className="text-sm font-medium"
                                                    style={{ color: "#2D4A6B" }}
                                                >
                                                    Mot de passe
                                                </label>
                                                <div className="relative">
                                                    <Lock
                                                        className="absolute left-3 top-3 h-4 w-4"
                                                        style={{
                                                            color: "#2D4A6B",
                                                        }}
                                                    />
                                                    <Input
                                                        id="merchantPassword"
                                                        type={
                                                            showPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        placeholder="••••••••"
                                                        value={password}
                                                        onChange={e =>
                                                            setPassword(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="pl-10 pr-10 border-slate-300 focus:border-2 focus:ring-0"
                                                        style={{
                                                            "--tw-ring-color":
                                                                "#2D4A6B",
                                                        }}
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowPassword(
                                                                !showPassword
                                                            )
                                                        }
                                                        className="absolute right-3 top-3 hover:opacity-70 transition-opacity"
                                                        style={{
                                                            color: "#2D4A6B",
                                                        }}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="merchantConfirmPassword"
                                                    className="text-sm font-medium"
                                                    style={{ color: "#2D4A6B" }}
                                                >
                                                    Confirmer
                                                </label>
                                                <div className="relative">
                                                    <Lock
                                                        className="absolute left-3 top-3 h-4 w-4"
                                                        style={{
                                                            color: "#2D4A6B",
                                                        }}
                                                    />
                                                    <Input
                                                        id="merchantConfirmPassword"
                                                        type={
                                                            showPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        placeholder="••••••••"
                                                        value={confirmPassword}
                                                        onChange={e =>
                                                            setConfirmPassword(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="pl-10 border-slate-300 focus:border-2 focus:ring-0"
                                                        style={{
                                                            "--tw-ring-color":
                                                                "#2D4A6B",
                                                        }}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Informations business */}
                                        <div className="border-t pt-4 mt-4">
                                            <h4
                                                className="font-medium mb-3"
                                                style={{ color: "#2D4A6B" }}
                                            >
                                                Informations Business
                                            </h4>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label
                                                        htmlFor="businessName"
                                                        className="text-sm font-medium"
                                                        style={{
                                                            color: "#2D4A6B",
                                                        }}
                                                    >
                                                        Nom de l'entreprise *
                                                    </label>
                                                    <div className="relative">
                                                        <Building
                                                            className="absolute left-3 top-3 h-4 w-4"
                                                            style={{
                                                                color: "#2D4A6B",
                                                            }}
                                                        />
                                                        <Input
                                                            id="businessName"
                                                            type="text"
                                                            placeholder="Mon Entreprise SARL"
                                                            value={businessName}
                                                            onChange={e =>
                                                                setBusinessName(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="pl-10 border-slate-300 focus:border-2 focus:ring-0"
                                                            style={{
                                                                "--tw-ring-color":
                                                                    "#2D4A6B",
                                                            }}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label
                                                            htmlFor="businessSector"
                                                            className="text-sm font-medium"
                                                            style={{
                                                                color: "#2D4A6B",
                                                            }}
                                                        >
                                                            Secteur d'activité *
                                                        </label>
                                                        <Select
                                                            value={
                                                                businessSector
                                                            }
                                                            onValueChange={value => {
                                                                setBusinessSector(
                                                                    value
                                                                )
                                                                setBusinessType(
                                                                    ""
                                                                ) // Reset business type when sector changes
                                                            }}
                                                        >
                                                            <SelectTrigger
                                                                className="border-slate-300 focus:border-2 focus:ring-0"
                                                                style={{
                                                                    "--tw-ring-color":
                                                                        "#2D4A6B",
                                                                }}
                                                            >
                                                                <SelectValue placeholder="Choisir un secteur" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {businessSectors.map(
                                                                    sector => (
                                                                        <SelectItem
                                                                            key={
                                                                                sector.name
                                                                            }
                                                                            value={
                                                                                sector.name
                                                                            }
                                                                        >
                                                                            {
                                                                                sector.name
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label
                                                            htmlFor="businessType"
                                                            className="text-sm font-medium"
                                                            style={{
                                                                color: "#2D4A6B",
                                                            }}
                                                        >
                                                            Type d'activité *
                                                        </label>
                                                        <Select
                                                            value={businessType}
                                                            onValueChange={
                                                                setBusinessType
                                                            }
                                                            disabled={
                                                                !businessSector
                                                            }
                                                        >
                                                            <SelectTrigger
                                                                className="border-slate-300 focus:border-2 focus:ring-0"
                                                                style={{
                                                                    "--tw-ring-color":
                                                                        "#2D4A6B",
                                                                }}
                                                            >
                                                                <SelectValue placeholder="Choisir le type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {getBusinessTypes().map(
                                                                    type => (
                                                                        <SelectItem
                                                                            key={
                                                                                type
                                                                            }
                                                                            value={
                                                                                type
                                                                            }
                                                                        >
                                                                            {
                                                                                type
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label
                                                        htmlFor="businessDescription"
                                                        className="text-sm font-medium"
                                                        style={{
                                                            color: "#2D4A6B",
                                                        }}
                                                    >
                                                        Description de
                                                        l'activité
                                                    </label>
                                                    <Textarea
                                                        id="businessDescription"
                                                        placeholder="Décrivez brièvement votre activité..."
                                                        value={
                                                            businessDescription
                                                        }
                                                        onChange={e =>
                                                            setBusinessDescription(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="border-slate-300 focus:border-2 focus:ring-0 min-h-[60px]"
                                                        style={{
                                                            "--tw-ring-color":
                                                                "#2D4A6B",
                                                        }}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label
                                                            htmlFor="businessPhone"
                                                            className="text-sm font-medium"
                                                            style={{
                                                                color: "#2D4A6B",
                                                            }}
                                                        >
                                                            Téléphone business
                                                        </label>
                                                        <Input
                                                            id="businessPhone"
                                                            type="tel"
                                                            placeholder="+225 XX XX XX XX"
                                                            value={
                                                                businessPhone
                                                            }
                                                            onChange={e =>
                                                                setBusinessPhone(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="border-slate-300 focus:border-2 focus:ring-0"
                                                            style={{
                                                                "--tw-ring-color":
                                                                    "#2D4A6B",
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label
                                                            htmlFor="businessEmail"
                                                            className="text-sm font-medium"
                                                            style={{
                                                                color: "#2D4A6B",
                                                            }}
                                                        >
                                                            Email business
                                                        </label>
                                                        <Input
                                                            id="businessEmail"
                                                            type="email"
                                                            placeholder="contact@monentreprise.com"
                                                            value={
                                                                businessEmail
                                                            }
                                                            onChange={e =>
                                                                setBusinessEmail(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="border-slate-300 focus:border-2 focus:ring-0"
                                                            style={{
                                                                "--tw-ring-color":
                                                                    "#2D4A6B",
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label
                                                        htmlFor="businessAddress"
                                                        className="text-sm font-medium"
                                                        style={{
                                                            color: "#2D4A6B",
                                                        }}
                                                    >
                                                        Adresse de l'entreprise
                                                    </label>
                                                    <div className="relative">
                                                        <MapPin
                                                            className="absolute left-3 top-3 h-4 w-4"
                                                            style={{
                                                                color: "#2D4A6B",
                                                            }}
                                                        />
                                                        <Input
                                                            id="businessAddress"
                                                            type="text"
                                                            placeholder="Adresse complète de votre entreprise"
                                                            value={
                                                                businessAddress
                                                            }
                                                            onChange={e =>
                                                                setBusinessAddress(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="pl-10 border-slate-300 focus:border-2 focus:ring-0"
                                                            style={{
                                                                "--tw-ring-color":
                                                                    "#2D4A6B",
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
                                            En créant un compte marchand, vous
                                            acceptez nos{" "}
                                            <a
                                                href="#"
                                                className="underline"
                                                style={{ color: "#2D4A6B" }}
                                            >
                                                Conditions d'utilisation
                                                marchands
                                            </a>{" "}
                                            et notre{" "}
                                            <a
                                                href="#"
                                                className="underline"
                                                style={{ color: "#2D4A6B" }}
                                            >
                                                Politique de confidentialité
                                            </a>
                                            . Votre compte sera vérifié avant
                                            activation.
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-11 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                            style={{
                                                backgroundColor: "#2D4A6B",
                                            }}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Création...</span>
                                                </div>
                                            ) : (
                                                "Créer mon compte marchand"
                                            )}
                                        </Button>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default AuthImproved
