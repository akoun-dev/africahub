import { AvailableLanguage } from "@/contexts/CountryContext"

interface CountryTranslations {
    [key: string]: {
        [key in AvailableLanguage]?: string
    }
}

export const countryTranslations: CountryTranslations = {
    "country.widgets.title": {
        en: "Country-Adapted Information",
        fr: "Informations Adaptées à Votre Pays",
        ar: "معلومات مناسبة لبلدك",
        pt: "Informações Adaptadas ao Seu País",
        sw: "Maelezo Yanayokufaa Nchi Yako",
        am: "ለአገርዎ የተስተካከሉ መረጃዎች",
    },
    "country.widgets.subtitle": {
        en: "Personalized details according to your location in Africa",
        fr: "Des détails personnalisés selon votre localisation en Afrique",
        ar: "تفاصيل مخصصة حسب موقعك في أفريقيا",
        pt: "Detalhes personalizados de acordo com sua localização na África",
        sw: "Maelezo maalum kulingana na eneo lako Afrika",
        am: "በአፍሪካ ያለዎትን አካባቢ መሰረት ያደረጉ ዝርዝሮች",
    },
    "insights.personal.title": {
        en: "Your Personalized Multi-Sector Insights",
        fr: "Vos insights personnalisés multi-sectoriels",
        ar: "رؤاك الشخصية متعددة القطاعات",
        pt: "Seus insights personalizados multi-setoriais",
        sw: "Maarifa yako ya kibinafsi ya sekta nyingi",
        am: "የእርስዎ ተላላፊ የበለጸጉ ዘርፎች ግንዛቤዎች",
    },
    // Nouvelles clés manquantes
    "country.currency": {
        en: "Currency",
        fr: "Devise",
        ar: "العملة",
        pt: "Moeda",
        sw: "Sarafu",
        am: "ምንዛሪ",
    },
    "country.languages": {
        en: "Languages",
        fr: "Langues",
        ar: "اللغات",
        pt: "Idiomas",
        sw: "Lugha",
        am: "ቋንቋዎች",
    },
}
