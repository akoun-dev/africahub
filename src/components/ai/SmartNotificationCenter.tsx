
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Brain, TrendingDown, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface SmartNotification {
  id: string;
  type: 'price_alert' | 'recommendation' | 'market_update' | 'opportunity';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  read: boolean;
  timestamp: string;
  actionable: boolean;
}

export const SmartNotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<SmartNotification[]>([
    {
      id: '1',
      type: 'price_alert',
      title: 'Alerte prix activée',
      message: 'Le prix de votre assurance auto préférée a baissé de 8%',
      priority: 'high',
      read: false,
      timestamp: '2024-01-15T10:30:00Z',
      actionable: true
    },
    {
      id: '2',
      type: 'recommendation',
      title: 'Nouvelle recommandation IA',
      message: 'Un produit d\'assurance habitation correspond à vos critères',
      priority: 'medium',
      read: false,
      timestamp: '2024-01-15T09:15:00Z',
      actionable: true
    },
    {
      id: '3',
      type: 'market_update',
      title: 'Tendance du marché',
      message: 'Les assurances santé affichent une baisse générale de 5%',
      priority: 'low',
      read: true,
      timestamp: '2024-01-14T16:45:00Z',
      actionable: false
    },
    {
      id: '4',
      type: 'opportunity',
      title: 'Opportunité détectée',
      message: 'Économie potentielle de 120€/an identifiée sur votre profil',
      priority: 'high',
      read: false,
      timestamp: '2024-01-14T14:20:00Z',
      actionable: true
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'price_alert': return <TrendingDown className="h-4 w-4 text-green-600" />;
      case 'recommendation': return <Brain className="h-4 w-4 text-purple-600" />;
      case 'market_update': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'opportunity': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications Intelligentes</span>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm">
            <BellOff className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune notification</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`border rounded-lg p-4 ${!notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <Badge className={getPriorityColor(notification.priority)}>
                        {notification.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.timestamp).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!notification.read && (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Marquer lu
                    </Button>
                  )}
                  {notification.actionable && (
                    <Button size="sm" variant="outline">
                      Agir
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
