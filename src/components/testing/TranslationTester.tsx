
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCountry, AvailableLanguage } from '@/contexts/CountryContext';
import { useTranslation } from '@/hooks/useTranslation';
import { getTranslationStats, validateTranslations, logTranslationStats } from '@/utils/translations/index';
import { Globe, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export const TranslationTester: React.FC = () => {
  const { language, setLanguage } = useCountry();
  const { t } = useTranslation();
  const [testKey, setTestKey] = useState('purchase.where_to_buy');
  
  const translationStats = getTranslationStats();
  const validationResults = validateTranslations();
  
  const testKeys = [
    'purchase.where_to_buy',
    'purchase.buy_now',
    'admin.dashboard',
    'validation.required',
    'forms.name',
    'messages.loading',
    'performance.loading_time',
    'comparison.advanced.title'
  ];
  
  const handleRunTests = () => {
    logTranslationStats();
    console.log('🧪 Translation Validation Results:', validationResults);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Testeur de Traductions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Select value={language} onValueChange={(value: AvailableLanguage) => setLanguage(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="sw">Kiswahili</SelectItem>
                <SelectItem value="am">አማርኛ</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={testKey} onValueChange={setTestKey}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {testKeys.map(key => (
                  <SelectItem key={key} value={key}>{key}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button onClick={handleRunTests} variant="outline">
              <Info className="h-4 w-4 mr-2" />
              Tester
            </Button>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium">Test de traduction:</p>
            <p className="text-lg">"{t(testKey)}"</p>
            <p className="text-sm text-gray-600">Clé: {testKey}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Statistiques de Traduction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {translationStats.map(stat => (
              <div key={stat.language} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{stat.language.toUpperCase()}</span>
                  {stat.completionRate === 100 ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  )}
                </div>
                <div className="text-2xl font-bold">{stat.completionRate}%</div>
                <div className="text-sm text-gray-600">
                  {stat.translated}/{stat.total} clés
                </div>
                {stat.missing.length > 0 && (
                  <Badge variant="destructive" className="mt-2">
                    {stat.missing.length} manquantes
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Tests des Nouvelles Traductions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Achat:</p>
                <p>{t('purchase.where_to_buy')}</p>
                <p>{t('purchase.buy_now')}</p>
              </div>
              <div>
                <p className="font-medium">Administration:</p>
                <p>{t('admin.dashboard')}</p>
                <p>{t('admin.products')}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Formulaires:</p>
                <p>{t('forms.name')}</p>
                <p>{t('forms.email')}</p>
              </div>
              <div>
                <p className="font-medium">Messages:</p>
                <p>{t('messages.loading')}</p>
                <p>{t('messages.success')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
