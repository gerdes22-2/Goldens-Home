import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { EditableImage } from './ImageEditContext';

interface GrowthPhoto {
  age: string;
  url: string;
}

interface PuppyImageCarouselProps {
  puppyId?: string;
  photos: GrowthPhoto[];
  puppyName: string;
  onCardClick?: () => void;
  colorBadge: string;
  statusBadge: React.ReactNode;
}

export default function PuppyImageCarousel({
  puppyId,
  photos,
  puppyName,
  onCardClick,
  colorBadge,
  statusBadge
}: PuppyImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = photos.length;

  useEffect(() => {
    if (total <= 1) return;

    if (!isHovered) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % total);
      }, 3500); // Transitions every 3.5 seconds
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, total]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  return (
    <div 
      className="relative w-full h-full group/carousel overflow-hidden bg-gold-50 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onCardClick}
    >
      {/* Photo slide */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false} mode="wait">
          <div key={currentIndex} className="w-full h-full">
            <EditableImage
              imageId={puppyId ? `puppy-image-${puppyId}-${photos[currentIndex].age.toLowerCase().replace(/\s+/g, '-')}` : photos[currentIndex].url}
              src={photos[currentIndex].url}
              alt={`${puppyName} at ${photos[currentIndex].age}`}
              className="w-full h-full object-cover transition-transform duration-[4000ms] ease-out group-hover/carousel:scale-105"
              loading="lazy"
            />
          </div>
        </AnimatePresence>
      </div>

      {/* Floating Badges */}
      <div className="absolute top-6 left-6 flex flex-col space-y-2 z-10">
        <span className="px-3 py-1 bg-navy-950/80 backdrop-blur-md text-white text-[9px] font-mono font-black uppercase rounded-lg border border-white/10 tracking-widest">
          {colorBadge}
        </span>
      </div>

      <div className="absolute top-6 right-6 z-10">
        {statusBadge}
      </div>

      {/* Age / Growth stage pill */}
      <div className="absolute bottom-6 left-6 z-10">
        <span className="px-3 py-1 bg-gold-500 text-navy-950 text-[9px] font-mono font-black uppercase rounded-lg shadow-lg tracking-widest flex items-center space-x-1">
          <span className="w-1.5 h-1.5 bg-navy-950 rounded-full animate-ping mr-1"></span>
          <span>{photos[currentIndex].age} Growth stage</span>
        </span>
      </div>

      {/* Manual Navigation Controls - Fade in on hover */}
      {total > 1 && (
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between z-20 pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm text-navy-950 flex items-center justify-center shadow-lg hover:bg-gold-500 hover:text-navy-950 transition-all pointer-events-auto active:scale-90"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={3} />
          </button>
          
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm text-navy-950 flex items-center justify-center shadow-lg hover:bg-gold-500 hover:text-navy-950 transition-all pointer-events-auto active:scale-90"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>
      )}

      {/* Hover Information overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 flex items-end justify-center p-8 z-10 pointer-events-none">
        <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono font-black uppercase tracking-widest py-2 px-4 rounded-xl">
          <Eye className="w-3.5 h-3.5 mr-2" /> Examine detailed portfolio
        </div>
      </div>

      {/* Bottom slide dots / indicators */}
      {total > 1 && (
        <div className="absolute bottom-6 right-6 z-10 flex items-center space-x-1.5">
          {photos.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => handleDotClick(e, idx)}
              className={`h-1.5 rounded-full transition-all duration-300 hover:bg-gold-400 ${
                idx === currentIndex ? 'w-4 bg-gold-500' : 'w-1.5 bg-white/50'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
