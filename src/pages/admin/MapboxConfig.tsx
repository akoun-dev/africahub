
import React from 'react';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { AdminBrandedHeader } from '@/components/admin/AdminBrandedHeader';
import { MapboxConfiguration } from '@/components/admin/MapboxConfiguration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MapboxConfig = () => {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <AdminBrandedHeader />
        
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Button asChild variant="outline" size="sm">
                <Link to="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à l'admin
                </Link>
              </Button>
            </div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-afroGreen via-afroGold to-afroRed bg-clip-text text-transparent">
              Configuration Mapbox
            </h1>
            <p className="text-gray-600 mt-2">
              Configurez votre token Mapbox pour activer les cartes interactives sur la plateforme
            </p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <MapPin className="h-5 w-5" />
                <span>Token Mapbox</span>
              </CardTitle>
              <p className="text-gray-600 text-sm">
                Gérez la configuration des cartes interactives pour l'ensemble de la plateforme
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <MapboxConfiguration />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminAuthGuard>
  );
};

export default MapboxConfig;
