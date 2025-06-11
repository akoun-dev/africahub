import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Scale, 
  Share2, 
  MapPin, 
  Building2, 
  FileText,
  ExternalLink,
  Star,
  Shield,
  Phone,
  Mail,
  Globe,
  Eye,
  Users,
  TrendingUp,
  Award,
  CheckCircle,
  Download,
  Zap,
  Target,
  BarChart3,
  MessageCircle,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  ThumbsUp,
  Camera,
  Play,
  Bookmark,
  Send
} from 'lucide-react';
import { ProductWithCriteria } from '@/types/core/Product';

const ProductDetailModern: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [scrollY, setScrollY] = useState(0);

  // Scroll effect pour le parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product-detail-modern', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          companies (name, logo_url),
          product_types (name, slug),
          product_criteria_values (
            value,
            comparison_criteria (name, data_type, unit)
          )
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data as ProductWithCriteria;
    },
    enabled: !!id
  });

  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return 'Prix sur demande';
    return `${price.toLocaleString()} ${currency || 'XOF'}`;
  };

  // Données simulées pour la démo
  const mockMetrics = {
    rating: 4.8,
    reviews: 156,
    views: 2847,
    quotes: 234,
    countries: product?.country_availability?.length || 6,
    satisfaction: 96,
    responseTime: '2h',
    lastUpdated: '2 jours'
  };

  const mockImages = [
    product?.image_url || '/api/placeholder/600/400',
    '/api/placeholder/600/400',
    '/api/placeholder/600/400',
    '/api/placeholder/600/400'
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded-lg w-1/3" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-2xl" />
              <div className="space-y-6">
                <div className="h-12 bg-gray-200 rounded-lg w-3/4" />
                <div className="h-6 bg-gray-200 rounded-lg w-1/2" />
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded-xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 flex items-center justify-center">
        <GlassCard variant="premium" className="text-center max-w-md">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h2>
            <p className="text-gray-600 mb-6">Le produit que vous recherchez n'existe pas ou n'est plus disponible.</p>
            <Button asChild className="btn-african">
              <Link to="/produits">Retour aux produits</Link>
            </Button>
          </CardContent>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      {/* Hero Section avec Parallax */}
      <motion.section 
        className="relative overflow-hidden bg-gradient-to-r from-afroGreen via-afroGold to-afroRed"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[url('/patterns/african-pattern.svg')] opacity-10" />
        
        <div className="relative container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              {product.companies?.name && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Building2 className="h-3 w-3 mr-1" />
                  {product.companies.name}
                </Badge>
              )}
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Award className="h-3 w-3 mr-1" />
                Certifié AfricaHub
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
              {product.name}
            </h1>
            
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8">
              {product.description || "Découvrez ce produit exceptionnel adapté au marché africain"}
            </p>

            {/* Prix avec animation */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/20"
            >
              <div className="text-3xl md:text-4xl font-bold">
                {formatPrice(product.price, product.currency)}
              </div>
              <div className="text-sm opacity-80">
                Prix indicatif
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 -mt-8 relative z-10">
        {/* Métriques flottantes */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <GlassCard variant="premium" className="text-center p-6 hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{mockMetrics.rating}</div>
            <div className="text-sm text-gray-600">{mockMetrics.reviews} avis</div>
            <Progress value={mockMetrics.rating * 20} className="mt-2 h-2" />
          </GlassCard>

          <GlassCard variant="premium" className="text-center p-6 hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{mockMetrics.views.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Vues ce mois</div>
            <div className="flex items-center justify-center mt-2 text-green-600 text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              +23% vs mois dernier
            </div>
          </GlassCard>

          <GlassCard variant="premium" className="text-center p-6 hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{mockMetrics.quotes}</div>
            <div className="text-sm text-gray-600">Devis demandés</div>
            <div className="text-xs text-gray-500 mt-1">Temps de réponse: {mockMetrics.responseTime}</div>
          </GlassCard>

          <GlassCard variant="premium" className="text-center p-6 hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{mockMetrics.countries}</div>
            <div className="text-sm text-gray-600">Pays africains</div>
            <div className="text-xs text-green-600 mt-1">✓ Disponible dans votre région</div>
          </GlassCard>
        </motion.div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Galerie d'images moderne */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="lg:col-span-2"
          >
            <GlassCard variant="premium" className="p-6">
              <div className="relative">
                {/* Image principale */}
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 mb-4 relative group">
                  <img
                    src={mockImages[activeImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Overlay avec actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-3">
                      <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                        <Camera className="h-4 w-4 mr-2" />
                        Voir toutes les photos
                      </Button>
                      <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                        <Play className="h-4 w-4 mr-2" />
                        Vidéo démo
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Miniatures */}
                <div className="grid grid-cols-4 gap-3">
                  {mockImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        activeImageIndex === index 
                          ? 'border-afroGold shadow-lg scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Actions et informations rapides */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="space-y-6"
          >
            {/* Actions principales */}
            <GlassCard variant="african-card" className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-afroGold" />
                Actions rapides
              </h3>
              
              <div className="space-y-3">
                <Button className="w-full btn-african text-lg py-3">
                  <FileText className="h-5 w-5 mr-2" />
                  Demander un devis gratuit
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsComparing(!isComparing)}
                    className={`${isComparing ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}`}
                  >
                    <Scale className="h-4 w-4 mr-2" />
                    {isComparing ? 'En comparaison' : 'Comparer'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`${isFavorite ? 'bg-red-50 border-red-200 text-red-700' : ''}`}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                    Favoris
                  </Button>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager ce produit
                </Button>
              </div>
            </GlassCard>

            {/* Badges de confiance */}
            <GlassCard variant="premium" className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Garanties de qualité
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-green-900">Produit vérifié</div>
                    <div className="text-sm text-green-700">Contrôlé par nos experts</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Award className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">Recommandé AfricaHub</div>
                    <div className="text-sm text-blue-700">Top 5% de sa catégorie</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="font-medium text-orange-900">Très populaire</div>
                    <div className="text-sm text-orange-700">{mockMetrics.satisfaction}% de satisfaction</div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Contact rapide */}
            <GlassCard variant="premium" className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                Contact express
              </h3>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-3 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium">Appel direct</div>
                    <div className="text-sm text-gray-600">+225 20 30 40 50</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-3 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-gray-600">Réponse sous 2h</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-3 text-purple-600" />
                  <div className="text-left">
                    <div className="font-medium">Chat en direct</div>
                    <div className="text-sm text-green-600">● En ligne maintenant</div>
                  </div>
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModern;
