
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const DocumentationCategories = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Catégories par Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Guides utilisateur</span>
              <Badge>12 documents</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>FAQ</span>
              <Badge>8 documents</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Tutoriels</span>
              <Badge>6 documents</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Documentation API</span>
              <Badge>4 documents</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Répartition par Secteur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Assurance</span>
              <Badge>15 documents</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Banque</span>
              <Badge>8 documents</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Télécoms</span>
              <Badge>5 documents</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Général</span>
              <Badge>2 documents</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
