import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLuxe } from '../context/LuxeContext.jsx';

function ProductDetails() {
  const { id } = useParams();
  const { products, addToCart, toggleWishlist, wishlist, addProductReview } = useLuxe();
  
  const product = useMemo(() => {
    return products.find(p => p.id === Number(id)) || products[0];
  }, [id, products]);

  // General details states
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 3);
    return tomorrow.toISOString().split('T')[0];
  });
  const [qty, setQty] = useState(1);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  // Interactive Media Modals State
  const [activeMediaMode, setActiveMediaMode] = useState(null); // '360' or 'video' or null
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  // Drag-to-rotate state for 360°
  const isDragging = useRef(false);
  const startX = useRef(0);

  // Video interval ref
  const videoInterval = useRef(null);

  const rentalDays = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.max(0, end.getTime() - start.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
  }, [startDate, endDate]);

  const isWishlisted = wishlist.includes(product.id);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    addProductReview(product.id, { name: reviewName, comment: reviewComment, rating: reviewRating });
    setReviewName('');
    setReviewComment('');
  };

  // Video playback simulation
  useEffect(() => {
    if (isVideoPlaying) {
      videoInterval.current = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            return 0; // loop
          }
          return prev + 1.5;
        });
      }, 100);
    } else {
      clearInterval(videoInterval.current);
    }
    return () => clearInterval(videoInterval.current);
  }, [isVideoPlaying]);

  // Drag handlers for 360
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startX.current;
    startX.current = e.clientX;
    setRotationAngle(prev => (prev + deltaX + 360) % 360);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-6">
        <Link to="/collections" className="text-xs text-luxury-gold tracking-widest uppercase hover:underline">← Back to Collections</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Images & Interactive Launchers */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-luxury-dark border border-gold-500/10">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="aspect-square rounded-lg border border-gold-500/20 overflow-hidden cursor-pointer">
              <img src={product.image} className="w-full h-full object-cover" alt="" />
            </div>
            
            {/* 360° Thumbnail Launcher */}
            <div 
              onClick={() => { setActiveMediaMode('360'); setRotationAngle(0); }}
              className="aspect-square rounded-lg border border-slate-900 overflow-hidden bg-luxury-charcoal hover:border-gold-500/40 transition-colors flex flex-col items-center justify-center text-center cursor-pointer text-slate-300 gap-1.5 p-2"
            >
              <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-white">360° Preview</span>
            </div>

            {/* Video Walk Thumbnail Launcher */}
            <div 
              onClick={() => { setActiveMediaMode('video'); setIsVideoPlaying(true); setVideoProgress(0); }}
              className="aspect-square rounded-lg border border-slate-900 overflow-hidden bg-luxury-charcoal hover:border-gold-500/40 transition-colors flex flex-col items-center justify-center text-center cursor-pointer text-slate-300 gap-1.5 p-2"
            >
              <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-white">Video Walk</span>
            </div>
          </div>
        </div>

        {/* Right Side: Details & Rental Action */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs uppercase text-luxury-gold tracking-widest font-semibold">{product.category}</span>
            <h1 className="text-3xl md:text-4xl font-serif text-white mt-1">{product.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs text-slate-400">⭐ {product.rating} / 5.0 (42 Patron Reviews)</span>
            </div>
          </div>

          <p className="text-slate-300 text-sm font-light leading-relaxed">{product.description}</p>

          <div className="border-y border-slate-900 py-4 grid grid-cols-3 gap-4 text-xs font-light text-slate-400">
            <div><span className="block text-slate-500">Weight:</span> <strong className="text-white">{product.weight}</strong></div>
            <div><span className="block text-slate-500">Material:</span> <strong className="text-white">{product.material}</strong></div>
            <div><span className="block text-slate-500">Sizing:</span> <strong className="text-white">{product.size}</strong></div>
          </div>

          {/* Date Picker Calculator */}
          <div className="glass-panel p-6 rounded-xl border border-gold-500/15 space-y-4">
            <h3 className="font-serif text-white text-sm">Calculate & Rent</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Quantity</label>
              <input type="number" min="1" value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none" />
            </div>

            <div className="border-t border-slate-800 pt-3 text-xs text-slate-400 space-y-2">
              <div className="flex justify-between"><span>Rental Base Cost ({rentalDays} days)</span><span className="text-white font-semibold">\${product.dailyRent * rentalDays * qty}</span></div>
              <div className="flex justify-between"><span>Security Deposit (Refundable)</span><span>\${product.deposit * qty}</span></div>
              <div className="flex justify-between text-white font-serif border-t border-slate-900 pt-2 font-bold">
                <span>Total Quote</span><span>\${(product.dailyRent * rentalDays * qty) + (product.deposit * qty) + Math.round(product.dailyRent * rentalDays * qty * 0.08)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button onClick={() => toggleWishlist(product.id)} className="w-full py-3 border border-slate-800 hover:border-gold-500 rounded-lg text-xs text-slate-300 font-semibold uppercase tracking-wider transition-colors">
                {isWishlisted ? '❤️ Wishlisted' : '🤍 Add Wishlist'}
              </button>
              <button onClick={() => addToCart(product, qty, startDate, endDate)} className="w-full py-3 gold-gradient-bg text-luxury-black font-semibold text-xs rounded-lg uppercase tracking-wider">
                Rent Vault Piece
              </button>
            </div>
          </div>

          {/* Reviews list */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="font-serif text-white text-base">Client Reviews</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Your Name" value={reviewName} onChange={(e) => setReviewName(e.target.value)} className="bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none" />
                <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} className="bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none">
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                </select>
              </div>
              <textarea placeholder="Write your review comments..." value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows="3" className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none"></textarea>
              <button type="submit" className="px-4 py-2 border border-gold-500/30 text-xs text-gold-300 rounded hover:bg-gold-500/10">Submit Review</button>
            </form>
          </div>
        </div>
      </div>

      {/* 360° PREVIEW INTERACTIVE MODAL */}
      {activeMediaMode === '360' && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="relative glass-panel max-w-2xl w-full p-8 rounded-2xl border border-gold-500/30 flex flex-col items-center">
            <button 
              onClick={() => setActiveMediaMode(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
            >
              ✕
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-xl font-serif text-white">360° Interactive Vault Viewer</h2>
              <p className="text-xs text-slate-400 mt-1">Click & drag your mouse or adjust the slider to rotate the piece</p>
            </div>

            {/* Rotating Canvas Wrapper */}
            <div 
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="relative w-72 h-72 rounded-xl bg-luxury-dark border border-slate-900 cursor-ew-resize flex items-center justify-center overflow-hidden select-none"
            >
              {/* Dynamic Facet Reflector Shine */}
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-color-dodge transition-all duration-300"
                style={{
                  background: `linear-gradient(${rotationAngle}deg, transparent 35%, rgba(204, 162, 106, 0.25) 50%, transparent 65%)`
                }}
              />
              <img 
                src={product.image} 
                alt="" 
                className="w-56 h-56 object-cover rounded-lg pointer-events-none transition-transform duration-100"
                style={{
                  transform: `rotateY(${rotationAngle}deg) rotateX(${rotationAngle / 12}deg) scale(1.05)`,
                  filter: `drop-shadow(0 15px 15px rgba(0,0,0,0.6))`
                }}
              />
            </div>

            {/* Slider Control */}
            <div className="w-full max-w-sm mt-8 space-y-2">
              <div className="flex justify-between text-[10px] tracking-widest text-slate-500 uppercase">
                <span>Angle: {rotationAngle}°</span>
                <span>Refractions: Active</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="359" 
                value={rotationAngle}
                onChange={(e) => setRotationAngle(Number(e.target.value))}
                className="w-full accent-luxury-gold cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* VIDEO WALK INTERACTIVE MODAL */}
      {activeMediaMode === 'video' && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="relative glass-panel max-w-2xl w-full p-8 rounded-2xl border border-gold-500/30 flex flex-col items-center">
            <button 
              onClick={() => { setActiveMediaMode(null); setIsVideoPlaying(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
            >
              ✕
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-xl font-serif text-white">Luxury Video Walkthrough</h2>
              <p className="text-xs text-slate-400 mt-1">Simulating high-resolution close-up scanning facets</p>
            </div>

            {/* Video Canvas Box with auto pan scanning */}
            <div className="relative w-full h-80 bg-luxury-dark rounded-xl border border-slate-900 overflow-hidden flex items-center justify-center">
              
              {/* Scanline camera overlay */}
              <div className="absolute inset-0 border-[10px] border-luxury-charcoal pointer-events-none z-20 flex justify-between p-4">
                <span className="text-[9px] tracking-widest font-mono text-rose-500 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 bg-rose-600 rounded-full ${isVideoPlaying ? 'animate-ping' : ''}`} />
                  REC 4K HDR
                </span>
                <span className="text-[9px] tracking-widest font-mono text-slate-400">1/60 ISO200</span>
              </div>

              {/* Panning animation wrapper */}
              <div 
                className="w-full h-full transition-transform duration-[600ms] ease-out"
                style={{
                  transform: isVideoPlaying 
                    ? `scale(${1.2 + Math.sin(videoProgress / 10) * 0.15}) translate(${Math.cos(videoProgress / 5) * 8}px, ${Math.sin(videoProgress / 7) * 8}px)`
                    : 'scale(1.1)'
                }}
              >
                <img src={product.image} className="w-full h-full object-cover" alt="" />
              </div>
            </div>

            {/* Video Controls bar */}
            <div className="w-full mt-6 space-y-4">
              {/* Progress bar */}
              <div className="relative w-full h-1 bg-slate-900 rounded overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-luxury-gold transition-all duration-100" 
                  style={{ width: `${videoProgress}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-xs">
                {/* Play/Pause Button */}
                <button 
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="px-4 py-2 border border-gold-500/30 hover:bg-gold-500/10 text-gold-300 rounded font-semibold tracking-wider uppercase text-[10px]"
                >
                  {isVideoPlaying ? 'Pause Walk' : 'Play Walk'}
                </button>

                <span className="font-mono text-[10px] text-slate-500">
                  {Math.floor(videoProgress / 20)}s / 5s (Looping)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ProductDetails;
