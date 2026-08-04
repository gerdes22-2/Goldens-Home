import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, Globe, Image as ImageIcon, Check, X, RefreshCw, Eye, Sparkles, Sliders, Shield } from 'lucide-react';
import serverCustomImages from '../custom_images.json';

// Pre-existing ranch assets that can be chosen from the library
const PREBUILT_LOCKED_IMAGES = [
  { url: '/images/golden_paws_logo_1783021185349.jpg', label: 'Golden Paws Home Official Logo' },
  { url: '/images/ranch_pack_hero_banner_1782302897974.jpg', label: 'Ranch Herd Banner' },
  { url: '/images/patriotic_goldens_bandana_1782303395345.jpg', label: 'Patriotic Rusty Bandana' },
  { url: '/images/breeder_two_fluffy_pups_1782303458269.jpg', label: 'Bella & Fluffy Puppies' },
  { url: '/images/breeder_three_puppies_1782303426621.jpg', label: 'Three Puppies Sitting' },
  { url: '/images/puppies_witch_hats_1782303440786.jpg', label: 'Puppies in Hats' },
  { url: '/images/puppy_chewing_bone_1782303411084.jpg', label: 'Puppy Chewing Bone' },
  { url: '/images/breeder_dozen_puppies_grass_1782302919140.jpg', label: 'Litter Playing in Grass' },
  { url: '/images/valley_ranch_sunset_1782303523047.jpg', label: 'Valley Ranch Sunset' },
  { url: '/images/ciara_breeder_portrait_1782303471681.jpg', label: 'Ciara Breeding Director' }
];

interface ImageEditContextType {
  isEditMode: boolean;
  setEditMode: (val: boolean) => void;
  customImages: Record<string, string>;
  saveCustomImage: (idOrSrc: string, newSrc: string) => void;
  resetCustomImages: () => void;
  openEditor: (idOrSrc: string, currentSrc: string) => void;
  resolveImage: (idOrSrc: string) => string;
}

const ImageEditContext = createContext<ImageEditContextType | undefined>(undefined);

export function useImageEdit() {
  const context = useContext(ImageEditContext);
  if (!context) {
    throw new Error('useImageEdit must be used within an ImageEditProvider');
  }
  return context;
}

export function ImageEditProvider({ children }: { children: React.ReactNode }) {
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [customImages, setCustomImages] = useState<Record<string, string>>({});
  const [editingImage, setEditingImage] = useState<{ idOrSrc: string; currentSrc: string } | null>(null);

  // Load custom images from both bundled server config, API, and localstorage on mount
  useEffect(() => {
    const loadImages = async () => {
      try {
        const stored = localStorage.getItem('golden_paws_custom_images');
        const localImages = stored ? JSON.parse(stored) : {};

        // 1. Initial state from static import
        let currentServerImages = { ...serverCustomImages };

        // 2. Try fetching from the server API dynamically
        try {
          const res = await fetch('/api/custom-images');
          if (res.ok) {
            const apiImages = await res.json();
            currentServerImages = { ...currentServerImages, ...apiImages };
          }
        } catch (fetchErr) {
          console.warn('Could not fetch custom images from live API, falling back to static imports:', fetchErr);
        }

        // 3. Merge: Local storage overrides server-side configurations
        const merged = { ...currentServerImages, ...localImages };
        setCustomImages(merged);

        // 4. Proactively sync browser local customs to the server if they are missing on the server
        const hasLocalCustoms = Object.keys(localImages).length > 0;
        const diffExists = JSON.stringify(currentServerImages) !== JSON.stringify(merged);
        if (hasLocalCustoms && diffExists) {
          try {
            await fetch('/api/custom-images', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(merged)
            });
            console.log('Successfully synchronized client custom images to server workspace!');
          } catch (syncErr) {
            console.error('Failed to sync browser customizations to server:', syncErr);
          }
        }
      } catch (e) {
        console.error('Failed to load custom images process', e);
        setCustomImages(serverCustomImages || {});
      }
    };

    loadImages();
  }, []);

  const saveCustomImage = async (idOrSrc: string, newSrc: string) => {
    let finalSrc = newSrc;
    
    // If it's a base64 image, attempt to upload to Cloudinary via server-side secure proxy
    if (newSrc.startsWith('data:')) {
      try {
        const uploadRes = await fetch('/api/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ image: newSrc })
        });
        
        if (uploadRes.ok) {
          const data = await uploadRes.json();
          if (data.success && data.url && !data.url.startsWith('data:')) {
            finalSrc = data.url;
            console.log('Successfully uploaded image to Cloudinary and replaced with URL:', finalSrc);
          }
        }
      } catch (uploadErr) {
        console.warn('Failed to upload image to Cloudinary, falling back to local base64 storage:', uploadErr);
      }
    }

    const updated = { ...customImages, [idOrSrc]: finalSrc };
    setCustomImages(updated);
    try {
      localStorage.setItem('golden_paws_custom_images', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
      alert('Local storage is full or disabled! If you uploaded a massive image file, please try pasting an image URL instead.');
    }

    // Persist to server workspace JSON file
    try {
      await fetch('/api/custom-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error('Could not sync custom images to backend:', err);
    }
  };

  const resetCustomImages = async () => {
    if (confirm('Are you sure you want to revert all replaced pictures back to the original defaults?')) {
      setCustomImages({});
      localStorage.removeItem('golden_paws_custom_images');
      setEditMode(false);

      try {
        await fetch('/api/custom-images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });
      } catch (err) {
        console.error('Could not reset custom images on server:', err);
      }
    }
  };

  const openEditor = (idOrSrc: string, currentSrc: string) => {
    setEditingImage({ idOrSrc, currentSrc });
  };

  const resolveImage = (idOrSrc: string) => {
    return customImages[idOrSrc] || idOrSrc;
  };

  return (
    <ImageEditContext.Provider
      value={{
        isEditMode,
        setEditMode,
        customImages,
        saveCustomImage,
        resetCustomImages,
        openEditor,
        resolveImage
      }}
    >
      {children}
      <GlobalEditModeToggler />
      <ImageEditorModal
        isOpen={editingImage !== null}
        onClose={() => setEditingImage(null)}
        editingImage={editingImage}
        onSave={async (newSrc) => {
          if (editingImage) {
            await saveCustomImage(editingImage.idOrSrc, newSrc);
            setEditingImage(null);
          }
        }}
      />
    </ImageEditContext.Provider>
  );
}

// Global floating bar to activate/deactivate edit mode
function GlobalEditModeToggler() {
  const { isEditMode, setEditMode, resetCustomImages, customImages } = useImageEdit();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Show a small bounce notification if there are custom images
    const count = Object.keys(customImages).length;
    if (count > 0) {
      setShowNotification(true);
      const timer = setTimeout(() => setShowNotification(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [customImages]);

  return (
    <div className="fixed bottom-24 left-8 z-[50] flex flex-col gap-2 items-start">
      {/* Dynamic Count Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-navy-950 text-white text-[11px] font-medium px-4 py-2 rounded-2xl shadow-xl border border-gold-400/30 flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
            <span>Active Customizations: <strong>{Object.keys(customImages).length}</strong> images saved</span>
            <button onClick={() => setShowNotification(false)} className="hover:text-gold-400 ml-1">
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-3 rounded-full shadow-2xl border border-stone-200/80">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isEditMode ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
          <span className="text-[10px] font-mono font-black text-stone-700 uppercase tracking-widest">
            {isEditMode ? 'Editor: Active' : 'Image Editor'}
          </span>
        </div>

        <div className="h-4 w-px bg-stone-200 mx-1" />

        <button
          onClick={() => setEditMode(!isEditMode)}
          className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
            isEditMode 
              ? 'bg-[#0d2244] text-white' 
              : 'bg-gold-500 hover:bg-gold-400 text-navy-950'
          }`}
        >
          {isEditMode ? 'Exit Editor' : 'Enable Edit'}
        </button>

        {Object.keys(customImages).length > 0 && (
          <button
            onClick={resetCustomImages}
            title="Revert all customized images back to default"
            className="p-2 text-stone-400 hover:text-red-500 transition-colors rounded-full hover:bg-stone-100"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// Integrated Interactive Image Upload / URL / Preset Editor modal
function ImageEditorModal({ 
  isOpen, 
  onClose, 
  editingImage, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  editingImage: { idOrSrc: string; currentSrc: string } | null;
  onSave: (newSrc: string) => Promise<void>;
}) {
  const { resolveImage } = useImageEdit();
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'library'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');
  const [dragging, setDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingImage) {
      const resolved = resolveImage(editingImage.idOrSrc);
      setPreviewSrc(resolved);
      setUrlInput(resolved.startsWith('data:') ? '' : resolved);
    } else {
      setPreviewSrc('');
      setUrlInput('');
    }
  }, [editingImage, isOpen]);

  if (!editingImage) return null;

  // Optimized Canvas-based Image Compression for durable localStorage
  const processAndCompressFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 960; // Perfect high-definition size for standard screens
        const MAX_HEIGHT = 960;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82); // Superb quality-to-file size ratio
          setPreviewSrc(compressedBase64);
        } else {
          setPreviewSrc(e.target?.result as string);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndCompressFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAndCompressFile(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      setPreviewSrc(urlInput.trim());
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          {/* Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-[2.5rem] shadow-2xl border border-stone-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-navy-950 px-8 py-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gold-500/10 border border-gold-500/20 rounded-2xl text-gold-400">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">Ranch Picture Editor</h3>
                  <p className="text-[10px] text-stone-300 font-mono font-bold uppercase tracking-widest mt-0.5">
                    Customize Any Picture Instantly
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Split */}
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Selector & Inputs */}
              <div className="space-y-6 flex flex-col justify-between">
                <div>
                  {/* Selector Tabs */}
                  <div className="flex p-1 bg-stone-100 rounded-2xl mb-6">
                    <button
                      onClick={() => setActiveTab('upload')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                        activeTab === 'upload' 
                          ? 'bg-white text-navy-950 shadow-sm font-extrabold' 
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload File
                    </button>
                    <button
                      onClick={() => setActiveTab('url')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                        activeTab === 'url' 
                          ? 'bg-white text-navy-950 shadow-sm font-extrabold' 
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Paste URL
                    </button>
                    <button
                      onClick={() => setActiveTab('library')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                        activeTab === 'library' 
                          ? 'bg-white text-navy-950 shadow-sm font-extrabold' 
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      Ranch Library
                    </button>
                  </div>

                  {/* Active tab content */}
                  <AnimatePresence mode="wait">
                    {activeTab === 'upload' && (
                      <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-[2rem] p-8 text-center cursor-pointer transition-all ${
                            dragging 
                              ? 'border-gold-500 bg-gold-50/20 scale-[0.98]' 
                              : 'border-stone-200 hover:border-gold-400 hover:bg-stone-50/50'
                          }`}
                        >
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                          />
                          <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-stone-500">
                            <Upload className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-black text-stone-700">Drag and drop your image here</p>
                          <p className="text-[10px] text-stone-400 font-medium mt-1">or click to browse your devices</p>
                          <div className="mt-4 inline-flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-600 text-[9px] font-mono font-black uppercase tracking-wider">
                            <span>Auto-Compressed & Optimized</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'url' && (
                      <motion.div
                        key="url"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <form onSubmit={handleUrlSubmit} className="space-y-3">
                          <label className="block text-[10px] font-mono font-black text-stone-500 uppercase tracking-wider">
                            Web Address of the Image (HTTP/HTTPS URL)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={urlInput}
                              onChange={(e) => setUrlInput(e.target.value)}
                              placeholder="https://images.unsplash.com/photo-..."
                              className="flex-grow bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold-500 font-medium"
                            />
                            <button
                              type="submit"
                              className="px-4 py-3 bg-[#0d2244] text-white rounded-xl text-xs font-bold hover:bg-navy-900 transition-all"
                            >
                              Load
                            </button>
                          </div>
                          <p className="text-[10px] text-stone-400 font-medium leading-relaxed">
                            Paste any valid web URL to substitute the picture. Perfect for connecting images hosted on Imgur, Unsplash, or your own domains.
                          </p>
                        </form>
                      </motion.div>
                    )}

                    {activeTab === 'library' && (
                      <motion.div
                        key="library"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3"
                      >
                        <label className="block text-[10px] font-mono font-black text-stone-500 uppercase tracking-wider">
                          Choose from existing Ranch Photos
                        </label>
                        <div className="grid grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                          {PREBUILT_LOCKED_IMAGES.map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setPreviewSrc(item.url);
                                if (!item.url.startsWith('data:')) {
                                  setUrlInput(item.url);
                                }
                              }}
                              className={`group relative rounded-xl overflow-hidden aspect-video border-2 transition-all ${
                                previewSrc === item.url 
                                  ? 'border-gold-500 ring-2 ring-gold-400/20' 
                                  : 'border-stone-200 hover:border-stone-400'
                              }`}
                            >
                              <img src={item.url} className="w-full h-full object-cover" alt={item.label} />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
                                <span className="text-[8px] font-mono text-white truncate w-full font-bold">{item.label}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <div className="pt-6 border-t border-stone-100 flex items-center justify-end gap-3 mt-6">
                  <button
                    onClick={onClose}
                    disabled={isSaving}
                    className="px-5 py-3 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 transition-colors text-xs disabled:opacity-55"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (previewSrc) {
                        setIsSaving(true);
                        try {
                          await onSave(previewSrc);
                        } catch (err) {
                          console.error(err);
                        } finally {
                          setIsSaving(false);
                        }
                      }
                    }}
                    disabled={!previewSrc || isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Uploading to Cloud...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Save & Apply
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Visual Preview Card */}
              <div className="bg-stone-50 border border-stone-200/60 rounded-[2rem] p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center space-x-1 bg-stone-200/50 px-2.5 py-1 rounded-full text-stone-600 text-[9px] font-mono font-black uppercase tracking-wider">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Real-time Preview</span>
                  </span>
                  
                  {previewSrc.startsWith('data:') && (
                    <span className="inline-flex items-center space-x-1 bg-emerald-100 px-2.5 py-1 rounded-full text-emerald-700 text-[9px] font-mono font-black uppercase tracking-wider">
                      <span>Custom File</span>
                    </span>
                  )}
                </div>

                <div className="flex-1 bg-white rounded-2xl border border-stone-200 overflow-hidden flex items-center justify-center relative aspect-square max-h-[300px]">
                  {previewSrc ? (
                    <img 
                      src={previewSrc} 
                      className="w-full h-full object-cover" 
                      alt="Preview"
                      onError={() => {
                        alert("We couldn't load that image URL. Please make sure the URL is direct and valid.");
                      }}
                    />
                  ) : (
                    <div className="text-center p-6 text-stone-400">
                      <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-medium">No image preview loaded</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-stone-500 leading-normal">
                      Your changes will update <strong>instantly</strong> on this computer and persist across sessions. To export or share your customized site, simply click the <strong>Share</strong> button in AI Studio!
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Custom wrapper replacing <img> tags seamlessly on the site
interface EditableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageId?: string;
  src?: string;
  className?: string;
  alt?: string;
  loading?: "lazy" | "eager";
}

export function EditableImage({ imageId, src, className, alt, loading, ...props }: EditableImageProps) {
  const { isEditMode, openEditor, resolveImage } = useImageEdit();
  
  // Use unique imageId if specified, else fall back to the raw source path as key
  const effectiveId = imageId || src || '';
  const resolvedSrc = resolveImage(effectiveId);

  if (!isEditMode) {
    return (
      <img
        src={resolvedSrc}
        className={className}
        alt={alt}
        loading={loading}
        referrerPolicy="no-referrer"
        {...props}
      />
    );
  }

  return (
    <div className="group relative" style={{ display: 'contents' }}>
      {/* Wrapper enclosing standard image to support overlays properly */}
      <div className={`relative overflow-hidden inline-block ${className || 'w-full h-full'}`}>
        <img
          src={resolvedSrc}
          className="w-full h-full object-cover"
          alt={alt}
          loading={loading}
          referrerPolicy="no-referrer"
          {...props}
        />
        
        {/* Hover Pencil/Camera trigger overlay */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            openEditor(effectiveId, resolvedSrc);
          }}
          className="absolute inset-0 bg-black/50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center cursor-pointer z-30"
        >
          <div className="p-3 bg-gold-500 text-navy-950 rounded-full shadow-2xl scale-95 md:scale-75 group-hover:scale-100 transition-transform duration-300">
            <Camera className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-white text-[9px] font-mono font-black uppercase tracking-wider mt-2.5 bg-black/40 px-2.5 py-1 rounded-full border border-white/15">
            Replace Image
          </span>
        </div>
      </div>
    </div>
  );
}
