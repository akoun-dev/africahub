
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Settings, 
  Check, 
  X, 
  DollarSign, 
  Zap, 
  Globe, 
  Code,
  AlertCircle,
  Eye,
  MessageSquare
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

interface LLMProvider {
  id: string;
  name: string;
  description: string;
  models: string[];
  pricing: string;
  capabilities: {
    vision: boolean;
    code: boolean;
    multilingual: boolean;
    realtime: boolean;
    costEffective: boolean;
  };
  status: 'active' | 'inactive' | 'error';
  apiKey?: string;
  isConfigured: boolean;
}

const defaultProviders: LLMProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4o, GPT-4o-mini - Modèles de référence avec vision',
    models: ['gpt-4o', 'gpt-4o-mini'],
    pricing: '$$$',
    capabilities: {
      vision: true,
      code: true,
      multilingual: true,
      realtime: false,
      costEffective: false
    },
    status: 'inactive',
    isConfigured: false
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude 3.5 Sonnet - Excellence en raisonnement et code',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
    pricing: '$$$',
    capabilities: {
      vision: false,
      code: true,
      multilingual: true,
      realtime: false,
      costEffective: false
    },
    status: 'inactive',
    isConfigured: false
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'DeepSeek-V3 - Modèle ultra-économique et performant',
    models: ['deepseek-chat', 'deepseek-coder'],
    pricing: '$',
    capabilities: {
      vision: false,
      code: true,
      multilingual: false,
      realtime: false,
      costEffective: true
    },
    status: 'active',
    isConfigured: true
  },
  {
    id: 'qwen',
    name: 'Qwen (Alibaba)',
    description: 'Qwen2.5 - Excellent en multilingue et contexte africain',
    models: ['qwen2.5-72b-instruct', 'qwen2.5-coder-32b-instruct'],
    pricing: '$$',
    capabilities: {
      vision: false,
      code: true,
      multilingual: true,
      realtime: false,
      costEffective: true
    },
    status: 'active',
    isConfigured: true
  },
  {
    id: 'google',
    name: 'Google Gemini',
    description: 'Gemini 1.5 Pro - Vision et long contexte',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash'],
    pricing: '$$',
    capabilities: {
      vision: true,
      code: true,
      multilingual: true,
      realtime: false,
      costEffective: true
    },
    status: 'inactive',
    isConfigured: false
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    description: 'Sonar - Recherche en temps réel et actualités',
    models: ['llama-3.1-sonar-large-128k-online'],
    pricing: '$$',
    capabilities: {
      vision: false,
      code: false,
      multilingual: true,
      realtime: true,
      costEffective: false
    },
    status: 'inactive',
    isConfigured: false
  }
];

export const LLMProvidersConfig: React.FC = () => {
  const [providers, setProviders] = useState<LLMProvider[]>(defaultProviders);
  const [selectedProvider, setSelectedProvider] = useState<string>('openai');

  const updateProvider = (id: string, updates: Partial<LLMProvider>) => {
    setProviders(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ));
  };

  const toggleProvider = (id: string) => {
    updateProvider(id, { 
      status: providers.find(p => p.id === id)?.status === 'active' ? 'inactive' : 'active' 
    });
  };

  const saveApiKey = (id: string, apiKey: string) => {
    updateProvider(id, { 
      apiKey, 
      isConfigured: !!apiKey,
      status: apiKey ? 'active' : 'inactive'
    });
  };

  const selectedProviderData = providers.find(p => p.id === selectedProvider);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case '$': return 'text-green-600';
      case '$$': return 'text-yellow-600';
      case '$$$': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Configuration des Providers LLM</h3>
        <p className="text-gray-600">
          Configurez et gérez vos providers d'intelligence artificielle pour optimiser les performances et les coûts.
        </p>
      </div>

      <Tabs value={selectedProvider} onValueChange={setSelectedProvider}>
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-6">
          {providers.map((provider) => (
            <TabsTrigger key={provider.id} value={provider.id} className="flex flex-col items-center gap-1 py-3">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium">{provider.name}</span>
                <div className={`w-2 h-2 rounded-full ${
                  provider.status === 'active' ? 'bg-green-500' : 
                  provider.status === 'error' ? 'bg-red-500' : 'bg-gray-300'
                }`} />
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {providers.map((provider) => (
          <TabsContent key={provider.id} value={provider.id}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Configuration du provider */}
              <GlassCard variant="premium" size="lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Brain className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle className="text-xl">{provider.name}</CardTitle>
                        <CardDescription>{provider.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(provider.status)}>
                      {provider.status === 'active' ? 'Actif' : provider.status === 'error' ? 'Erreur' : 'Inactif'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Configuration API Key */}
                  <div className="space-y-3">
                    <Label htmlFor={`apikey-${provider.id}`}>Clé API</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`apikey-${provider.id}`}
                        type="password"
                        placeholder={`Entrez votre clé API ${provider.name}`}
                        value={provider.apiKey || ''}
                        onChange={(e) => updateProvider(provider.id, { apiKey: e.target.value })}
                      />
                      <Button
                        onClick={() => saveApiKey(provider.id, provider.apiKey || '')}
                        size="sm"
                        disabled={!provider.apiKey}
                      >
                        Sauvegarder
                      </Button>
                    </div>
                    {!provider.isConfigured && (
                      <p className="text-sm text-amber-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        Clé API requise pour activer ce provider
                      </p>
                    )}
                  </div>

                  {/* Modèles disponibles */}
                  <div className="space-y-3">
                    <Label>Modèles disponibles</Label>
                    <div className="flex flex-wrap gap-2">
                      {provider.models.map((model) => (
                        <Badge key={model} variant="outline" className="font-mono text-xs">
                          {model}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Capacités */}
                  <div className="space-y-3">
                    <Label>Capacités</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Eye className={`h-4 w-4 ${provider.capabilities.vision ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className="text-sm">Vision</span>
                        {provider.capabilities.vision ? <Check className="h-3 w-3 text-green-600" /> : <X className="h-3 w-3 text-gray-400" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <Code className={`h-4 w-4 ${provider.capabilities.code ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className="text-sm">Code</span>
                        {provider.capabilities.code ? <Check className="h-3 w-3 text-green-600" /> : <X className="h-3 w-3 text-gray-400" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className={`h-4 w-4 ${provider.capabilities.multilingual ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className="text-sm">Multilingue</span>
                        {provider.capabilities.multilingual ? <Check className="h-3 w-3 text-green-600" /> : <X className="h-3 w-3 text-gray-400" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className={`h-4 w-4 ${provider.capabilities.realtime ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className="text-sm">Temps réel</span>
                        {provider.capabilities.realtime ? <Check className="h-3 w-3 text-green-600" /> : <X className="h-3 w-3 text-gray-400" />}
                      </div>
                    </div>
                  </div>

                  {/* Coût et activation */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <DollarSign className={`h-4 w-4 ${getPricingColor(provider.pricing)}`} />
                      <span className="text-sm font-medium">Coût: </span>
                      <span className={`font-bold ${getPricingColor(provider.pricing)}`}>
                        {provider.pricing}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={provider.status === 'active'}
                        onCheckedChange={() => toggleProvider(provider.id)}
                        disabled={!provider.isConfigured}
                      />
                      <span className="text-sm">
                        {provider.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </GlassCard>

              {/* Statistiques et recommandations */}
              <GlassCard variant="accent" size="lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Recommandations d'usage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {provider.id === 'deepseek' && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800 mb-2">💰 Économique</h4>
                      <p className="text-sm text-green-700">
                        Excellent pour les tâches de code et analyse. Très rentable pour l'usage quotidien.
                      </p>
                    </div>
                  )}
                  
                  {provider.id === 'qwen' && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2">🌍 Contexte Africain</h4>
                      <p className="text-sm text-blue-700">
                        Optimisé pour les langues africaines et le contexte culturel local. Idéal pour l'Afrique francophone.
                      </p>
                    </div>
                  )}
                  
                  {provider.id === 'anthropic' && (
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-800 mb-2">🧠 Raisonnement</h4>
                      <p className="text-sm text-purple-700">
                        Excellence en analyse complexe et raisonnement. Parfait pour les recommandations sophistiquées.
                      </p>
                    </div>
                  )}
                  
                  {provider.id === 'perplexity' && (
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="font-medium text-orange-800 mb-2">⚡ Temps Réel</h4>
                      <p className="text-sm text-orange-700">
                        Seul provider avec accès aux données en temps réel. Essentiel pour les prix actuels.
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-medium">Cas d'usage recommandés:</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      {provider.capabilities.code && <li>• Génération et analyse de code</li>}
                      {provider.capabilities.vision && <li>• Analyse d'images et documents</li>}
                      {provider.capabilities.multilingual && <li>• Support multilingue</li>}
                      {provider.capabilities.realtime && <li>• Recherche temps réel</li>}
                      {provider.capabilities.costEffective && <li>• Usage intensif économique</li>}
                    </ul>
                  </div>
                </CardContent>
              </GlassCard>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
