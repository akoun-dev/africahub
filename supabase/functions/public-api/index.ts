
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// API Rate limiting and authentication
class APIManager {
  private supabase: any;

  constructor(supabase: any) {
    this.supabase = supabase;
  }

  async validateAPIKey(apiKey: string): Promise<any> {
    if (!apiKey || !apiKey.startsWith('ak_')) {
      throw new Error('Invalid API key format');
    }

    const { data: keyData, error } = await this.supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .eq('is_active', true)
      .single();

    if (error || !keyData) {
      throw new Error('Invalid or inactive API key');
    }

    // Check rate limiting
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);

    const { data: recentRequests } = await this.supabase
      .from('api_usage_logs')
      .select('id')
      .eq('api_key_id', keyData.id)
      .gte('created_at', oneMinuteAgo.toISOString());

    if (recentRequests && recentRequests.length >= keyData.rate_limit) {
      throw new Error('Rate limit exceeded');
    }

    return keyData;
  }

  async logAPIUsage(keyData: any, endpoint: string, method: string, statusCode: number, responseTime: number) {
    await this.supabase
      .from('api_usage_logs')
      .insert([{
        api_key_id: keyData.id,
        endpoint,
        method,
        status_code: statusCode,
        response_time: responseTime,
        created_at: new Date().toISOString()
      }]);

    // Update usage count
    await this.supabase
      .from('api_keys')
      .update({
        usage_count: keyData.usage_count + 1,
        last_used: new Date().toISOString()
      })
      .eq('id', keyData.id);
  }

  hasPermission(keyData: any, permission: string): boolean {
    return keyData.permissions.includes(permission);
  }
}

// API Routes
class APIRoutes {
  private supabase: any;
  private apiManager: APIManager;

  constructor(supabase: any) {
    this.supabase = supabase;
    this.apiManager = new APIManager(supabase);
  }

  async handleRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/v1', '');
    const method = request.method;
    const startTime = Date.now();

    try {
      // Extract API key for authenticated endpoints
      let keyData = null;
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const apiKey = authHeader.replace('Bearer ', '');
        keyData = await this.apiManager.validateAPIKey(apiKey);
      }

      let response;
      let statusCode = 200;

      // Route handling
      if (path === '/sectors' && method === 'GET') {
        response = await this.getSectors(url.searchParams);
      } else if (path.match(/^\/sectors\/[^\/]+\/products$/) && method === 'GET') {
        const sectorSlug = path.split('/')[2];
        if (!keyData || !this.apiManager.hasPermission(keyData, 'products:read')) {
          throw new Error('Insufficient permissions');
        }
        response = await this.getSectorProducts(sectorSlug, url.searchParams);
      } else if (path === '/compare' && method === 'POST') {
        if (!keyData || !this.apiManager.hasPermission(keyData, 'comparison:read')) {
          throw new Error('Insufficient permissions');
        }
        const body = await request.json();
        response = await this.compareProducts(body);
      } else if (path === '/recommendations' && method === 'POST') {
        if (!keyData || !this.apiManager.hasPermission(keyData, 'recommendations:read')) {
          throw new Error('Insufficient permissions');
        }
        const body = await request.json();
        response = await this.getRecommendations(body);
      } else if (path === '/analytics' && method === 'GET') {
        if (!keyData || !this.apiManager.hasPermission(keyData, 'analytics:read')) {
          throw new Error('Insufficient permissions');
        }
        response = await this.getAnalytics(url.searchParams);
      } else {
        statusCode = 404;
        response = { error: 'Endpoint not found' };
      }

      // Log API usage
      if (keyData) {
        const responseTime = Date.now() - startTime;
        await this.apiManager.logAPIUsage(keyData, path, method, statusCode, responseTime);
      }

      return new Response(JSON.stringify(response), {
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('API Error:', error);
      const statusCode = error.message.includes('permissions') ? 403 : 
                        error.message.includes('Rate limit') ? 429 : 
                        error.message.includes('Invalid API key') ? 401 : 500;

      return new Response(JSON.stringify({ error: error.message }), {
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  async getSectors(params: URLSearchParams) {
    const activeOnly = params.get('active') === 'true';
    
    let query = this.supabase
      .from('sectors')
      .select('*')
      .order('name');
    
    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { sectors: data };
  }

  async getSectorProducts(sectorSlug: string, params: URLSearchParams) {
    const country = params.get('country');
    const limit = params.get('limit') ? parseInt(params.get('limit')!) : 50;

    let query = this.supabase
      .from('products')
      .select(`
        *,
        product_types!inner(
          name,
          slug,
          sectors!inner(slug)
        )
      `)
      .eq('product_types.sectors.slug', sectorSlug)
      .eq('is_active', true)
      .limit(limit);

    if (country) {
      query = query.contains('country_availability', [country]);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { products: data };
  }

  async compareProducts(body: any) {
    const { product_ids, criteria } = body;

    if (!product_ids || !Array.isArray(product_ids)) {
      throw new Error('product_ids is required and must be an array');
    }

    const { data: products, error } = await this.supabase
      .from('products')
      .select(`
        *,
        product_sector_criteria_values(
          value,
          sector_criteria(name, data_type, unit)
        )
      `)
      .in('id', product_ids);

    if (error) throw error;

    return {
      comparison: {
        products,
        criteria: criteria || [],
        recommendations: [] // TODO: Add AI recommendations
      }
    };
  }

  async getRecommendations(body: any) {
    const { sector_slug, user_preferences } = body;

    // TODO: Implement AI recommendations logic
    // For now, return mock data
    return {
      recommendations: [
        {
          product_id: "mock-uuid",
          score: 0.95,
          reasoning: "Meilleur rapport qualité-prix pour vos critères"
        }
      ]
    };
  }

  async getAnalytics(params: URLSearchParams) {
    const timeRange = params.get('range') || '24h';
    const sector = params.get('sector');

    // Calculate date range
    const now = new Date();
    const hours = timeRange === '1h' ? 1 : timeRange === '24h' ? 24 : 168;
    const startDate = new Date(now.getTime() - (hours * 60 * 60 * 1000));

    let query = this.supabase
      .from('api_usage_logs')
      .select('*')
      .gte('created_at', startDate.toISOString());

    if (sector) {
      query = query.ilike('endpoint', `%${sector}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Aggregate analytics
    const analytics = {
      total_requests: data.length,
      success_rate: data.length > 0 ? 
        ((data.filter(log => log.status_code < 400).length) / data.length) * 100 : 0,
      avg_response_time: data.length > 0 ? 
        data.reduce((sum, log) => sum + (log.response_time || 0), 0) / data.length : 0,
      top_endpoints: {}
    };

    return { analytics };
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

    const apiRoutes = new APIRoutes(supabaseClient);
    return await apiRoutes.handleRequest(req);

  } catch (error) {
    console.error('Error in public-api function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
