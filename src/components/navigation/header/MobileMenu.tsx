
import React from 'react';
import { MobileNavItems } from './mobile/MobileNavItems';
import { MobileSectorMenu } from './mobile/MobileSectorMenu';
import { MobileAdvancedMenu } from './mobile/MobileAdvancedMenu';
import { MobileCountryPicker } from './mobile/MobileCountryPicker';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isActive: (path: string) => boolean;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, isActive }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
      <nav className="p-4 space-y-2">
        <MobileNavItems onClose={onClose} isActive={isActive} />
        <MobileSectorMenu onClose={onClose} />
        <MobileAdvancedMenu onClose={onClose} />
        <MobileCountryPicker />
      </nav>
    </div>
  );
};
