
import React from 'react';

export const PremiumTypography: React.FC = () => {
  return (
    <div className="premium-typography">
      <style>
        {`
          .premium-heading {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-weight: 700;
            line-height: 1.2;
            letter-spacing: -0.025em;
          }
          
          .premium-subheading {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-weight: 600;
            line-height: 1.3;
            color: #64748b;
          }
          
          .premium-body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-weight: 400;
            line-height: 1.6;
            color: #334155;
          }
        `}
      </style>
    </div>
  );
};
