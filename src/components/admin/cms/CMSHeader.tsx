
import React from 'react';

interface CMSHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const CMSHeader: React.FC<CMSHeaderProps> = ({
  title,
  description,
  children
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      {children}
    </div>
  );
};
