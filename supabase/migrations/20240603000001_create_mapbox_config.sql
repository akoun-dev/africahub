
-- Table pour stocker la configuration Mapbox
CREATE TABLE IF NOT EXISTS public.mapbox_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- RLS policies
ALTER TABLE public.mapbox_config ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent gérer la configuration Mapbox
CREATE POLICY "Admin can manage mapbox config" ON public.mapbox_config
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_mapbox_config_active ON public.mapbox_config(is_active);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION public.update_mapbox_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_mapbox_config_updated_at
  BEFORE UPDATE ON public.mapbox_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_mapbox_config_updated_at();
