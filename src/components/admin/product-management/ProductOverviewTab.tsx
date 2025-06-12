
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Copy, Edit, Trash2, ExternalLink } from 'lucide-react';
import { ProductFilters } from './ProductFilters';
import { ProductCard } from './ProductCard';
import { ProductFormDialog } from './ProductFormDialog';
import { ProductDuplicationDialog } from './ProductDuplicationDialog';
import { useProducts } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductOverviewTabProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSector: string;
  onSectorChange: (value: string) => void;
}

export const ProductOverviewTab: React.FC<ProductOverviewTabProps> = ({
  searchTerm,
  onSearchChange,
  selectedSector,
  onSectorChange
}) => {
  const { data: products, refetch } = useProducts();

  const handleDelete = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      toast.success('Produit supprimé avec succès');
      refetch();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // TODO: Add sector filtering when product-sector relationship is available
    const matchesSector = selectedSector === 'all'; // For now, show all
    
    return matchesSearch && matchesSector;
  }) || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          selectedSector={selectedSector}
          onSectorChange={onSectorChange}
        />
        
        <ProductFormDialog onSuccess={refetch}>
          <Button className="bg-afroGreen hover:bg-afroGreen/90">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Produit
          </Button>
        </ProductFormDialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="group relative">
            <ProductCard product={{
              id: product.id,
              name: product.name,
              company: 'Entreprise', // TODO: Join with companies table
              sector: 'assurance', // TODO: Get from product type
              basePrice: product.price || 0,
              countries: product.country_availability || [],
              status: product.is_active ? 'active' : 'inactive',
              versions: 1, // TODO: Calculate actual versions
              lastUpdated: product.updated_at
            }} />
            
            {/* Action buttons overlay */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-1">
                {product.purchase_link && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-white/90"
                    onClick={() => window.open(product.purchase_link, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
                
                <ProductDuplicationDialog product={product} onSuccess={refetch}>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-white/90"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </ProductDuplicationDialog>
                
                <ProductFormDialog product={product} onSuccess={refetch}>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-white/90"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </ProductFormDialog>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  className="bg-white/90 text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Aucun produit trouvé</p>
          <ProductFormDialog onSuccess={refetch}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Créer le premier produit
            </Button>
          </ProductFormDialog>
        </div>
      )}
    </div>
  );
};
