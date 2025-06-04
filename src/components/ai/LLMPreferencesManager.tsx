
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useUserLLMPreferences, useLLMProviderStatus } from '@/hooks/useMultiLLM';
import { toast } from '@/hooks/use-toast';
import { Settings, Save } from 'lucide-react';

export const LLMPreferencesManager: React.FC = () => {
  const { preferences, updatePreferences } = useUserLLMPreferences();
  const { data: providerStatus } = useLLMProviderStatus();
  const [formData, setFormData] = React.useState({
    preferred_strategy: 'balanced',
    preferred_provider: '',
    cost_threshold: 0.01,
    max_latency_ms: 5000
  });

  React.useEffect(() => {
    if (preferences) {
      setFormData({
        preferred_strategy: preferences.preferred_strategy || 'balanced',
        preferred_provider: preferences.preferred_provider || '',
        cost_threshold: preferences.cost_threshold || 0.01,
        max_latency_ms: preferences.max_latency_ms || 5000
      });
    }
  }, [preferences]);

  const handleSave = async () => {
    try {
      await updatePreferences.mutateAsync(formData);
      toast({
        title: "Préférences sauvegardées",
        description: "Vos préférences IA ont été mises à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les préférences.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Préférences IA Multi-LLM
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="strategy">Stratégie de routage</Label>
          <Select 
            value={formData.preferred_strategy} 
            onValueChange={(value) => setFormData({ ...formData, preferred_strategy: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cost_optimized">Optimisé coût</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="balanced">Équilibré</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-600">
            {formData.preferred_strategy === 'cost_optimized' && 'Privilégie les providers les moins chers (DeepSeek, Qwen)'}
            {formData.preferred_strategy === 'performance' && 'Privilégie la qualité des réponses (OpenAI, Claude)'}
            {formData.preferred_strategy === 'balanced' && 'Équilibre entre coût et performance selon la complexité'}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="provider">Provider préféré (optionnel)</Label>
          <Select 
            value={formData.preferred_provider} 
            onValueChange={(value) => setFormData({ ...formData, preferred_provider: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Automatique selon la stratégie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Automatique</SelectItem>
              {providerStatus && Object.entries(providerStatus).map(([provider, status]: [string, any]) => (
                <SelectItem key={provider} value={provider} disabled={!status.available}>
                  {provider.charAt(0).toUpperCase() + provider.slice(1)} 
                  {!status.available && ' (indisponible)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost_threshold">Seuil de coût maximal ($)</Label>
          <Input
            id="cost_threshold"
            type="number"
            step="0.001"
            value={formData.cost_threshold}
            onChange={(e) => setFormData({ ...formData, cost_threshold: parseFloat(e.target.value) || 0 })}
          />
          <p className="text-xs text-gray-600">
            Coût maximum acceptable par requête. Dépasser ce seuil déclenchera un fallback vers un provider moins cher.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_latency">Latence maximale (ms)</Label>
          <Input
            id="max_latency"
            type="number"
            value={formData.max_latency_ms}
            onChange={(e) => setFormData({ ...formData, max_latency_ms: parseInt(e.target.value) || 5000 })}
          />
          <p className="text-xs text-gray-600">
            Temps de réponse maximum acceptable. Au-delà, le système basculera vers un provider plus rapide.
          </p>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={updatePreferences.isPending}
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          {updatePreferences.isPending ? 'Sauvegarde...' : 'Sauvegarder les préférences'}
        </Button>
      </CardContent>
    </Card>
  );
};
