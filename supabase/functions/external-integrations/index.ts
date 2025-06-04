
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// External integration connectors
class IntegrationManager {
  private supabase: any;

  constructor(supabase: any) {
    this.supabase = supabase;
  }

  async syncIntegration(integrationId: string) {
    const { data: integration, error } = await this.supabase
      .from('external_integrations')
      .select('*')
      .eq('id', integrationId)
      .single();

    if (error || !integration) {
      throw new Error('Integration not found');
    }

    console.log(`Starting sync for integration: ${integration.name}`);

    try {
      let result;
      switch (integration.connector_type) {
        case 'rest_api':
          result = await this.syncRestAPI(integration);
          break;
        case 'graphql':
          result = await this.syncGraphQL(integration);
          break;
        case 'webhook':
          result = await this.setupWebhook(integration);
          break;
        case 'file_import':
          result = await this.importFile(integration);
          break;
        default:
          throw new Error(`Unsupported connector type: ${integration.connector_type}`);
      }

      // Update last sync time
      await this.supabase
        .from('external_integrations')
        .update({ 
          last_sync: new Date().toISOString(),
          sync_status: 'success',
          sync_message: `Synced ${result.count || 0} records`
        })
        .eq('id', integrationId);

      console.log(`Sync completed for ${integration.name}:`, result);
      return result;

    } catch (error) {
      // Log sync error
      await this.supabase
        .from('external_integrations')
        .update({ 
          sync_status: 'error',
          sync_message: error.message
        })
        .eq('id', integrationId);

      throw error;
    }
  }

  async syncRestAPI(integration: any) {
    const { api_endpoint, api_key, config } = integration;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (api_key) {
      headers['Authorization'] = `Bearer ${api_key}`;
    }

    const response = await fetch(api_endpoint, {
      method: 'GET',
      headers,
      // @ts-ignore
      signal: AbortSignal.timeout(config.timeout || 30000)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform and store data based on sector
    const transformedData = await this.transformData(data, integration);
    const storedCount = await this.storeData(transformedData, integration);

    return { count: storedCount, data: transformedData };
  }

  async syncGraphQL(integration: any) {
    const { api_endpoint, api_key, config } = integration;
    
    const query = config.query || `
      query {
        products {
          id
          name
          price
          description
        }
      }
    `;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (api_key) {
      headers['Authorization'] = `Bearer ${api_key}`;
    }

    const response = await fetch(api_endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query }),
      // @ts-ignore
      signal: AbortSignal.timeout(config.timeout || 30000)
    });

    if (!response.ok) {
      throw new Error(`GraphQL HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`GraphQL Errors: ${JSON.stringify(result.errors)}`);
    }

    const transformedData = await this.transformData(result.data, integration);
    const storedCount = await this.storeData(transformedData, integration);

    return { count: storedCount, data: transformedData };
  }

  async setupWebhook(integration: any) {
    // TODO: Implement webhook setup logic
    console.log(`Setting up webhook for ${integration.name}`);
    return { message: 'Webhook configured' };
  }

  async importFile(integration: any) {
    // TODO: Implement file import logic
    console.log(`Importing file for ${integration.name}`);
    return { message: 'File imported' };
  }

  async transformData(rawData: any, integration: any) {
    const { sector_slug, config } = integration;
    
    // Get sector configuration for data mapping
    const { data: sector } = await this.supabase
      .from('sectors')
      .select('id')
      .eq('slug', sector_slug)
      .single();

    if (!sector) {
      throw new Error(`Sector not found: ${sector_slug}`);
    }

    // Transform based on sector-specific rules
    const mapping = config.field_mapping || {};
    const transformed = [];

    const dataArray = Array.isArray(rawData) ? rawData : 
                     rawData.products || rawData.items || rawData.data || [rawData];

    for (const item of dataArray) {
      const transformedItem = {
        name: item[mapping.name] || item.name || item.title,
        description: item[mapping.description] || item.description,
        price: this.parsePrice(item[mapping.price] || item.price),
        currency: item[mapping.currency] || item.currency || 'XOF',
        brand: item[mapping.brand] || item.brand || 'External',
        external_id: item.id || item.external_id,
        sector_slug,
        source_integration: integration.id
      };

      // Only add valid items
      if (transformedItem.name && transformedItem.price) {
        transformed.push(transformedItem);
      }
    }

    return transformed;
  }

  parsePrice(priceValue: any): number | null {
    if (typeof priceValue === 'number') return priceValue;
    if (typeof priceValue === 'string') {
      const parsed = parseFloat(priceValue.replace(/[^\d.-]/g, ''));
      return isNaN(parsed) ? null : parsed;
    }
    return null;
  }

  async storeData(transformedData: any[], integration: any) {
    let storedCount = 0;

    for (const item of transformedData) {
      try {
        // Check if product already exists (by external_id)
        const { data: existing } = await this.supabase
          .from('external_products')
          .select('id')
          .eq('external_id', item.external_id)
          .eq('integration_id', integration.id)
          .single();

        if (existing) {
          // Update existing
          await this.supabase
            .from('external_products')
            .update({
              ...item,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);
        } else {
          // Insert new
          await this.supabase
            .from('external_products')
            .insert([{
              ...item,
              integration_id: integration.id,
              created_at: new Date().toISOString()
            }]);
        }
        
        storedCount++;
      } catch (error) {
        console.error(`Error storing item ${item.external_id}:`, error);
      }
    }

    return storedCount;
  }

  async getAllActiveIntegrations() {
    const { data, error } = await this.supabase
      .from('external_integrations')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;
    return data;
  }

  async syncAllIntegrations() {
    const integrations = await this.getAllActiveIntegrations();
    const results = [];

    for (const integration of integrations) {
      try {
        const result = await this.syncIntegration(integration.id);
        results.push({ 
          integration_id: integration.id, 
          status: 'success', 
          result 
        });
      } catch (error) {
        results.push({ 
          integration_id: integration.id, 
          status: 'error', 
          error: error.message 
        });
      }
    }

    return results;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const integrationManager = new IntegrationManager(supabaseClient);
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const integrationId = url.searchParams.get('integration_id');

    let result;

    switch (action) {
      case 'sync':
        if (integrationId) {
          result = await integrationManager.syncIntegration(integrationId);
        } else {
          result = await integrationManager.syncAllIntegrations();
        }
        break;
      
      case 'list':
        result = await integrationManager.getAllActiveIntegrations();
        break;

      default:
        result = { error: 'Invalid action. Use: sync, list' };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in external-integrations function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
