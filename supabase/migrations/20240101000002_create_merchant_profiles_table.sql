-- Migration: Création de la table des profils marchands
-- Description: Table pour stocker les informations business des marchands
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- Création de l'énumération pour les statuts de vérification
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');

-- Création de la table des profils marchands
CREATE TABLE IF NOT EXISTS merchant_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    business_name VARCHAR(200) NOT NULL,
    business_sector VARCHAR(100) NOT NULL,
    business_type VARCHAR(100) NOT NULL,
    business_description TEXT,
    business_address TEXT,
    business_phone VARCHAR(20),
    business_email VARCHAR(255),
    business_website VARCHAR(255),
    tax_number VARCHAR(50),
    verification_status verification_status DEFAULT 'pending' NOT NULL,
    verification_documents JSONB DEFAULT '[]',
    verification_notes TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Création des index pour optimiser les performances
CREATE INDEX idx_merchant_profiles_user_id ON merchant_profiles(user_id);
CREATE INDEX idx_merchant_profiles_business_sector ON merchant_profiles(business_sector);
CREATE INDEX idx_merchant_profiles_business_type ON merchant_profiles(business_type);
CREATE INDEX idx_merchant_profiles_verification_status ON merchant_profiles(verification_status);
CREATE INDEX idx_merchant_profiles_created_at ON merchant_profiles(created_at);
CREATE INDEX idx_merchant_profiles_business_name ON merchant_profiles(business_name);

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_merchant_profiles_updated_at
    BEFORE UPDATE ON merchant_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour mettre à jour la date de vérification
CREATE OR REPLACE FUNCTION update_verification_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    -- Si le statut passe à 'verified', mettre à jour verified_at
    IF NEW.verification_status = 'verified' AND OLD.verification_status != 'verified' THEN
        NEW.verified_at = NOW();
    END IF;
    
    -- Si le statut change de 'verified' à autre chose, réinitialiser verified_at
    IF NEW.verification_status != 'verified' AND OLD.verification_status = 'verified' THEN
        NEW.verified_at = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour gérer automatiquement les dates de vérification
CREATE TRIGGER update_merchant_verification_timestamp
    BEFORE UPDATE ON merchant_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_verification_timestamp();

-- Commentaires sur la table et les colonnes
COMMENT ON TABLE merchant_profiles IS 'Table des profils marchands AfricaHub';
COMMENT ON COLUMN merchant_profiles.id IS 'Identifiant unique du profil marchand';
COMMENT ON COLUMN merchant_profiles.user_id IS 'Référence vers auth.users';
COMMENT ON COLUMN merchant_profiles.business_name IS 'Nom de l''entreprise';
COMMENT ON COLUMN merchant_profiles.business_sector IS 'Secteur d''activité';
COMMENT ON COLUMN merchant_profiles.business_type IS 'Type d''entreprise dans le secteur';
COMMENT ON COLUMN merchant_profiles.business_description IS 'Description de l''activité';
COMMENT ON COLUMN merchant_profiles.business_address IS 'Adresse de l''entreprise';
COMMENT ON COLUMN merchant_profiles.business_phone IS 'Téléphone professionnel';
COMMENT ON COLUMN merchant_profiles.business_email IS 'Email professionnel';
COMMENT ON COLUMN merchant_profiles.business_website IS 'Site web de l''entreprise';
COMMENT ON COLUMN merchant_profiles.tax_number IS 'Numéro d''identification fiscale';
COMMENT ON COLUMN merchant_profiles.verification_status IS 'Statut de vérification du marchand';
COMMENT ON COLUMN merchant_profiles.verification_documents IS 'Documents de vérification (JSON)';
COMMENT ON COLUMN merchant_profiles.verification_notes IS 'Notes de vérification';
COMMENT ON COLUMN merchant_profiles.verified_at IS 'Date de vérification';
COMMENT ON COLUMN merchant_profiles.verified_by IS 'Utilisateur qui a effectué la vérification';
