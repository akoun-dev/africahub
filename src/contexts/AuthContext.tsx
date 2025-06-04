
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any; userRoles?: string[] }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Alias pour signOut
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

// Fonction de secours pour identifier les admins connus
const isKnownAdmin = (email: string): boolean => {
  const knownAdmins = [
    'admin@mobisoft.ci',
    'admin@africahub.com',
    'superadmin@africahub.com'
  ];
  return knownAdmins.includes(email.toLowerCase());
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (mounted) {
          console.log('Auth state change:', event, session?.user?.id);
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        console.log('Initial session:', session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const checkUserRoles = async (userId: string): Promise<string[]> => {
    try {
      console.log('🔍 AuthContext: Checking roles for user:', userId);
      
      const { data, error } = await supabase.rpc('get_user_roles', {
        _user_id: userId
      });

      if (error) {
        console.error('❌ AuthContext: Error fetching roles:', error);
        return [];
      }

      console.log('✅ AuthContext: Roles fetched:', data);
      return data || [];
    } catch (error) {
      console.error('💥 AuthContext: Unexpected error:', error);
      return [];
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 AuthContext: Starting sign in process for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ AuthContext: Sign in error:', error);
        return { error };
      }

      if (data.user) {
        console.log('✅ AuthContext: Sign in successful, checking roles...');
        
        // Vérifier les rôles de l'utilisateur
        const userRoles = await checkUserRoles(data.user.id);
        
        // Vérification de secours pour les admins connus
        const isFallbackAdmin = isKnownAdmin(email);
        const finalRoles = userRoles.length > 0 ? userRoles : (isFallbackAdmin ? ['admin'] : []);
        
        console.log('🎯 AuthContext: Final roles determined:', {
          email,
          roles: finalRoles,
          isFallback: userRoles.length === 0 && isFallbackAdmin
        });

        return { error: null, userRoles: finalRoles };
      }

      return { error: null };
    } catch (error) {
      console.error('💥 AuthContext: Unexpected sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Alias pour compatibilité
  const logout = signOut;

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
