
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdCampaign {
  id: string;
  name: string;
  description?: string | null;
  campaign_type: 'banner' | 'popup' | 'sidebar' | 'native';
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  target_countries: string[];
  target_sectors: string[];
  creative_assets: Record<string, any>;
  performance_metrics: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useAdvertisements = () => {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('advertisement_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData: AdCampaign[] = (data || []).map(campaign => ({
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        campaign_type: campaign.campaign_type as 'banner' | 'popup' | 'sidebar' | 'native',
        status: campaign.status as 'draft' | 'active' | 'paused' | 'completed',
        budget: campaign.budget,
        start_date: campaign.start_date,
        end_date: campaign.end_date,
        target_countries: campaign.target_countries,
        target_sectors: campaign.target_sectors,
        creative_assets: campaign.creative_assets as Record<string, any>,
        performance_metrics: campaign.performance_metrics as Record<string, any>,
        created_at: campaign.created_at,
        updated_at: campaign.updated_at
      }));
      
      setCampaigns(transformedData);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les campagnes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (campaignData: Omit<AdCampaign, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('advertisement_campaigns')
        .insert([campaignData])
        .select()
        .single();

      if (error) throw error;

      const transformedData: AdCampaign = {
        id: data.id,
        name: data.name,
        description: data.description,
        campaign_type: data.campaign_type as 'banner' | 'popup' | 'sidebar' | 'native',
        status: data.status as 'draft' | 'active' | 'paused' | 'completed',
        budget: data.budget,
        start_date: data.start_date,
        end_date: data.end_date,
        target_countries: data.target_countries,
        target_sectors: data.target_sectors,
        creative_assets: data.creative_assets as Record<string, any>,
        performance_metrics: data.performance_metrics as Record<string, any>,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setCampaigns(prev => [transformedData, ...prev]);
      toast({
        title: "Succès",
        description: "Campagne créée avec succès"
      });

      return transformedData;
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la campagne",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateCampaign = async (id: string, updates: Partial<AdCampaign>) => {
    try {
      const { data, error } = await supabase
        .from('advertisement_campaigns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const transformedData: AdCampaign = {
        id: data.id,
        name: data.name,
        description: data.description,
        campaign_type: data.campaign_type as 'banner' | 'popup' | 'sidebar' | 'native',
        status: data.status as 'draft' | 'active' | 'paused' | 'completed',
        budget: data.budget,
        start_date: data.start_date,
        end_date: data.end_date,
        target_countries: data.target_countries,
        target_sectors: data.target_sectors,
        creative_assets: data.creative_assets as Record<string, any>,
        performance_metrics: data.performance_metrics as Record<string, any>,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setCampaigns(prev => prev.map(campaign => campaign.id === id ? transformedData : campaign));
      toast({
        title: "Succès",
        description: "Campagne mise à jour"
      });

      return transformedData;
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la campagne",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      const { error } = await supabase
        .from('advertisement_campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
      toast({
        title: "Succès",
        description: "Campagne supprimée"
      });
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la campagne",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return {
    campaigns,
    loading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    refetch: fetchCampaigns
  };
};
