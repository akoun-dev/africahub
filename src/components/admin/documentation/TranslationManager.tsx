
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const TranslationManager = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Traductions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <h4 className="font-medium">Guide des assurances au Sénégal</h4>
              <p className="text-sm text-gray-500">Document original en français</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">FR ✓</Badge>
              <Badge variant="outline" className="text-yellow-600">EN ⏳</Badge>
              <Badge variant="outline" className="text-gray-400">AR ✗</Badge>
              <Button size="sm" variant="outline">Traduire</Button>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <h4 className="font-medium">FAQ - Comment comparer les banques?</h4>
              <p className="text-sm text-gray-500">Document original en français</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">FR ✓</Badge>
              <Badge variant="outline">EN ✓</Badge>
              <Badge variant="outline" className="text-gray-400">AR ✗</Badge>
              <Button size="sm" variant="outline">Traduire</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
