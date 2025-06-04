
export interface UserWithRoles {
  id: string;
  email: string;
  roles: string[];
  created_at: string;
}

// Type pour les rôles valides selon Supabase (mis à jour)
export type ValidRole = 'user' | 'moderator' | 'developer' | 'admin';

export const VALID_ROLES: ValidRole[] = ['user', 'moderator', 'developer', 'admin'];

export const isValidRole = (role: string): role is ValidRole => {
  return VALID_ROLES.includes(role as ValidRole);
};
