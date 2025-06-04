
import React from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronRight, Shield } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CountryPickerButton } from '@/components/header/CountryPickerButton';
import { useNavigationStructure } from './NavigationStructure';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { cn } from '@/lib/utils';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
  const { mainNavigation, sectorNavigation, userNavigation, adminNavigation, authNavigation, isActive } = useNavigationStructure();
  const { user } = useAuth();
  const { adminUser } = useAdminAuth();

  if (!isOpen) return null;

  const handleLinkClick = () => {
    onClose();
  };

  const getRoleLabel = (roles: string[]) => {
    if (roles.includes('super-admin')) return 'Super Admin';
    if (roles.includes('admin')) return 'Administrateur';
    if (roles.includes('moderator')) return 'Modérateur';
    if (roles.includes('developer')) return 'Développeur';
    return roles[0] || 'Utilisateur';
  };

  return (
    <div className="lg:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
      <div className="absolute top-0 left-0 right-0">
        <GlassCard variant="default" className="min-h-screen rounded-none">
          {/* Header mobile */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Navigation principale */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Navigation
              </h3>
              <nav className="space-y-1">
                {mainNavigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "flex items-center justify-between py-3 px-4 text-gray-700 hover:text-afroGreen hover:bg-afroGreen/10 rounded-lg transition-colors",
                      isActive(item.href) && "text-afroGreen bg-afroGreen/10 font-semibold"
                    )}
                  >
                    <div className="flex items-center">
                      {item.icon && <item.icon className="w-5 h-5 mr-3" />}
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ))}
              </nav>
            </div>

            <Separator />

            {/* Secteurs */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Secteurs
              </h3>
              <nav className="space-y-1">
                {sectorNavigation.slice(0, 5).map((sector) => (
                  <Link
                    key={sector.href}
                    to={sector.href}
                    onClick={handleLinkClick}
                    className="flex items-center justify-between py-3 px-4 text-gray-700 hover:text-afroGreen hover:bg-afroGreen/10 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      {sector.icon && <sector.icon className="w-5 h-5 mr-3" />}
                      <span className="text-sm">{sector.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ))}
              </nav>
            </div>

            <Separator />

            {/* Country Picker */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Pays
              </h3>
              <CountryPickerButton />
            </div>

            {/* Admin/Developer Section */}
            {adminNavigation.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                    Outils techniques
                  </h3>
                  {adminUser && (
                    <Badge variant="default" className="mb-3">
                      {getRoleLabel(adminUser.roles)}
                    </Badge>
                  )}
                  <nav className="space-y-1">
                    {adminNavigation.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={handleLinkClick}
                        className="flex items-center justify-between py-3 px-4 text-gray-700 hover:text-afroGreen hover:bg-afroGreen/10 rounded-lg transition-colors"
                      >
                        <div className="flex items-center">
                          {item.icon && <item.icon className="w-5 h-5 mr-3" />}
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ))}
                  </nav>
                </div>
              </>
            )}

            <Separator />

            {/* Menu utilisateur ou Auth */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                {user ? 'Mon compte' : 'Authentification'}
              </h3>
              
              {user ? (
                <nav className="space-y-1">
                  {userNavigation.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={handleLinkClick}
                      className="flex items-center justify-between py-3 px-4 text-gray-700 hover:text-afroGreen hover:bg-afroGreen/10 rounded-lg transition-colors"
                    >
                      <div className="flex items-center">
                        {item.icon && <item.icon className="w-5 h-5 mr-3" />}
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  ))}
                </nav>
              ) : (
                <nav className="space-y-2">
                  {authNavigation.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={handleLinkClick}
                      className="block py-3 px-4 text-center bg-gradient-to-r from-afroGreen to-afroGold text-white rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              )}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
