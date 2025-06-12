
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Copy, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductDuplicationDialogProps {
  product: any;
  onSuccess?: () => void;
  children: React.ReactNode;
}

const AFRICAN_COUNTRIES = [
  'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon', 'Cape Verde',
  'Central African Republic', 'Chad', 'Comoros', 'Congo', 'Democratic Republic of Congo', 
  'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon',
  'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia',
  'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique',
  'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles',
  'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo',
  'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'
];

export const ProductDuplicationDialog: React.FC<ProductDuplicationDialogProps> = ({
  product,
  onSuccess,
  children
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetCountries, setTargetCountries] = useState<string[]>([]);
  const [priceMultiplier, setPriceMultiplier] = useState('1.0');

  const addCountry = (country: string) => {
    if (!targetCountries.includes(country)) {
      setTargetCountries(prev => [...prev, country]);
    }
  };

  const removeCountry = (country: string) => {
    setTargetCountries(prev => prev.filter(c => c !== country));
  };

  const handleDuplicate = async () => {
    if (targetCountries.length === 0) {
      toast.error('Veuillez sélectionner au moins un pays');
      return;
    }

    setLoading(true);
    try {
      const multiplier = parseFloat(priceMultiplier) || 1.0;
      const duplicatedProducts = targetCountries.map(country => ({
        ...product,
        id: undefined, // Remove ID to create new records
        name: `${product.name} - ${country}`,
        price: product.price ? product.price * multiplier : null,
        country_availability: [country],
        created_at: undefined,
        updated_at: undefined
      }));

      const { error } = await supabase
        .from('products')
        .insert(duplicatedProducts);

      if (error) throw error;

      toast.success(`${targetCountries.length} produit(s) dupliqué(s) avec succès`);
      onSuccess?.();
      setOpen(false);
      setTargetCountries([]);
      setPriceMultiplier('1.0');
    } catch (error) {
      console.error('Error duplicating product:', error);
      toast.error('Erreur lors de la duplication');
    } finally {
      setLoading(false);
    }
  };

  const availableCountries = AFRICAN_COUNTRIES.filter(country => 
    !product.country_availability?.includes(country) && !targetCountries.includes(country)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dupliquer le produit vers d'autres pays</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Produit à dupliquer: <strong>{product.name}</strong>
            </p>
            <p className="text-sm text-gray-600">
              Actuellement disponible dans: {product.country_availability?.join(', ') || 'Aucun pays'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="multiplier">Multiplicateur de prix (optionnel)</Label>
            <Select value={priceMultiplier} onValueChange={setPriceMultiplier}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.8">0.8x (20% moins cher)</SelectItem>
                <SelectItem value="0.9">0.9x (10% moins cher)</SelectItem>
                <SelectItem value="1.0">1.0x (même prix)</SelectItem>
                <SelectItem value="1.1">1.1x (10% plus cher)</SelectItem>
                <SelectItem value="1.2">1.2x (20% plus cher)</SelectItem>
                <SelectItem value="1.5">1.5x (50% plus cher)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Pays cibles</Label>
            <Select onValueChange={addCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un pays" />
              </SelectTrigger>
              <SelectContent>
                {availableCountries.map(country => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {targetCountries.map(country => (
                <Badge key={country} variant="secondary" className="flex items-center gap-1">
                  {country}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeCountry(country)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleDuplicate} 
              disabled={loading || targetCountries.length === 0}
            >
              <Copy className="h-4 w-4 mr-2" />
              {loading ? 'Duplication...' : `Dupliquer vers ${targetCountries.length} pays`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
