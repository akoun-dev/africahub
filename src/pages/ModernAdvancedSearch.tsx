
import React from 'react';
import { UnifiedHeader } from '@/components/UnifiedHeader';
import { UnifiedFooter } from '@/components/UnifiedFooter';
import { ModernAdvancedSearchEngine } from '@/components/search/ModernAdvancedSearchEngine';
import { PurchaseLinksManager } from '@/components/purchase/PurchaseLinksManager';
import { CurrencyManager } from '@/components/currency/CurrencyManager';
import { EnhancedLanguageSelector } from '@/components/i18n/EnhancedLanguageSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Search, 
  ShoppingCart, 
  DollarSign, 
  Languages,
  Sparkles
} from 'lucide-react';

const ModernAdvancedSearch = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <UnifiedHeader />
      
      <main>
        <Tabs defaultValue="search" className="w-full">
          <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
            <div className="container mx-auto px-4">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 bg-white/60 backdrop-blur-sm">
                <TabsTrigger value="search" className="flex items-center gap-2 data-[state=active]:bg-brandBlue data-[state=active]:text-white">
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('search.tab.search', 'Recherche')}</span>
                </TabsTrigger>
                <TabsTrigger value="purchase" className="flex items-center gap-2 data-[state=active]:bg-brandBlue data-[state=active]:text-white">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('search.tab.purchase', 'Achat')}</span>
                </TabsTrigger>
                <TabsTrigger value="currency" className="flex items-center gap-2 data-[state=active]:bg-brandBlue data-[state=active]:text-white">
                  <DollarSign className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('search.tab.currency', 'Devises')}</span>
                </TabsTrigger>
                <TabsTrigger value="language" className="flex items-center gap-2 data-[state=active]:bg-brandBlue data-[state=active]:text-white">
                  <Languages className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('search.tab.language', 'Langue')}</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="search" className="m-0">
            <ModernAdvancedSearchEngine />
          </TabsContent>

          <TabsContent value="purchase" className="m-0">
            <div className="container mx-auto px-4 py-8">
              <Card className="bg-white/80 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-6 w-6 text-brandBlue" />
                    {t('purchase.demo.title', 'Démonstration des Liens d\'Achat')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    {t('purchase.demo.description', 'Exemple d\'intégration avec les fournisseurs pour faciliter l\'achat des produits comparés.')}
                  </p>
                  <PurchaseLinksManager 
                    productId="iphone-14-pro-max" 
                    productName="iPhone 14 Pro Max 128GB"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="currency" className="m-0">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-white/80 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-6 w-6 text-brandBlue" />
                      {t('currency.demo.title', 'Gestion Automatique des Devises')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">
                      {t('currency.demo.description', 'Les prix s\'adaptent automatiquement à votre pays et devise locale.')}
                    </p>
                    <div className="space-y-6">
                      <div className="p-4 bg-brandBlue/5 border border-brandBlue/20 rounded-lg">
                        <h4 className="font-semibold mb-3 text-brandBlue">📱 iPhone 14 Pro Max</h4>
                        <CurrencyManager amount={1299} baseCurrency="USD" />
                      </div>
                      <div className="p-4 bg-brandBlue/5 border border-brandBlue/20 rounded-lg">
                        <h4 className="font-semibold mb-3 text-brandBlue">🚗 Assurance Auto</h4>
                        <CurrencyManager amount={500} baseCurrency="EUR" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-brandBlue" />
                      {t('currency.rates.title', 'Taux de Change Actuels')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { from: 'USD', to: 'XOF', rate: 600, flag: '🇺🇸→🇸🇳' },
                        { from: 'EUR', to: 'XOF', rate: 655, flag: '🇪🇺→🇸🇳' },
                        { from: 'USD', to: 'NGN', rate: 770, flag: '🇺🇸→🇳🇬' },
                        { from: 'USD', to: 'GHS', rate: 11, flag: '🇺🇸→🇬🇭' }
                      ].map((rate, index) => (
                        <div key={index} className="flex justify-between items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 hover:border-brandBlue/30 transition-all duration-200">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{rate.flag}</span>
                            <span className="font-semibold">1 {rate.from}</span>
                          </div>
                          <span className="text-xl font-bold text-brandBlue">
                            {rate.rate} {rate.to}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="language" className="m-0">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <EnhancedLanguageSelector />
                
                <Card className="bg-white/80 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Languages className="h-6 w-6 text-brandBlue" />
                      {t('language.coverage.title', 'Couverture Linguistique')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                        <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                          🟢 Langues Principales (100%)
                        </h4>
                        <p className="text-sm text-green-700">Français, English - Traduction complète</p>
                      </div>
                      
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                          🟡 En Développement (70-85%)
                        </h4>
                        <p className="text-sm text-yellow-700">العربية, Português - Traduction avancée</p>
                      </div>
                      
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                          🔵 Langues Locales (45-60%)
                        </h4>
                        <p className="text-sm text-blue-700">Kiswahili, አማርኛ - Traduction de base</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <UnifiedFooter />
    </div>
  );
};

export default ModernAdvancedSearch;
