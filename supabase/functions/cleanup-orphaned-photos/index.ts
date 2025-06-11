
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Récupérer toutes les photos du bucket review-photos
    const { data: files, error: filesError } = await supabase.storage
      .from('review-photos')
      .list()

    if (filesError) {
      throw filesError
    }

    // Récupérer toutes les URLs de photos utilisées dans les avis
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('photos')
      .not('photos', 'is', null)

    if (reviewsError) {
      throw reviewsError
    }

    // Créer un Set des URLs utilisées
    const usedUrls = new Set()
    reviews?.forEach(review => {
      if (review.photos && Array.isArray(review.photos)) {
        review.photos.forEach(url => usedUrls.add(url))
      }
    })

    // Identifier les fichiers orphelins (plus vieux que 24h et non utilisés)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const orphanedFiles = files?.filter(file => {
      const fileUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/review-photos/${file.name}`
      const fileDate = new Date(file.created_at || '')
      return !usedUrls.has(fileUrl) && fileDate < oneDayAgo
    }) || []

    // Supprimer les fichiers orphelins
    let deletedCount = 0
    for (const file of orphanedFiles) {
      const { error } = await supabase.storage
        .from('review-photos')
        .remove([file.name])
      
      if (!error) {
        deletedCount++
        console.log(`Deleted orphaned file: ${file.name}`)
      } else {
        console.error(`Failed to delete ${file.name}:`, error)
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Cleanup completed. Deleted ${deletedCount} orphaned files.`,
        deletedCount,
        totalFiles: files?.length || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Cleanup error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
