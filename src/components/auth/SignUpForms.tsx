/**
 * Formulaires d'inscription pour les différents types d'utilisateurs AfricaHub
 * Gère l'inscription des utilisateurs simples et des marchands
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { SimpleUserRegistration, MerchantRegistration } from '@/types/user-profiles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Store, Mail, Lock, Phone, MapPin, Building, FileText, AlertCircle, CheckCircle } from 'lucide-react';

// Schémas de validation
const simpleUserSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string(),
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z.string().optional(),
  country_code: z.string().optional(),
  city: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const merchantSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string(),
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z.string().optional(),
  country_code: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  company_name: z.string().min(2, 'Le nom de l\'entreprise doit contenir au moins 2 caractères'),
  company_description: z.string().optional(),
  business_license: z.string().optional(),
  tax_number: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type SimpleUserFormData = z.infer<typeof simpleUserSchema>;
type MerchantFormData = z.infer<typeof merchantSchema>;

// Liste des pays africains
const AFRICAN_COUNTRIES = [
  { code: 'DZ', name: 'Algérie' },
  { code: 'AO', name: 'Angola' },
  { code: 'BJ', name: 'Bénin' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'CM', name: 'Cameroun' },
  { code: 'CV', name: 'Cap-Vert' },
  { code: 'CF', name: 'République centrafricaine' },
  { code: 'TD', name: 'Tchad' },
  { code: 'KM', name: 'Comores' },
  { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'République démocratique du Congo' },
  { code: 'CI', name: 'Côte d\'Ivoire' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'EG', name: 'Égypte' },
  { code: 'GQ', name: 'Guinée équatoriale' },
  { code: 'ER', name: 'Érythrée' },
  { code: 'ET', name: 'Éthiopie' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambie' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GN', name: 'Guinée' },
  { code: 'GW', name: 'Guinée-Bissau' },
  { code: 'KE', name: 'Kenya' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Libéria' },
  { code: 'LY', name: 'Libye' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'ML', name: 'Mali' },
  { code: 'MR', name: 'Mauritanie' },
  { code: 'MU', name: 'Maurice' },
  { code: 'MA', name: 'Maroc' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'NA', name: 'Namibie' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigéria' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'ST', name: 'Sao Tomé-et-Principe' },
  { code: 'SN', name: 'Sénégal' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SO', name: 'Somalie' },
  { code: 'ZA', name: 'Afrique du Sud' },
  { code: 'SS', name: 'Soudan du Sud' },
  { code: 'SD', name: 'Soudan' },
  { code: 'SZ', name: 'Eswatini' },
  { code: 'TZ', name: 'Tanzanie' },
  { code: 'TG', name: 'Togo' },
  { code: 'TN', name: 'Tunisie' },
  { code: 'UG', name: 'Ouganda' },
  { code: 'ZM', name: 'Zambie' },
  { code: 'ZW', name: 'Zimbabwe' }
];

interface SignUpFormsProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Composant principal des formulaires d'inscription
 */
export const SignUpForms: React.FC<SignUpFormsProps> = ({ onSuccess, onError }) => {
  const { signUpSimpleUser, signUpMerchant } = useAuth();
  const [activeTab, setActiveTab] = useState<'simple' | 'merchant'>('simple');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Formulaire utilisateur simple
  const simpleUserForm = useForm<SimpleUserFormData>({
    resolver: zodResolver(simpleUserSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      first_name: '',
      last_name: '',
      phone: '',
      country_code: '',
      city: '',
    }
  });

  // Formulaire marchand
  const merchantForm = useForm<MerchantFormData>({
    resolver: zodResolver(merchantSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      first_name: '',
      last_name: '',
      phone: '',
      country_code: '',
      city: '',
      address: '',
      company_name: '',
      company_description: '',
      business_license: '',
      tax_number: '',
    }
  });

  /**
   * Soumission du formulaire utilisateur simple
   */
  const handleSimpleUserSubmit = async (data: SimpleUserFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { confirmPassword, ...registrationData } = data;
      const result = await signUpSimpleUser(registrationData as SimpleUserRegistration);

      if (result.error) {
        setErrorMessage(result.error.message || 'Erreur lors de l\'inscription');
        onError?.(result.error.message);
      } else {
        setSuccessMessage('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.');
        simpleUserForm.reset();
        onSuccess?.();
      }
    } catch (error) {
      const errorMsg = 'Erreur inattendue lors de l\'inscription';
      setErrorMessage(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Soumission du formulaire marchand
   */
  const handleMerchantSubmit = async (data: MerchantFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { confirmPassword, ...registrationData } = data;
      const result = await signUpMerchant(registrationData as MerchantRegistration);

      if (result.error) {
        setErrorMessage(result.error.message || 'Erreur lors de l\'inscription');
        onError?.(result.error.message);
      } else {
        setSuccessMessage('Inscription marchand réussie ! Votre compte sera examiné avant activation.');
        merchantForm.reset();
        onSuccess?.();
      }
    } catch (error) {
      const errorMsg = 'Erreur inattendue lors de l\'inscription marchand';
      setErrorMessage(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Rejoignez AfricaHub
          </CardTitle>
          <CardDescription>
            Choisissez votre type de compte pour commencer
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Messages de succès et d'erreur */}
          {successMessage && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {errorMessage && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'simple' | 'merchant')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simple" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Utilisateur Simple
              </TabsTrigger>
              <TabsTrigger value="merchant" className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                Marchand
              </TabsTrigger>
            </TabsList>

            {/* Formulaire Utilisateur Simple */}
            <TabsContent value="simple" className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                  Comparez des produits, laissez des avis et gérez vos favoris
                </p>
              </div>

              <form onSubmit={simpleUserForm.handleSubmit(handleSimpleUserSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="simple-first-name">Prénom *</Label>
                    <Input
                      id="simple-first-name"
                      {...simpleUserForm.register('first_name')}
                      placeholder="Votre prénom"
                    />
                    {simpleUserForm.formState.errors.first_name && (
                      <p className="text-sm text-red-600 mt-1">
                        {simpleUserForm.formState.errors.first_name.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="simple-last-name">Nom *</Label>
                    <Input
                      id="simple-last-name"
                      {...simpleUserForm.register('last_name')}
                      placeholder="Votre nom"
                    />
                    {simpleUserForm.formState.errors.last_name && (
                      <p className="text-sm text-red-600 mt-1">
                        {simpleUserForm.formState.errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="simple-email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="simple-email"
                      type="email"
                      className="pl-10"
                      {...simpleUserForm.register('email')}
                      placeholder="votre@email.com"
                    />
                  </div>
                  {simpleUserForm.formState.errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {simpleUserForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="simple-password">Mot de passe *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="simple-password"
                        type="password"
                        className="pl-10"
                        {...simpleUserForm.register('password')}
                        placeholder="••••••••"
                      />
                    </div>
                    {simpleUserForm.formState.errors.password && (
                      <p className="text-sm text-red-600 mt-1">
                        {simpleUserForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="simple-confirm-password">Confirmer *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="simple-confirm-password"
                        type="password"
                        className="pl-10"
                        {...simpleUserForm.register('confirmPassword')}
                        placeholder="••••••••"
                      />
                    </div>
                    {simpleUserForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1">
                        {simpleUserForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="simple-phone">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="simple-phone"
                        type="tel"
                        className="pl-10"
                        {...simpleUserForm.register('phone')}
                        placeholder="+225 XX XX XX XX"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="simple-country">Pays</Label>
                    <Select onValueChange={(value) => simpleUserForm.setValue('country_code', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre pays" />
                      </SelectTrigger>
                      <SelectContent>
                        {AFRICAN_COUNTRIES.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="simple-city">Ville</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="simple-city"
                      className="pl-10"
                      {...simpleUserForm.register('city')}
                      placeholder="Votre ville"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-marineBlue-600 hover:bg-marineBlue-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Inscription en cours...' : 'Créer mon compte utilisateur'}
                </Button>
              </form>
            </TabsContent>

            {/* Formulaire Marchand */}
            <TabsContent value="merchant" className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                  Gérez votre catalogue, répondez aux avis et développez votre activité
                </p>
              </div>

              <form onSubmit={merchantForm.handleSubmit(handleMerchantSubmit)} className="space-y-4">
                {/* Informations personnelles */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informations personnelles
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="merchant-first-name">Prénom *</Label>
                      <Input
                        id="merchant-first-name"
                        {...merchantForm.register('first_name')}
                        placeholder="Votre prénom"
                      />
                      {merchantForm.formState.errors.first_name && (
                        <p className="text-sm text-red-600 mt-1">
                          {merchantForm.formState.errors.first_name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="merchant-last-name">Nom *</Label>
                      <Input
                        id="merchant-last-name"
                        {...merchantForm.register('last_name')}
                        placeholder="Votre nom"
                      />
                      {merchantForm.formState.errors.last_name && (
                        <p className="text-sm text-red-600 mt-1">
                          {merchantForm.formState.errors.last_name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="merchant-email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="merchant-email"
                        type="email"
                        className="pl-10"
                        {...merchantForm.register('email')}
                        placeholder="votre@email.com"
                      />
                    </div>
                    {merchantForm.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {merchantForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="merchant-password">Mot de passe *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="merchant-password"
                          type="password"
                          className="pl-10"
                          {...merchantForm.register('password')}
                          placeholder="••••••••"
                        />
                      </div>
                      {merchantForm.formState.errors.password && (
                        <p className="text-sm text-red-600 mt-1">
                          {merchantForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="merchant-confirm-password">Confirmer *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="merchant-confirm-password"
                          type="password"
                          className="pl-10"
                          {...merchantForm.register('confirmPassword')}
                          placeholder="••••••••"
                        />
                      </div>
                      {merchantForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-600 mt-1">
                          {merchantForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="merchant-phone">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="merchant-phone"
                        type="tel"
                        className="pl-10"
                        {...merchantForm.register('phone')}
                        placeholder="+225 XX XX XX XX"
                      />
                    </div>
                  </div>
                </div>

                {/* Informations entreprise */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Informations entreprise
                  </h3>

                  <div>
                    <Label htmlFor="merchant-company-name">Nom de l'entreprise *</Label>
                    <div className="relative">
                      <Store className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="merchant-company-name"
                        className="pl-10"
                        {...merchantForm.register('company_name')}
                        placeholder="Nom de votre entreprise"
                      />
                    </div>
                    {merchantForm.formState.errors.company_name && (
                      <p className="text-sm text-red-600 mt-1">
                        {merchantForm.formState.errors.company_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="merchant-company-description">Description de l'entreprise</Label>
                    <Textarea
                      id="merchant-company-description"
                      {...merchantForm.register('company_description')}
                      placeholder="Décrivez votre activité et vos produits..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="merchant-business-license">Numéro de licence</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="merchant-business-license"
                          className="pl-10"
                          {...merchantForm.register('business_license')}
                          placeholder="Licence commerciale"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="merchant-tax-number">Numéro fiscal</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="merchant-tax-number"
                          className="pl-10"
                          {...merchantForm.register('tax_number')}
                          placeholder="Numéro de TVA"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Localisation */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Localisation
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="merchant-country">Pays</Label>
                      <Select onValueChange={(value) => merchantForm.setValue('country_code', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre pays" />
                        </SelectTrigger>
                        <SelectContent>
                          {AFRICAN_COUNTRIES.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="merchant-city">Ville</Label>
                      <Input
                        id="merchant-city"
                        {...merchantForm.register('city')}
                        placeholder="Votre ville"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="merchant-address">Adresse complète</Label>
                    <Textarea
                      id="merchant-address"
                      {...merchantForm.register('address')}
                      placeholder="Adresse de votre entreprise..."
                      rows={2}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Inscription en cours...' : 'Créer mon compte marchand'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
