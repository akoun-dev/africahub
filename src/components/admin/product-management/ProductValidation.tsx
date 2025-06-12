
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

interface ValidationRule {
  id: string;
  field: string;
  rule: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  valid: boolean;
}

interface ProductValidationProps {
  product: any;
}

export const ProductValidation: React.FC<ProductValidationProps> = ({ product }) => {
  const validateProduct = (product: any): ValidationRule[] => {
    const rules: ValidationRule[] = [];

    // Validation du nom
    rules.push({
      id: 'name-required',
      field: 'name',
      rule: 'required',
      severity: 'error',
      message: 'Le nom du produit est obligatoire',
      valid: Boolean(product.name && product.name.trim().length > 0)
    });

    rules.push({
      id: 'name-length',
      field: 'name',
      rule: 'minLength',
      severity: 'warning',
      message: 'Le nom devrait faire au moins 3 caractères',
      valid: Boolean(product.name && product.name.trim().length >= 3)
    });

    // Validation du prix
    rules.push({
      id: 'price-positive',
      field: 'price',
      rule: 'positive',
      severity: 'error',
      message: 'Le prix doit être positif',
      valid: Boolean(product.price === null || product.price === undefined || product.price > 0)
    });

    // Validation de la devise
    rules.push({
      id: 'currency-required',
      field: 'currency',
      rule: 'required',
      severity: 'warning',
      message: 'La devise devrait être spécifiée',
      valid: Boolean(product.currency)
    });

    // Validation du type de produit
    rules.push({
      id: 'product-type-required',
      field: 'product_type_id',
      rule: 'required',
      severity: 'error',
      message: 'Le type de produit est obligatoire',
      valid: Boolean(product.product_type_id)
    });

    // Validation de l'entreprise
    rules.push({
      id: 'company-required',
      field: 'company_id',
      rule: 'required',
      severity: 'error',
      message: 'L\'entreprise est obligatoire',
      valid: Boolean(product.company_id)
    });

    // Validation de la disponibilité pays
    rules.push({
      id: 'countries-required',
      field: 'country_availability',
      rule: 'required',
      severity: 'warning',
      message: 'Au moins un pays de disponibilité devrait être spécifié',
      valid: Boolean(product.country_availability && product.country_availability.length > 0)
    });

    // Validation de l'URL d'image
    if (product.image_url) {
      const urlPattern = /^https?:\/\/.+/;
      rules.push({
        id: 'image-url-format',
        field: 'image_url',
        rule: 'url',
        severity: 'warning',
        message: 'L\'URL de l\'image devrait être valide (http/https)',
        valid: urlPattern.test(product.image_url)
      });
    }

    // Validation du lien d'achat
    if (product.purchase_link) {
      const urlPattern = /^https?:\/\/.+/;
      rules.push({
        id: 'purchase-link-format',
        field: 'purchase_link',
        rule: 'url',
        severity: 'warning',
        message: 'Le lien d\'achat devrait être valide (http/https)',
        valid: urlPattern.test(product.purchase_link)
      });
    }

    // Validation de la description
    rules.push({
      id: 'description-length',
      field: 'description',
      rule: 'minLength',
      severity: 'info',
      message: 'Une description plus détaillée améliorerait la qualité du produit',
      valid: Boolean(product.description && product.description.trim().length >= 50)
    });

    return rules;
  };

  const validationRules = validateProduct(product);
  const errors = validationRules.filter(rule => !rule.valid && rule.severity === 'error');
  const warnings = validationRules.filter(rule => !rule.valid && rule.severity === 'warning');
  const infos = validationRules.filter(rule => !rule.valid && rule.severity === 'info');
  const passed = validationRules.filter(rule => rule.valid);

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'info':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Validation du produit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Badge variant="destructive">{errors.length} erreurs</Badge>
          <Badge variant="secondary">{warnings.length} avertissements</Badge>
          <Badge variant="outline">{infos.length} suggestions</Badge>
          <Badge variant="default">{passed.length} validations réussies</Badge>
        </div>

        {errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-red-700">Erreurs à corriger</h4>
            {errors.map(rule => (
              <div key={rule.id} className="flex items-center gap-2 text-sm">
                {getIcon(rule.severity)}
                <span>{rule.message}</span>
              </div>
            ))}
          </div>
        )}

        {warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-yellow-700">Avertissements</h4>
            {warnings.map(rule => (
              <div key={rule.id} className="flex items-center gap-2 text-sm">
                {getIcon(rule.severity)}
                <span>{rule.message}</span>
              </div>
            ))}
          </div>
        )}

        {infos.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-blue-700">Suggestions</h4>
            {infos.map(rule => (
              <div key={rule.id} className="flex items-center gap-2 text-sm">
                {getIcon(rule.severity)}
                <span>{rule.message}</span>
              </div>
            ))}
          </div>
        )}

        {errors.length === 0 && warnings.length === 0 && (
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Toutes les validations essentielles sont réussies</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
