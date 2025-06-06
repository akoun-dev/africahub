import { AvailableLanguage } from "@/contexts/CountryContext"

interface NavigationTranslations {
    [key: string]: {
        [key in AvailableLanguage]?: string
    }
}

export const navigationTranslations: NavigationTranslations = {
    "nav.home": {
        en: "Home",
        fr: "Accueil",
        ar: "الرئيسية",
        pt: "Início",
        sw: "Nyumbani",
        am: "ቤት",
    },
    "nav.compare": {
        en: "Compare",
        fr: "Comparer",
        ar: "قارن",
        pt: "Comparar",
        sw: "Linganisha",
        am: "አወዳድር",
    },
    "nav.products": {
        en: "Products",
        fr: "Produits",
        ar: "المنتجات",
        pt: "Produtos",
        sw: "Bidhaa",
        am: "ምርቶች",
    },
    "nav.advanced_search": {
        en: "Advanced Search",
        fr: "Recherche Avancée",
        ar: "البحث المتقدم",
        pt: "Pesquisa Avançada",
        sw: "Utafutaji wa Kina",
        am: "የላቀ ፍለጋ",
    },
    "nav.recommendations": {
        en: "AI Recommendations",
        fr: "Recommandations IA",
        ar: "توصيات الذكاء الاصطناعي",
        pt: "Recomendações IA",
        sw: "Mapendekezo ya AI",
        am: "AI ምክሮች",
    },
    "nav.dashboard": {
        en: "Dashboard",
        fr: "Tableau de bord",
        ar: "لوحة التحكم",
        pt: "Painel",
        sw: "Dashibodi",
        am: "ዳሽቦርድ",
    },
    "nav.admin": {
        en: "Admin",
        fr: "Administration",
        ar: "الإدارة",
        pt: "Administração",
        sw: "Uongozi",
        am: "አስተዳደር",
    },
    "nav.more": {
        en: "More",
        fr: "Plus",
        ar: "المزيد",
        pt: "Mais",
        sw: "Zaidi",
        am: "ተጨማሪ",
    },
    "nav.sectors": {
        en: "Sectors",
        fr: "Secteurs",
        ar: "القطاعات",
        pt: "Setores",
        sw: "Sekta",
        am: "ዘርፎች",
    },
    "nav.profile": {
        en: "Profile",
        fr: "Profil",
        ar: "الملف الشخصي",
        pt: "Perfil",
        sw: "Wasifu",
        am: "መገለጫ",
    },
    "nav.settings": {
        en: "Settings",
        fr: "Paramètres",
        ar: "الإعدادات",
        pt: "Configurações",
        sw: "Mipangilio",
        am: "ቅንብሮች",
    },
    "nav.logout": {
        en: "Logout",
        fr: "Déconnexion",
        ar: "تسجيل الخروج",
        pt: "Sair",
        sw: "Ondoka",
        am: "ውጣ",
    },
    "nav.api": {
        en: "API",
        fr: "API",
        ar: "واجهة برمجة التطبيقات",
        pt: "API",
        sw: "API",
        am: "API",
    },
    "nav.my_reviews": {
        en: "My Reviews",
        fr: "Mes Avis",
        ar: "مراجعاتي",
        pt: "Minhas Avaliações",
        sw: "Maoni Yangu",
        am: "የኔ ግምገማዎች",
    },
    "nav.favorites": {
        en: "Favorites",
        fr: "Favoris",
        ar: "المفضلة",
        pt: "Favoritos",
        sw: "Vipendwa",
        am: "ተወዳጆች",
    },
    "nav.history": {
        en: "History",
        fr: "Historique",
        ar: "التاريخ",
        pt: "Histórico",
        sw: "Historia",
        am: "ታሪክ",
    },
    "nav.notifications": {
        en: "Notifications",
        fr: "Notifications",
        ar: "الإشعارات",
        pt: "Notificações",
        sw: "Arifa",
        am: "ማሳወቂያዎች",
    },
    "nav.map": {
        en: "Map",
        fr: "Carte",
        ar: "الخريطة",
        pt: "Mapa",
        sw: "Ramani",
        am: "ካርታ",
    },
    "nav.features": {
        en: "Features",
        fr: "Fonctionnalités",
        ar: "المميزات",
        pt: "Recursos",
        sw: "Vipengele",
        am: "ባህሪያት",
    },
    "nav.menu": {
        en: "Menu",
        fr: "Menu",
        ar: "القائمة",
        pt: "Menu",
        sw: "Menyu",
        am: "ዝርዝር",
    },
    "nav.explore_sections": {
        en: "Explore different sections of the site.",
        fr: "Explorez les différentes sections du site.",
        ar: "استكشف أقسام مختلفة من الموقع.",
        pt: "Explore diferentes seções do site.",
        sw: "Chunguza sehemu mbalimbali za tovuti.",
        am: "የተለያዩ የድረ-ገጽ ክፍሎችን ያስስ።",
    },
    "nav.about": {
        en: "About",
        fr: "À propos",
        ar: "حول",
        pt: "Sobre",
        sw: "Kuhusu",
        am: "ስለ",
    },
    "auth.login": {
        en: "Log In",
        fr: "Connexion",
        ar: "تسجيل الدخول",
        pt: "Entrar",
        sw: "Ingia",
        am: "ግባ",
    },
    "auth.signup": {
        en: "Sign Up",
        fr: "S'inscrire",
        ar: "التسجيل",
        pt: "Registrar",
        sw: "Jisajili",
        am: "መመዝገብ",
    },
    "auth.profile": {
        en: "Profile",
        fr: "Profil",
        ar: "الملف الشخصي",
        pt: "Perfil",
        sw: "Wasifu",
        am: "መገለጫ",
    },
    "nav.select_country": {
        en: "Select Country",
        fr: "Sélectionner un pays",
        ar: "اختر البلد",
        pt: "Selecionar País",
        sw: "Chagua Nchi",
        am: "ሀገር ይምረጡ",
    },
    // Admin translations
    "admin.panel": {
        en: "Admin Panel",
        fr: "Panneau d'administration",
        ar: "لوحة الإدارة",
        pt: "Painel Administrativo",
        sw: "Paneli ya Uongozi",
        am: "የአስተዳደር ፓነል",
    },
    "admin.import_products": {
        en: "Import Products",
        fr: "Importer des produits",
        ar: "استيراد المنتجات",
        pt: "Importar Produtos",
        sw: "Agiza Bidhaa",
        am: "ምርቶችን ማስመጣት",
    },
    "admin.api_integrations": {
        en: "API & Integrations",
        fr: "API et Intégrations",
        ar: "واجهة برمجة التطبيقات والتكامل",
        pt: "API e Integrações",
        sw: "API na Muunganiko",
        am: "API እና ውህደቶች",
    },
    "admin.security": {
        en: "Security",
        fr: "Sécurité",
        ar: "الأمان",
        pt: "Segurança",
        sw: "Usalama",
        am: "ደህንነት",
    },
    "admin.performance": {
        en: "Performance",
        fr: "Performance",
        ar: "الأداء",
        pt: "Desempenho",
        sw: "Utendaji",
        am: "አፈጻጸም",
    },
    // Sector translations
    "sector.insurance": {
        en: "Insurance",
        fr: "Assurance",
        ar: "التأمين",
        pt: "Seguro",
        sw: "Bima",
        am: "ኢንሹራንስ",
    },
    "sector.banking": {
        en: "Banking",
        fr: "Banque",
        ar: "المصرفية",
        pt: "Bancário",
        sw: "Benki",
        am: "ባንክ",
    },
    "sector.telecoms": {
        en: "Telecoms",
        fr: "Télécoms",
        ar: "الاتصالات",
        pt: "Telecomunicações",
        sw: "Mawasiliano",
        am: "ቴሌኮሙኒኬሽን",
    },
    "sector.energy": {
        en: "Energy",
        fr: "Énergie",
        ar: "الطاقة",
        pt: "Energia",
        sw: "Nishati",
        am: "ሃይል",
    },
    "sector.real_estate": {
        en: "Real Estate",
        fr: "Immobilier",
        ar: "العقارات",
        pt: "Imobiliário",
        sw: "Mali Isiyohamishika",
        am: "ሪል እስቴት",
    },
    "sector.transport": {
        en: "Transport",
        fr: "Transport",
        ar: "النقل",
        pt: "Transporte",
        sw: "Usafiri",
        am: "መጓጓዣ",
    },
    // Nouvelles clés manquantes
    "nav.search": {
        en: "Search",
        fr: "Recherche",
        ar: "البحث",
        pt: "Pesquisar",
        sw: "Tafuta",
        am: "ፍለጋ",
    },
    "nav.contact": {
        en: "Contact",
        fr: "Contact",
        ar: "اتصل",
        pt: "Contato",
        sw: "Wasiliana",
        am: "ያግኙን",
    },
    "nav.faq": {
        en: "FAQ",
        fr: "FAQ",
        ar: "الأسئلة الشائعة",
        pt: "FAQ",
        sw: "Maswali",
        am: "ተደጋጋሚ ጥያቄዎች",
    },
    "nav.details": {
        en: "Details",
        fr: "Détails",
        ar: "التفاصيل",
        pt: "Detalhes",
        sw: "Maelezo",
        am: "ዝርዝሮች",
    },
    "nav.quote": {
        en: "Quote",
        fr: "Devis",
        ar: "عرض سعر",
        pt: "Cotação",
        sw: "Nukuu",
        am: "ዋጋ",
    },
    // Secteurs spécifiques
    "sector.auto_insurance": {
        en: "Auto Insurance",
        fr: "Assurance Auto",
        ar: "تأمين السيارات",
        pt: "Seguro Auto",
        sw: "Bima ya Gari",
        am: "የመኪና ኢንሹራንስ",
    },
    "sector.home_insurance": {
        en: "Home Insurance",
        fr: "Assurance Habitation",
        ar: "تأمين المنزل",
        pt: "Seguro Residencial",
        sw: "Bima ya Nyumba",
        am: "የቤት ኢንሹራንስ",
    },
    // Nouvelles clés pour le menu mobile
    "nav.alerts": {
        en: "Price Alerts",
        fr: "Alertes Prix",
        ar: "تنبيهات الأسعار",
        pt: "Alertas de Preço",
        sw: "Tahadhari za Bei",
        am: "የዋጋ ማስጠንቀቂያዎች",
    },
    "nav.favorites_public": {
        en: "Public Favorites",
        fr: "Favoris Publics",
        ar: "المفضلة العامة",
        pt: "Favoritos Públicos",
        sw: "Vipendwa vya Umma",
        am: "የሕዝብ ተወዳጆች",
    },
    "nav.reviews": {
        en: "Reviews & Testimonials",
        fr: "Avis & Témoignages",
        ar: "المراجعات والشهادات",
        pt: "Avaliações & Depoimentos",
        sw: "Maoni na Ushahidi",
        am: "ግምገማዎች እና ምስክርነቶች",
    },
    "nav.marketplace": {
        en: "Marketplace",
        fr: "Marketplace",
        ar: "السوق الإلكتروني",
        pt: "Marketplace",
        sw: "Soko la Mtandao",
        am: "የገበያ ቦታ",
    },
    "nav.business": {
        en: "Business Space",
        fr: "Espace Entreprise",
        ar: "مساحة الأعمال",
        pt: "Espaço Empresarial",
        sw: "Nafasi ya Biashara",
        am: "የንግድ ቦታ",
    },
    "nav.advertising": {
        en: "Advertising Solutions",
        fr: "Solutions Publicitaires",
        ar: "حلول الإعلان",
        pt: "Soluções Publicitárias",
        sw: "Suluhisho za Matangazo",
        am: "የማስታወቂያ መፍትሄዎች",
    },
    "nav.pricing": {
        en: "Premium Services",
        fr: "Services Premium",
        ar: "الخدمات المميزة",
        pt: "Serviços Premium",
        sw: "Huduma za Hali ya Juu",
        am: "ፕሪሚየም አገልግሎቶች",
    },
    "nav.public_api": {
        en: "Public API",
        fr: "API Publique",
        ar: "واجهة برمجة التطبيقات العامة",
        pt: "API Pública",
        sw: "API ya Umma",
        am: "የሕዝብ API",
    },
    "sector.health_insurance": {
        en: "Health Insurance",
        fr: "Assurance Santé",
        ar: "التأمين الصحي",
        pt: "Seguro Saúde",
        sw: "Bima ya Afya",
        am: "የጤና ኢንሹራንስ",
    },
    "sector.micro_insurance": {
        en: "Micro Insurance",
        fr: "Micro-assurance",
        ar: "التأمين المصغر",
        pt: "Micro Seguro",
        sw: "Bima Ndogo",
        am: "ማይክሮ ኢንሹራንስ",
    },
}
