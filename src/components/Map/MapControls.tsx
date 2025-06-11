
import React from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface MapControlsProps {
  isFullscreen: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onToggleFullscreen: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  isFullscreen,
  onZoomIn,
  onZoomOut,
  onReset,
  onToggleFullscreen
}) => {
  return (
    <div className="absolute top-4 left-4 flex flex-col gap-2">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-afroGold/20 p-2">
        <div className="flex flex-col gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onZoomIn} 
            className="p-2 h-10 w-10 hover:bg-afroGreen/10 hover:text-afroGreen transition-colors rounded-lg"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onZoomOut} 
            className="p-2 h-10 w-10 hover:bg-afroGreen/10 hover:text-afroGreen transition-colors rounded-lg"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="h-px bg-afroGold/20 my-1"></div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset} 
            className="p-2 h-10 w-10 hover:bg-afroGold/10 hover:text-afroGold transition-colors rounded-lg"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleFullscreen} 
            className="p-2 h-10 w-10 hover:bg-afroRed/10 hover:text-afroRed transition-colors rounded-lg"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
