import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Maximize2, X, Filter, Sparkles } from 'lucide-react';
import { GALLERY_IMAGES } from '../data';
import { GalleryImage } from '../types';
import { EditableImage } from './ImageEditContext';

interface GalleryViewProps {
  setTab?: (tab: string) => void;
}

export default function GalleryView({ setTab }: GalleryViewProps) {
  const [filter, setFilter] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const categories = ['all', 'Parents & Heritage', 'Ranch Life', 'Training & Care', 'Alumni'];
  
  const filteredImages = filter === 'all' 
    ? GALLERY_IMAGES 
    : GALLERY_IMAGES.filter(img => img.category === filter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  };

  return (
    <div className="bg-[#fcfaf7] min-h-screen pt-32 pb-32 text-navy-950">
      
      {/* HEADER HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <span className="text-[10px] font-mono font-black text-gold-600 tracking-[0.4em] uppercase block">
            Visual Memories
          </span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none">
            The <span className="text-gold-500 italic">Vibe</span> Gallery
          </h1>
          <p className="text-sm md:text-xl text-gray-400 max-w-2xl mx-auto font-serif leading-relaxed italic">
            Experience the everyday magic of Golden Paws Home through our curated visual collection.
          </p>
        </motion.div>
      </section>

      {/* FILTER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center space-x-2 mr-4 text-gold-600">
            <Filter className="w-5 h-5" />
            <span className="text-[10px] font-mono font-black uppercase tracking-widest">Filter Archive</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 text-[10px] font-mono font-black uppercase tracking-[0.2em] rounded-2xl border transition-all duration-300 transform active:scale-95 ${
                filter === cat
                  ? 'bg-navy-950 text-white border-navy-950 shadow-2xl shadow-navy-950/20'
                  : 'bg-white text-gray-500 border-gold-100 hover:border-gold-500 hover:text-gold-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* MASONRY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={filter}
          className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8"
        >
          {filteredImages.map((img) => (
            <motion.div 
              key={img.id}
              variants={itemVariants}
              className="break-inside-avoid group relative rounded-[2.5rem] overflow-hidden bg-white border border-gold-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-zoom-in"
              onClick={() => setSelectedImage(img)}
            >
              <EditableImage 
                imageId={img.id}
                src={img.url} 
                alt={img.caption} 
                className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 space-y-4">
                  <div className="flex items-center space-x-2 text-gold-500">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest">
                      {img.category}
                    </span>
                  </div>
                  <p className="text-white text-lg font-black leading-tight font-serif uppercase tracking-tight">
                    {img.caption}
                  </p>
                  <div className="flex items-center text-white/40 text-[10px] font-mono font-black uppercase tracking-[0.2em]">
                    <Maximize2 className="w-3 h-3 mr-2" />
                    <span>Expand Story</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {filteredImages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-32 text-center flex flex-col items-center justify-center space-y-8"
            >
              <div className="p-8 bg-white rounded-full border border-gold-100 text-gold-200">
                <Camera className="w-16 h-16" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black uppercase tracking-tight">Archives Sealed</h3>
                <p className="text-xs text-gray-400 font-mono tracking-widest uppercase">No clinical records found for target category</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* QUICK CROSS NAVIGATION */}
      {setTab && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-navy-950 text-white rounded-3xl p-8 border border-gold-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-mono font-black text-gold-400 uppercase tracking-widest bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
                Discover Our Litters
              </span>
              <h3 className="text-xl font-black mt-2">Fallen in Love with Our Golden Paws?</h3>
              <p className="text-stone-300 text-xs mt-1">See our available puppies or read testimonials from adopter families.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => { setTab('puppies'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-6 py-3 rounded-2xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Available Puppies →</span>
              </button>
              <button
                onClick={() => { setTab('reviews'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-gold-500 hover:text-navy-950 text-white font-bold text-xs transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Adopter Reviews →</span>
              </button>
              <button
                onClick={() => { setTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white font-bold text-xs transition-all active:scale-95 flex items-center gap-2"
              >
                <span>🏠 Home</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* LIGHTBOX OVERLAY */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-navy-950/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-20"
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-10 right-10 p-4 bg-white/5 hover:bg-gold-500 hover:text-navy-950 text-white rounded-full transition-all duration-300"
            >
              <X className="w-8 h-8" />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
              <div className="lg:col-span-8 bg-black/40 rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
                <EditableImage 
                  imageId={selectedImage.url}
                  src={selectedImage.url} 
                  alt={selectedImage.caption}
                  className="max-h-[80vh] w-full object-contain"
                />
              </div>
              <div className="lg:col-span-4 space-y-8 text-left">
                <div className="space-y-4">
                  <span className="text-gold-500 text-[10px] font-mono font-black uppercase tracking-[0.4em]">
                    {selectedImage.category} Collection
                  </span>
                  <h4 className="text-4xl md:text-5xl font-black text-white leading-none font-serif italic">{selectedImage.caption}</h4>
                  <div className="w-12 h-1 bg-gold-500 rounded-full"></div>
                </div>
                <p className="text-gray-400 text-sm md:text-lg leading-relaxed font-medium">
                  This capturing represents the aesthetic and biological standards maintained at Golden Paws Home. Every frame tells a story of care.
                </p>
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="px-10 py-5 bg-gold-500 text-navy-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all shadow-2xl shadow-gold-500/20"
                >
                  Return to Archive
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
