
-- Create databases for each microservice
CREATE DATABASE ai_recommendations;
CREATE DATABASE notifications;
CREATE DATABASE analytics;
CREATE DATABASE content_management;

-- Connect to ai_recommendations database
\c ai_recommendations;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create tables for AI recommendations service
CREATE TABLE IF NOT EXISTS ai_recommendations_v2 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    recommendation_type TEXT NOT NULL,
    confidence_score NUMERIC NOT NULL,
    reasoning JSONB NOT NULL,
    context_factors JSONB DEFAULT '{}',
    insurance_type TEXT NOT NULL,
    is_viewed BOOLEAN DEFAULT FALSE,
    is_clicked BOOLEAN DEFAULT FALSE,
    is_purchased BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    brand TEXT,
    price NUMERIC,
    currency TEXT DEFAULT 'USD',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    session_id TEXT NOT NULL,
    product_id UUID,
    interaction_type TEXT NOT NULL,
    insurance_type TEXT,
    duration_seconds INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_ai_recommendations_user_id ON ai_recommendations_v2(user_id);
CREATE INDEX idx_ai_recommendations_insurance_type ON ai_recommendations_v2(insurance_type);
CREATE INDEX idx_ai_recommendations_expires_at ON ai_recommendations_v2(expires_at);
CREATE INDEX idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX idx_user_interactions_created_at ON user_interactions(created_at);

-- Insert sample data
INSERT INTO products (name, brand, price, currency, description) VALUES
('Assurance Auto Premium', 'Allianz', 850, 'EUR', 'Couverture complète pour véhicules'),
('Protection Habitation', 'AXA', 450, 'EUR', 'Assurance habitation multirisque'),
('Santé Famille+', 'Sanlam', 1200, 'EUR', 'Couverture santé familiale complète'),
('Auto Jeune Conducteur', 'NSIA', 650, 'EUR', 'Assurance spéciale jeunes conducteurs'),
('Habitation Étudiant', 'Saham', 180, 'EUR', 'Assurance logement étudiant');
