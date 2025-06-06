import React, { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { CountryProvider } from "./contexts/CountryContext"
import { ThemeProvider } from "./contexts/ThemeContext"

// Layouts
import { PublicLayout } from "./layouts/PublicLayout"
import { ProtectedLayout } from "./layouts/ProtectedLayout"
import { AdminLayout } from "./layouts/AdminLayout"

// Components
import { LoadingSpinner } from "./components/ui/loading-spinner"
import { ErrorBoundary } from "./components/common/ErrorBoundary"

// Pages publiques - Lazy loaded pour optimiser les performances
const Index = React.lazy(() => import("./pages/Index"))
const Home = React.lazy(() => import("./pages/Home"))
const Compare = React.lazy(() => import("./pages/Compare"))
const Auth = React.lazy(() => import("./pages/Auth"))
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"))
const QuoteRequest = React.lazy(() => import("./pages/QuoteRequest"))
const Search = React.lazy(() => import("./pages/Search"))
const Contact = React.lazy(() => import("./pages/Contact"))
const FAQ = React.lazy(() => import("./pages/FAQ"))
const About = React.lazy(() => import("./pages/About"))
const Sitemap = React.lazy(() => import("./pages/Sitemap"))
const NotFound = React.lazy(() => import("./pages/NotFound"))

// Nouvelles pages manquantes
const Guides = React.lazy(() => import("./pages/Guides"))
const Deals = React.lazy(() => import("./pages/Deals"))
const Secteurs = React.lazy(() => import("./pages/Secteurs"))
const Help = React.lazy(() => import("./pages/Help"))
const Produits = React.lazy(() => import("./pages/Produits"))
const ProduitsModerne = React.lazy(() => import("./pages/ProduitsModerne"))
const TestProduits = React.lazy(() => import("./pages/TestProduits"))

// Pages sectorielles
const Sector = React.lazy(() => import("./pages/Sector"))
const SectorDetail = React.lazy(() => import("./pages/SectorDetail"))
const SectorCompare = React.lazy(() => import("./pages/SectorCompare"))
const SectorQuote = React.lazy(() => import("./pages/SectorQuote"))

// Pages protégées
const Dashboard = React.lazy(() => import("./pages/Dashboard"))
const Profile = React.lazy(() => import("./pages/Profile"))
const Favorites = React.lazy(() => import("./pages/Favorites"))
const History = React.lazy(() => import("./pages/History"))
const Notifications = React.lazy(() => import("./pages/Notifications"))
const MyReviews = React.lazy(() =>
    import("./pages/MyReviews").then(module => ({ default: module.MyReviews }))
)

// Pages administrateur
const Admin = React.lazy(() => import("./pages/Admin"))
const APIManagement = React.lazy(() => import("./pages/APIManagement"))
const SearchAnalytics = React.lazy(() => import("./pages/SearchAnalytics"))
const Monitoring = React.lazy(() => import("./pages/Monitoring"))

// Pages légales (pas de lazy loading car légères)
import { LegalPages } from "./pages/legal/LegalPages"

// Ajout des nouvelles pages publiques
const Recommendations = React.lazy(() => import("./pages/Recommendations"))
const Business = React.lazy(() => import("./pages/Business"))
const Advertising = React.lazy(() => import("./pages/Advertising"))
const Pricing = React.lazy(() => import("./pages/Pricing"))
const Alerts = React.lazy(() => import("./pages/Alerts"))
const FavoritesPublic = React.lazy(() => import("./pages/FavoritesPublic"))
const Reviews = React.lazy(() => import("./pages/Reviews"))
const Marketplace = React.lazy(() => import("./pages/Marketplace"))
const PublicAPI = React.lazy(() => import("./pages/PublicAPI"))

// Pages sectorielles spécialisées
const Banque = React.lazy(() => import("./pages/Banque"))
const Energie = React.lazy(() => import("./pages/Energie"))
const Telecoms = React.lazy(() => import("./pages/Telecoms"))
const Immobilier = React.lazy(() => import("./pages/Immobilier"))
const Transport = React.lazy(() => import("./pages/Transport"))
const Education = React.lazy(() => import("./pages/Education"))
const Sante = React.lazy(() => import("./pages/Sante"))
const Health = React.lazy(() => import("./pages/Health"))
const Commerce = React.lazy(() => import("./pages/Commerce"))

const queryClient = new QueryClient()

/**
 * Application principale avec navigation unifiée et layouts optimisés
 * - Routes publiques avec PublicLayout
 * - Routes protégées avec ProtectedLayout
 * - Routes admin avec AdminLayout
 * - Lazy loading pour optimiser les performances
 * - ErrorBoundary pour gérer les erreurs
 */
const App = () => (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <AuthProvider>
                        <CountryProvider>
                            <ErrorBoundary>
                                <Routes>
                                    {/* Routes publiques avec layout unifié */}
                                    <Route
                                        path="/"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement de la page d'accueil..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    showBreadcrumbs={false}
                                                >
                                                    <Index />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/home"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement..."
                                                    />
                                                }
                                            >
                                                <PublicLayout>
                                                    <Home />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/compare"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement du comparateur..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Comparateur de produits"
                                                    description="Comparez facilement les produits et services de différents secteurs"
                                                >
                                                    <Compare />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/search"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement de la recherche..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Recherche avancée"
                                                    description="Trouvez exactement ce que vous cherchez avec notre moteur intelligent"
                                                >
                                                    <Search />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/contact"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Contactez-nous"
                                                    description="Notre équipe est à votre disposition pour répondre à toutes vos questions"
                                                >
                                                    <Contact />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/faq"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement de la FAQ..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Questions fréquentes"
                                                    description="Trouvez rapidement les réponses à vos questions sur l'utilisation d'AfricaHub"
                                                >
                                                    <FAQ />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/about"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="À propos d'AfricaHub"
                                                    description="Découvrez notre mission et notre équipe"
                                                >
                                                    <About />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/sitemap"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement du plan du site..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Plan du site"
                                                    description="Retrouvez facilement toutes les pages et fonctionnalités d'AfricaHub"
                                                >
                                                    <Sitemap />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    {/* Nouvelles pages manquantes */}
                                    <Route
                                        path="/guides"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement des guides..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Guides d'achat"
                                                    description="Conseils d'experts pour faire les meilleurs choix"
                                                >
                                                    <Guides />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/deals"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement des bons plans..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Bons plans"
                                                    description="Les meilleures offres et réductions exclusives"
                                                >
                                                    <Deals />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/secteurs"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement des secteurs..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Tous les secteurs"
                                                    description="Explorez tous les secteurs disponibles sur AfricaHub"
                                                >
                                                    <Secteurs />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/help"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement de l'aide..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Centre d'aide"
                                                    description="Trouvez rapidement les réponses à vos questions"
                                                >
                                                    <Help />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/produits"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement des produits..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Tous les produits"
                                                    description="Découvrez et comparez tous les produits et services disponibles"
                                                    showBreadcrumbs={false}
                                                >
                                                    <Produits />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/produits/:productId"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement du produit..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Détail produit"
                                                    description="Comparez les prix et découvrez les meilleures offres"
                                                    showBreadcrumbs={false}
                                                >
                                                    <Produits />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/produits-moderne"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement des produits..."
                                                    />
                                                }
                                            >
                                                <ProduitsModerne />
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/produits-moderne/:productId"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement du produit..."
                                                    />
                                                }
                                            >
                                                <ProduitsModerne />
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/test-produits"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement du test..."
                                                    />
                                                }
                                            >
                                                <TestProduits />
                                            </Suspense>
                                        }
                                    />

                                    {/* Routes sectorielles unifiées */}
                                    <Route
                                        path="/secteur/:slug"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement du secteur..."
                                                    />
                                                }
                                            >
                                                <PublicLayout>
                                                    <Sector />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/secteur/:slug/details"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement des détails..."
                                                    />
                                                }
                                            >
                                                <PublicLayout>
                                                    <SectorDetail />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/secteur/:slug/compare"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement de la comparaison..."
                                                    />
                                                }
                                            >
                                                <PublicLayout>
                                                    <SectorCompare />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/secteur/:slug/quote"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement du formulaire de devis..."
                                                    />
                                                }
                                            >
                                                <PublicLayout>
                                                    <SectorQuote />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    {/* Routes sectorielles spécialisées */}
                                    <Route
                                        path="/secteur/banque"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement du secteur bancaire..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Secteur Bancaire"
                                                    description="Services bancaires et financiers en Afrique"
                                                    showBreadcrumbs={false}
                                                >
                                                    <Banque />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/secteur/energie"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement du secteur énergétique..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Secteur Énergétique"
                                                    description="Solutions énergétiques et renouvelables en Afrique"
                                                    showBreadcrumbs={false}
                                                >
                                                    <Energie />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/secteur/telecom"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement du secteur télécoms..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Secteur Télécoms"
                                                    description="Services de télécommunications en Afrique"
                                                    showBreadcrumbs={false}
                                                >
                                                    <Telecoms />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/secteur/immobilier"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement du secteur immobilier..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Secteur Immobilier"
                                                    description="Marché immobilier et opportunités d'investissement en Afrique"
                                                    showBreadcrumbs={false}
                                                >
                                                    <Immobilier />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/secteur/transport"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement du secteur transport..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Secteur Transport"
                                                    description="Solutions de transport et logistique en Afrique"
                                                    showBreadcrumbs={false}
                                                >
                                                    <Transport />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/secteur/education"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement du secteur éducation..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Secteur Éducation"
                                                    description="Formations et opportunités éducatives en Afrique"
                                                    showBreadcrumbs={false}
                                                >
                                                    <Education />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/secteur/sante"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement du secteur santé..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Secteur Santé"
                                                    description="Services de santé et soins médicaux en Afrique"
                                                    showBreadcrumbs={false}
                                                >
                                                    <Sante />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/secteur/health"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement du secteur santé..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Health Sector"
                                                    description="Healthcare services and medical care in Africa"
                                                    showBreadcrumbs={false}
                                                >
                                                    <Health />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/secteur/commerce"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement du secteur commerce..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Secteur Commerce"
                                                    description="E-commerce et solutions commerciales en Afrique"
                                                    showBreadcrumbs={false}
                                                >
                                                    <Commerce />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    {/* Pages légales avec layout simplifié */}
                                    <Route
                                        path="/mentions-legales"
                                        element={
                                            <PublicLayout
                                                title="Mentions légales"
                                                showQuickNav={false}
                                                showAssistant={false}
                                            >
                                                <LegalPages />
                                            </PublicLayout>
                                        }
                                    />
                                    <Route
                                        path="/confidentialite"
                                        element={
                                            <PublicLayout
                                                title="Politique de confidentialité"
                                                showQuickNav={false}
                                                showAssistant={false}
                                            >
                                                <LegalPages />
                                            </PublicLayout>
                                        }
                                    />
                                    <Route
                                        path="/conditions-utilisation"
                                        element={
                                            <PublicLayout
                                                title="Conditions d'utilisation"
                                                showQuickNav={false}
                                                showAssistant={false}
                                            >
                                                <LegalPages />
                                            </PublicLayout>
                                        }
                                    />

                                    {/* Détail produit */}
                                    <Route
                                        path="/product/:id"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement du produit..."
                                                    />
                                                }
                                            >
                                                <PublicLayout>
                                                    <ProductDetail />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    {/* Demande de devis */}
                                    <Route
                                        path="/quote-request"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement du formulaire..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Demande de devis"
                                                    description="Obtenez des devis personnalisés pour vos besoins"
                                                >
                                                    <QuoteRequest />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    {/* Nouvelles pages développées */}
                                    <Route
                                        path="/recommendations"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement des recommandations IA..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Recommandations IA"
                                                    description="Suggestions personnalisées basées sur votre profil et vos préférences"
                                                >
                                                    <Recommendations />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/business"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement de l'espace business..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="AfricaHub Business"
                                                    description="Solutions professionnelles pour entreprises et partenaires"
                                                >
                                                    <Business />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/partners"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement de l'espace partenaires..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Espace Partenaires"
                                                    description="Solutions et services dédiés à nos partenaires"
                                                >
                                                    <Business />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/advertising"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement des solutions publicitaires..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Solutions Publicitaires"
                                                    description="Atteignez des millions d'Africains avec nos solutions publicitaires ciblées"
                                                >
                                                    <Advertising />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/pricing"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement de la tarification..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Tarification AfricaHub"
                                                    description="Choisissez le plan qui correspond à vos besoins et votre budget"
                                                >
                                                    <Pricing />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/alerts"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement des alertes..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Alertes Prix"
                                                    description="Configurez vos alertes pour être notifié des meilleures offres"
                                                >
                                                    <Alerts />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/favorites-public"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement des favoris publics..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Favoris Publics"
                                                    description="Découvrez les produits et services les plus appréciés"
                                                >
                                                    <FavoritesPublic />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/reviews"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement des avis..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Avis et Témoignages"
                                                    description="Consultez les avis et témoignages de notre communauté"
                                                >
                                                    <Reviews />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/marketplace"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement de la marketplace..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="Marketplace AfricaHub"
                                                    description="Plateforme de mise en relation entre fournisseurs et consommateurs"
                                                >
                                                    <Marketplace />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/public-api"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement de l'API publique..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    title="API Publique AfricaHub"
                                                    description="Documentation et accès à notre API publique"
                                                >
                                                    <PublicAPI />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />

                                    {/* Authentification (sans layout) */}
                                    <Route
                                        path="/auth"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement..."
                                                    />
                                                }
                                            >
                                                <Auth />
                                            </Suspense>
                                        }
                                    />

                                    {/* Routes protégées avec layout spécialisé */}
                                    <Route
                                        path="/dashboard"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement du tableau de bord..."
                                                    />
                                                }
                                            >
                                                <ProtectedLayout
                                                    title="Tableau de bord"
                                                    description="Vue d'ensemble de votre compte et de vos activités"
                                                >
                                                    <Dashboard />
                                                </ProtectedLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/profile"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement du profil..."
                                                    />
                                                }
                                            >
                                                <ProtectedLayout
                                                    title="Mon profil"
                                                    description="Gérez vos informations personnelles et préférences"
                                                >
                                                    <Profile />
                                                </ProtectedLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/favorites"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement des favoris..."
                                                    />
                                                }
                                            >
                                                <ProtectedLayout
                                                    title="Mes favoris"
                                                    description="Vos produits et services favoris"
                                                >
                                                    <Favorites />
                                                </ProtectedLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/history"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement de l'historique..."
                                                    />
                                                }
                                            >
                                                <ProtectedLayout
                                                    title="Historique"
                                                    description="Historique de vos recherches et comparaisons"
                                                >
                                                    <History />
                                                </ProtectedLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/notifications"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement des notifications..."
                                                    />
                                                }
                                            >
                                                <ProtectedLayout
                                                    title="Notifications"
                                                    description="Centre de notifications et alertes"
                                                >
                                                    <Notifications />
                                                </ProtectedLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/my-reviews"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement des avis..."
                                                    />
                                                }
                                            >
                                                <ProtectedLayout
                                                    title="Mes avis"
                                                    description="Gérez vos avis et commentaires"
                                                >
                                                    <MyReviews />
                                                </ProtectedLayout>
                                            </Suspense>
                                        }
                                    />

                                    {/* Routes administrateur avec layout spécialisé */}
                                    <Route
                                        path="/admin"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement de l'administration..."
                                                    />
                                                }
                                            >
                                                <AdminLayout
                                                    title="Administration"
                                                    description="Gestion et configuration de la plateforme"
                                                >
                                                    <Admin />
                                                </AdminLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/api"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement de la gestion API..."
                                                    />
                                                }
                                            >
                                                <AdminLayout
                                                    title="Gestion API"
                                                    description="Gestion des APIs et intégrations"
                                                >
                                                    <APIManagement />
                                                </AdminLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/search-analytics"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement des analyses..."
                                                    />
                                                }
                                            >
                                                <AdminLayout
                                                    title="Analyses de recherche"
                                                    description="Statistiques et analyses détaillées"
                                                >
                                                    <SearchAnalytics />
                                                </AdminLayout>
                                            </Suspense>
                                        }
                                    />

                                    <Route
                                        path="/monitoring"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement de la surveillance..."
                                                    />
                                                }
                                            >
                                                <AdminLayout
                                                    title="Surveillance"
                                                    description="Surveillance système et performances"
                                                >
                                                    <Monitoring />
                                                </AdminLayout>
                                            </Suspense>
                                        }
                                    />

                                    {/* Page 404 avec layout public */}
                                    <Route
                                        path="*"
                                        element={
                                            <Suspense
                                                fallback={
                                                    <LoadingSpinner
                                                        size="lg"
                                                        text="Chargement..."
                                                    />
                                                }
                                            >
                                                <PublicLayout
                                                    showBreadcrumbs={false}
                                                    showQuickNav={false}
                                                >
                                                    <NotFound />
                                                </PublicLayout>
                                            </Suspense>
                                        }
                                    />
                                </Routes>
                            </ErrorBoundary>
                        </CountryProvider>
                    </AuthProvider>
                </BrowserRouter>
            </TooltipProvider>
        </ThemeProvider>
    </QueryClientProvider>
)

export default App
