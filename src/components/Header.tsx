import React from 'react';
import ModernHeader from './ModernHeader';

// We keep the original Header as a wrapper for backward compatibility
// but use the new ModernHeader component
export default function Header() {
  return <ModernHeader />;
}
