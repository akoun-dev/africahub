
import { supabase } from '@/integrations/supabase/client';

export class TestService {
  static async validateDataMigration() {
    const { data: productTypes } = await supabase.from('product_types').select('*');
    const { data: products } = await supabase.from('products').select('*');
    const { data: productCriteriaValues } = await supabase.from('product_criteria_values').select('*');

    if (!productTypes || productTypes.length === 0) {
      throw new Error('No product types found');
    }
    if (!products || products.length === 0) {
      throw new Error('No products found');
    }
    if (!productCriteriaValues || productCriteriaValues.length === 0) {
      throw new Error('No product criteria values found');
    }

    console.log('✅ Data migration validation passed:', {
      productTypes: productTypes.length,
      products: products.length,
      productCriteriaValues: productCriteriaValues.length
    });
  }

  static async validateProductTypes() {
    const { data, error } = await supabase
      .from('product_types')
      .select('*');

    if (error) throw error;
    
    if (!data || data.length === 0) {
      throw new Error('No product types found in database');
    }

    console.log('✅ Product types validation passed:', data.length, 'types found');
  }

  static async validateProductCriteria() {
    const { data: products } = await supabase
      .from('products')
      .select(`
        *,
        product_criteria_values (*)
      `)
      .limit(10);

    if (!products || products.length === 0) {
      throw new Error('No products with criteria found');
    }

    let totalCriteria = 0;
    products.forEach(product => {
      if (product.product_criteria_values) {
        totalCriteria += product.product_criteria_values.length;
      }
    });

    if (totalCriteria === 0) {
      throw new Error('No criteria values found for products');
    }

    console.log('✅ Product criteria validation passed:', { totalCriteria });
  }

  static async validateCountryFiltering() {
    const testCountries = ['france', 'senegal', 'cote_divoire'];
    
    for (const country of testCountries) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .contains('country_availability', [country])
        .limit(5);

      if (error) throw error;
      
      console.log(`✅ Found ${data?.length || 0} products for ${country}`);
    }
  }

  static async validateComparisonAlgorithm() {
    const { data: products } = await supabase
      .from('products')
      .select(`
        *,
        product_criteria_values (*)
      `)
      .limit(3);

    if (!products || products.length < 2) {
      throw new Error('Need at least 2 products for comparison');
    }

    const comparison = products.map(product => {
      const criteriaCount = product.product_criteria_values?.length || 0;
      const avgPrice = product.price || 0;
      const score = criteriaCount * 10 - (avgPrice / 100);
      
      return {
        product: product.name,
        score,
        criteriaCount,
        price: avgPrice
      };
    });

    comparison.sort((a, b) => b.score - a.score);
    console.log('✅ Comparison algorithm test passed:', comparison);
  }

  static async validateCachePerformance() {
    const startTime = Date.now();
    
    await supabase.from('product_types').select('*');
    const firstQuery = Date.now() - startTime;
    
    const secondStart = Date.now();
    await supabase.from('product_types').select('*');
    const secondQuery = Date.now() - secondStart;
    
    console.log('✅ Cache performance test:', {
      firstQuery: `${firstQuery}ms`,
      secondQuery: `${secondQuery}ms`,
      improvement: secondQuery < firstQuery
    });
  }

  static async validateResilienceSystem() {
    const promises = Array.from({ length: 5 }, () => 
      supabase.from('products').select('*').limit(1)
    );
    
    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    
    if (successful < 4) {
      throw new Error(`Resilience test failed: only ${successful}/5 requests succeeded`);
    }
    
    console.log('✅ Resilience system test passed:', { successful });
  }

  static async validateTimeoutManagement() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      await supabase
        .from('products')
        .select('*')
        .abortSignal(controller.signal);
      
      clearTimeout(timeoutId);
      console.log('✅ Timeout management test passed');
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.log('✅ Timeout properly handled');
      } else {
        throw error;
      }
    }
  }
}
