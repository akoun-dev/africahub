-- Migration: Création de la table des profils utilisateurs
-- Description: Table principale pour stocker les profils utilisateurs avec rôles et statuts
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- Création de l'énumération pour les rôles utilisateurs
CREATE TYPE user_role AS ENUM ('user', 'merchant', 'manager', 'admin');

-- Création de l'énumération pour les statuts utilisateurs
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');

-- Création de la table des profils utilisateurs
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(20),
    country VARCHAR(100),
    city VARCHAR(100),
    role user_role DEFAULT 'user' NOT NULL,
    status user_status DEFAULT 'active' NOT NULL,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Création des index pour optimiser les performances
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_status ON user_profiles(status);
CREATE INDEX idx_user_profiles_country ON user_profiles(country);
CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Commentaires sur la table et les colonnes
COMMENT ON TABLE user_profiles IS 'Table des profils utilisateurs AfricaHub';
COMMENT ON COLUMN user_profiles.id IS 'Identifiant unique du profil';
COMMENT ON COLUMN user_profiles.user_id IS 'Référence vers auth.users';
COMMENT ON COLUMN user_profiles.first_name IS 'Prénom de l''utilisateur';
COMMENT ON COLUMN user_profiles.last_name IS 'Nom de famille de l''utilisateur';
COMMENT ON COLUMN user_profiles.avatar_url IS 'URL de l''avatar utilisateur';
COMMENT ON COLUMN user_profiles.phone IS 'Numéro de téléphone';
COMMENT ON COLUMN user_profiles.country IS 'Pays de résidence';
COMMENT ON COLUMN user_profiles.city IS 'Ville de résidence';
COMMENT ON COLUMN user_profiles.role IS 'Rôle de l''utilisateur dans le système';
COMMENT ON COLUMN user_profiles.status IS 'Statut actuel du compte utilisateur';
COMMENT ON COLUMN user_profiles.preferences IS 'Préférences utilisateur (JSON)';
COMMENT ON COLUMN user_profiles.created_at IS 'Date de création du profil';
COMMENT ON COLUMN user_profiles.updated_at IS 'Date de dernière mise à jour';
COMMENT ON COLUMN user_profiles.last_login IS 'Date de dernière connexion';
