
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import {
  UserProfile,
  UserProfileType,
  SimpleUserRegistration,
  MerchantRegistration,
  PROFILE_PERMISSIONS
} from '@/types/user-profiles';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  permissions: string[];

  // Méthodes d'authentification
  signIn: (email: string, password: string) => Promise<{ error: any; profile?: UserProfile }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Alias pour signOut

  // Méthodes d'inscription
  signUpSimpleUser: (data: SimpleUserRegistration) => Promise<{ error: any; profile?: UserProfile }>;
  signUpMerchant: (data: MerchantRegistration) => Promise<{ error: any; profile?: UserProfile }>;

  // Méthodes utilitaires
  hasPermission: (permission: string) => boolean;
  isProfileType: (type: UserProfileType) => boolean;
  canAccessRoute: (requiredType: UserProfileType) => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Récupère le profil utilisateur depuis la base de données
 */
const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('❌ Erreur lors de la récupération du profil:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('💥 Erreur inattendue lors de la récupération du profil:', error);
    return null;
  }
};

/**
 * Crée un profil utilisateur dans la base de données
 */
const createUserProfile = async (
  userId: string,
  profileType: UserProfileType,
  additionalData: Partial<UserProfile> = {}
): Promise<UserProfile | null> => {
  try {
    const profileData = {
      user_id: userId,
      profile_type: profileType,
      status: 'active' as const,
      ...additionalData
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur lors de la création du profil:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('💥 Erreur inattendue lors de la création du profil:', error);
    return null;
  }
};

/**
 * Fonction de secours pour identifier les admins connus
 */
const isKnownAdmin = (email: string): boolean => {
  const knownAdmins = [
    'admin@mobisoft.ci',
    'admin@africahub.com',
    'superadmin@africahub.com',
    'aboa.akoun40@gmail.com' // Ajout de l'email du développeur
  ];
  return knownAdmins.includes(email.toLowerCase());
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<string[]>([]);

  /**
   * Charge le profil utilisateur et ses permissions
   */
  const loadUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('🔍 AuthContext: Chargement du profil pour:', userId);

      let userProfile = await fetchUserProfile(userId);

      // Si pas de profil trouvé, vérifier si c'est un admin connu
      if (!userProfile && user?.email && isKnownAdmin(user.email)) {
        console.log('🔧 AuthContext: Création du profil admin pour:', user.email);
        userProfile = await createUserProfile(userId, 'administrator', {
          first_name: 'Administrateur',
          last_name: 'Système',
          display_name: 'Admin'
        });
      }

      if (userProfile) {
        setProfile(userProfile);

        // Charger les permissions basées sur le type de profil
        const userPermissions = PROFILE_PERMISSIONS[userProfile.profile_type] || [];
        setPermissions(userPermissions);

        console.log('✅ AuthContext: Profil chargé:', {
          type: userProfile.profile_type,
          permissions: userPermissions
        });
      }

      return userProfile;
    } catch (error) {
      console.error('💥 AuthContext: Erreur lors du chargement du profil:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          console.log('Auth state change:', event, session?.user?.id);
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            await loadUserProfile(session.user.id);
          } else {
            setProfile(null);
            setPermissions([]);
          }

          setLoading(false);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (mounted) {
        console.log('Initial session:', session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await loadUserProfile(session.user.id);
        }

        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Rafraîchit le profil utilisateur
   */
  const refreshProfile = async (): Promise<void> => {
    if (user?.id) {
      await loadUserProfile(user.id);
    }
  };

  /**
   * Vérifie si l'utilisateur a une permission spécifique
   */
  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission) || permissions.includes('full_access');
  };

  /**
   * Vérifie si l'utilisateur a un type de profil spécifique
   */
  const isProfileType = (type: UserProfileType): boolean => {
    return profile?.profile_type === type;
  };

  /**
   * Vérifie si l'utilisateur peut accéder à une route nécessitant un type de profil
   */
  const canAccessRoute = (requiredType: UserProfileType): boolean => {
    if (!profile) return false;

    // Les administrateurs ont accès à tout
    if (profile.profile_type === 'administrator') return true;

    // Vérification exacte du type
    return profile.profile_type === requiredType;
  };

  /**
   * Connexion utilisateur
   */
  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 AuthContext: Connexion en cours pour:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ AuthContext: Erreur de connexion:', error);
        return { error };
      }

      if (data.user) {
        console.log('✅ AuthContext: Connexion réussie, chargement du profil...');

        // Le profil sera chargé automatiquement par le useEffect
        const userProfile = await loadUserProfile(data.user.id);

        return { error: null, profile: userProfile };
      }

      return { error: null };
    } catch (error) {
      console.error('💥 AuthContext: Erreur inattendue lors de la connexion:', error);
      return { error };
    }
  };

  /**
   * Inscription d'un utilisateur simple
   */
  const signUpSimpleUser = async (data: SimpleUserRegistration) => {
    try {
      console.log('📝 AuthContext: Inscription utilisateur simple pour:', data.email);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
          },
        },
      });

      if (authError) {
        console.error('❌ AuthContext: Erreur d\'inscription:', authError);
        return { error: authError };
      }

      if (authData.user) {
        // Créer le profil utilisateur
        const userProfile = await createUserProfile(authData.user.id, 'simple_user', {
          first_name: data.first_name,
          last_name: data.last_name,
          display_name: `${data.first_name} ${data.last_name}`,
          phone: data.phone,
          country_code: data.country_code,
          city: data.city
        });

        console.log('✅ AuthContext: Profil utilisateur simple créé');
        return { error: null, profile: userProfile };
      }

      return { error: null };
    } catch (error) {
      console.error('💥 AuthContext: Erreur inattendue lors de l\'inscription:', error);
      return { error };
    }
  };

  /**
   * Inscription d'un marchand
   */
  const signUpMerchant = async (data: MerchantRegistration) => {
    try {
      console.log('🏪 AuthContext: Inscription marchand pour:', data.email);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
          },
        },
      });

      if (authError) {
        console.error('❌ AuthContext: Erreur d\'inscription marchand:', authError);
        return { error: authError };
      }

      if (authData.user) {
        // Créer le profil marchand
        const userProfile = await createUserProfile(authData.user.id, 'merchant', {
          first_name: data.first_name,
          last_name: data.last_name,
          display_name: data.company_name || `${data.first_name} ${data.last_name}`,
          phone: data.phone,
          country_code: data.country_code,
          city: data.city,
          address: data.address,
          company_name: data.company_name,
          company_description: data.company_description,
          business_license: data.business_license,
          tax_number: data.tax_number
        });

        console.log('✅ AuthContext: Profil marchand créé');
        return { error: null, profile: userProfile };
      }

      return { error: null };
    } catch (error) {
      console.error('💥 AuthContext: Erreur inattendue lors de l\'inscription marchand:', error);
      return { error };
    }
  };

  /**
   * Déconnexion utilisateur
   */
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setPermissions([]);
      console.log('✅ AuthContext: Déconnexion réussie');
    } catch (error) {
      console.error('❌ AuthContext: Erreur lors de la déconnexion:', error);
    }
  };

  // Alias pour compatibilité
  const logout = signOut;

  const value = {
    user,
    session,
    profile,
    loading,
    permissions,
    signIn,
    signOut,
    logout,
    signUpSimpleUser,
    signUpMerchant,
    hasPermission,
    isProfileType,
    canAccessRoute,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
