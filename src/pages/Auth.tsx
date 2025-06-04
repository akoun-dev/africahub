
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const determineRedirectPath = (userRoles: string[]): string => {
    console.log('🎯 Auth: Determining redirect path for roles:', userRoles);
    
    // Vérifier si l'utilisateur a des rôles administratifs
    const adminRoles = ['super-admin', 'admin', 'moderator'];
    const hasAdminRole = userRoles.some(role => adminRoles.includes(role));
    
    if (hasAdminRole) {
      console.log('👑 Auth: User has admin role, redirecting to /admin');
      return '/admin';
    }
    
    console.log('👤 Auth: Regular user, redirecting to /dashboard');
    return '/dashboard';
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('🔐 Auth: Starting sign in for:', email);
      
      const result = await signIn(email, password);
      
      if (result.error) {
        console.error('❌ Auth: Sign in failed:', result.error);
        
        // Gestion des erreurs spécifiques
        if (result.error.message.includes('Invalid login credentials')) {
          toast.error('Email ou mot de passe incorrect');
        } else if (result.error.message.includes('Email not confirmed')) {
          toast.error('Veuillez confirmer votre email avant de vous connecter');
        } else {
          toast.error('Erreur de connexion: ' + result.error.message);
        }
        return;
      }

      // Connexion réussie
      console.log('✅ Auth: Sign in successful');
      toast.success('Connexion réussie!');
      
      // Déterminer la redirection basée sur les rôles
      const redirectPath = determineRedirectPath(result.userRoles || []);
      
      console.log('🚀 Auth: Redirecting to:', redirectPath);
      navigate(redirectPath);
      
    } catch (error) {
      console.error('💥 Auth: Unexpected error during sign in:', error);
      toast.error('Une erreur inattendue s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('📝 Auth: Starting sign up for:', email);
      
      const result = await signUp(email, password, firstName, lastName);
      
      if (result.error) {
        console.error('❌ Auth: Sign up failed:', result.error);
        
        // Gestion des erreurs spécifiques
        if (result.error.message.includes('User already registered')) {
          toast.error('Un compte existe déjà avec cet email');
        } else {
          toast.error('Erreur lors de la création du compte: ' + result.error.message);
        }
        return;
      }

      console.log('✅ Auth: Sign up successful');
      toast.success('Compte créé avec succès! Vérifiez votre email pour confirmer votre compte.');
      
      // Redirection vers le dashboard pour les nouveaux utilisateurs
      navigate('/dashboard');
      
    } catch (error) {
      console.error('💥 Auth: Unexpected error during sign up:', error);
      toast.error('Une erreur inattendue s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Bienvenue sur AfricaHub
          </CardTitle>
          <CardDescription>
            Connectez-vous ou créez votre compte pour accéder à la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      Prénom
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Nom
                    </label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="signupEmail" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signupEmail"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="signupPassword" className="text-sm font-medium">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signupPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Création...' : 'Créer un compte'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
