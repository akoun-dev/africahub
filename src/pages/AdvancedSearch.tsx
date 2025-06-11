
import React from 'react';
import { UnifiedHeader } from '@/components/UnifiedHeader';
import { UnifiedFooter } from '@/components/UnifiedFooter';
import { AdvancedSearchEngine } from '@/components/search/AdvancedSearchEngine';
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
  Filter
} from 'lucide-react';

const AdvancedSearch = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('search.advanced.title', 'Recherche Avancée')}
          </h1>
          <p className="text-gray-600">
            {t('search.advanced.subtitle', 'Trouvez exactement ce que vous cherchez avec notre moteur de recherche intelligent')}
          </p>
        </div>

        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              {t('search.tab.search', 'Recherche')}
            </TabsTrigger>
            <TabsTrigger value="purchase" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              {t('search.tab.purchase', 'Achat')}
            </TabsTrigger>
            <TabsTrigger value="currency" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {t('search.tab.currency', 'Devises')}
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              {t('search.tab.language', 'Langue')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <AdvancedSearchEngine />
          </TabsContent>

          <TabsContent value="purchase">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    {t('purchase.demo.title', 'Démonstration des Liens d\'Achat')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
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

          <TabsContent value="currency">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    {t('currency.demo.title', 'Gestion Automatique des Devises')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    {t('currency.demo.description', 'Les prix s\'adaptent automatiquement à votre pays et devise locale.')}
                  </p>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Exemple : iPhone 14 Pro Max</h4>
                      <CurrencyManager amount={1299} baseCurrency="USD" />
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Exemple : Assurance Auto</h4>
                      <CurrencyManager amount={500} baseCurrency="EUR" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('currency.rates.title', 'Taux de Change Actuels')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { from: 'USD', to: 'XOF', rate: 600 },
                      { from: 'EUR', to: 'XOF', rate: 655 },
                      { from: 'USD', to: 'NGN', rate: 770 },
                      { from: 'USD', to: 'GHS', rate: 11 }
                    ].map((rate, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">1 {rate.from}</span>
                        <span>=</span>
                        <span className="text-afroGreen font-semibold">{rate.rate} {rate.to}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="language">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EnhancedLanguageSelector />
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('language.coverage.title', 'Couverture Linguistique')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Langues Principales (100%)</h4>
                      <p className="text-sm text-green-700">Français, English - Traduction complète</p>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">En Développement (70-85%)</h4>
                      <p className="text-sm text-yellow-700">العربية, Português - Traduction avancée</p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Langues Locales (45-60%)</h4>
                      <p className="text-sm text-blue-700">Kiswahili, አማርኛ - Traduction de base</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <UnifiedFooter />
    </div>
  );
};

export default AdvancedSearch;
