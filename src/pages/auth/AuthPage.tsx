/**
 * Page d'authentification unifiée pour AfricaHub
 * Gère la connexion et l'inscription des utilisateurs simples et marchands
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SignUpForms } from '@/components/auth/SignUpForms';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Mail,
  Lock,
  LogIn,
  UserPlus,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuthPage: React.FC = () => {
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user && !loading) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await signIn(loginData.email, loginData.password);

      if (result.error) {
        setErrorMessage(
          result.error.message === 'Invalid login credentials'
            ? 'Email ou mot de passe incorrect'
            : result.error.message || 'Erreur lors de la connexion'
        );
      } else {
        setSuccessMessage('Connexion réussie ! Redirection en cours...');
        setTimeout(() => {
          const from = (location.state as any)?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        }, 1000);
      }
    } catch (error) {
      setErrorMessage('Erreur inattendue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSuccess = () => {
    setSuccessMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    setActiveTab('signin');
  };

  const handleSignUpError = (error: string) => {
    setErrorMessage(error);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-marineBlue-50 to-brandSky-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-marineBlue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-marineBlue-50 to-brandSky-50">
      <div className="container mx-auto px-4 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-marineBlue-600 hover:text-marineBlue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AfricaHub</h1>
            <p className="text-gray-600">
              Votre plateforme de comparaison de produits en Afrique
            </p>
          </div>

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

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Connexion
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Inscription
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Se connecter</CardTitle>
                  <CardDescription>
                    Accédez à votre compte AfricaHub
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <Label htmlFor="signin-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signin-email"
                          type="email"
                          className="pl-10"
                          placeholder="votre@email.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="signin-password">Mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signin-password"
                          type={showPassword ? 'text' : 'password'}
                          className="pl-10 pr-10"
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-marineBlue-600 hover:bg-marineBlue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Connexion en cours...
                        </>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4 mr-2" />
                          Se connecter
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <SignUpForms
                onSuccess={handleSignUpSuccess}
                onError={handleSignUpError}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;