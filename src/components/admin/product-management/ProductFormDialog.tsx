
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Upload, Save } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useProductTypes } from '@/hooks/useProductTypes';
import { useCompanies } from '@/hooks/useCompanies';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductFormData {
  name: string;
  description: string;
  brand: string;
  price: string;
  currency: string;
  image_url: string;
  purchase_link: string;
  product_type_id: string;
  company_id: string;
  country: string;
  country_availability: string[];
  category: 'auto' | 'health' | 'life' | 'property' | 'business' | 'travel';
}

interface ProductFormDialogProps {
  product?: any;
  onSuccess?: () => void;
  children: React.ReactNode;
}

const CURRENCIES = [
  { code: 'XOF', name: 'Franc CFA (XOF)' },
  { code: 'EUR', name: 'Euro (EUR)' },
  { code: 'USD', name: 'Dollar US (USD)' },
  { code: 'MAD', name: 'Dirham Marocain (MAD)' },
  { code: 'TND', name: 'Dinar Tunisien (TND)' },
  { code: 'EGP', name: 'Livre Égyptienne (EGP)' },
  { code: 'NGN', name: 'Naira Nigérian (NGN)' },
  { code: 'ZAR', name: 'Rand Sud-Africain (ZAR)' },
];

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

const CATEGORIES = [
  { value: 'auto', label: 'Assurance Auto' },
  { value: 'health', label: 'Assurance Santé' },
  { value: 'life', label: 'Assurance Vie' },
  { value: 'property', label: 'Assurance Habitation' },
  { value: 'business', label: 'Assurance Entreprise' },
  { value: 'travel', label: 'Assurance Voyage' }
];

export const ProductFormDialog: React.FC<ProductFormDialogProps> = ({ 
  product, 
  onSuccess, 
  children 
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    brand: '',
    price: '',
    currency: 'XOF',
    image_url: '',
    purchase_link: '',
    product_type_id: '',
    company_id: '',
    country: '',
    country_availability: [],
    category: 'auto'
  });

  const { refetch: refetchProducts } = useProducts();
  const { data: productTypes } = useProductTypes();
  const { data: companies } = useCompanies();

  useEffect(() => {
    if (product && open) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        brand: product.brand || '',
        price: product.price?.toString() || '',
        currency: product.currency || 'XOF',
        image_url: product.image_url || '',
        purchase_link: product.purchase_link || '',
        product_type_id: product.product_type_id || '',
        company_id: product.company_id || '',
        country: product.country || '',
        country_availability: product.country_availability || [],
        category: product.category || 'auto'
      });
    } else if (!product && open) {
      setFormData({
        name: '',
        description: '',
        brand: '',
        price: '',
        currency: 'XOF',
        image_url: '',
        purchase_link: '',
        product_type_id: '',
        company_id: '',
        country: '',
        country_availability: [],
        category: 'auto'
      });
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.company_id || !formData.country || !formData.category) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
      };

      if (product) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);
        
        if (error) throw error;
        toast.success('Produit mis à jour avec succès');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        
        if (error) throw error;
        toast.success('Produit créé avec succès');
      }

      await refetchProducts();
      onSuccess?.();
      setOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const addCountry = (country: string) => {
    if (!formData.country_availability.includes(country)) {
      setFormData(prev => ({
        ...prev,
        country_availability: [...prev.country_availability, country]
      }));
    }
  };

  const removeCountry = (country: string) => {
    setFormData(prev => ({
      ...prev,
      country_availability: prev.country_availability.filter(c => c !== country)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Modifier le produit' : 'Créer un nouveau produit'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du produit *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Assurance Auto Premium"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Marque</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                placeholder="Ex: Assur Afrique"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Pays principal *</Label>
              <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un pays" />
                </SelectTrigger>
                <SelectContent>
                  {AFRICAN_COUNTRIES.map(country => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Prix</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="150.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une devise" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(currency => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_type">Type de produit</Label>
              <Select value={formData.product_type_id} onValueChange={(value) => setFormData(prev => ({ ...prev, product_type_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {productTypes?.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Entreprise *</Label>
              <Select value={formData.company_id} onValueChange={(value) => setFormData(prev => ({ ...prev, company_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une entreprise" />
                </SelectTrigger>
                <SelectContent>
                  {companies?.map(company => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description détaillée du produit..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="image_url">URL de l'image</Label>
              <div className="flex gap-2">
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchase_link">Lien d'achat</Label>
              <Input
                id="purchase_link"
                value={formData.purchase_link}
                onChange={(e) => setFormData(prev => ({ ...prev, purchase_link: e.target.value }))}
                placeholder="https://example.com/buy"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Pays de disponibilité</Label>
            <Select onValueChange={addCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Ajouter un pays" />
              </SelectTrigger>
              <SelectContent>
                {AFRICAN_COUNTRIES.filter(country => !formData.country_availability.includes(country)).map(country => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.country_availability.map(country => (
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Sauvegarde...' : (product ? 'Mettre à jour' : 'Créer')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
