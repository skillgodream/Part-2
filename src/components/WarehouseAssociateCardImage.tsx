import React from 'react';

export const WarehouseAssociateCardImage: React.FC = () => {
  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0d1b2a] flex items-center justify-center select-none">
      <img 
        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80" 
        alt="Warehouse Associate" 
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586528116493-a025325555d4?auto=format&fit=crop&w=1200&q=80';
        }}
      />
    </div>
  );
};


