import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLuxe } from '../context/LuxeContext.jsx';

const HERO_SLIDES = [
  {
    id: 1,
    title: 'The Royal Bridal Collection',
    tagline: 'CURATED HERITAGE PIECES',
    desc: 'Bespoke diamond and kundan creations for your once-in-a-lifetime celebrations.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1600',
    link: '/wedding'
  },
  {
    id: 2,
    title: 'Imperial Emerald Vault',
    tagline: 'EXQUISITE LUXURY CREATIONS',
    desc: 'Dazzling Zambian emeralds combined with flawless diamonds set in platinum.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1600',
    link: '/collections/premium-jewelry'
  },
  {
    id: 3,
    title: 'Heritage Temple Gold',
    tagline: 'CULTURAL ANCESTRAL WEAVE',
    desc: 'Intricately handcrafted antique gold sets showcasing classical Indian mythology.',
    image: 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&q=80&w=1600',
    link: '/collections/temple-jewelry'
  }
];

const FESTIVAL_COLLECTIONS = [
  { name: 'Diwali Sparkle', image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=400', link: '/festivals/diwali-sparkle' },
  { name: 'Navratri Heritage', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400', link: '/festivals/navratri-heritage' },
  { name: 'Eid Opulence', image: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?auto=format&fit=crop&q=80&w=400', link: '/festivals/eid-opulence' }
];

const WEDDING_COLLECTIONS = [
  { name: 'Haldi Ceremonial', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400', link: '/wedding/haldi-collection' },
  { name: 'Mehndi Traditions', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=400', link: '/wedding/mehndi-collection' },
  { name: 'Engagement Vault', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400', link: '/wedding/engagement-collection' },
  { name: 'Reception Elegance', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400', link: '/wedding/reception-collection' }
];

const VAULT_LOOKS = [
  { id: 1, url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600', productId: 1, patron: 'Duchess Katherine', occasion: 'Autumn Charity Gala', product: 'The Empress Emerald Necklace' },
  { id: 2, url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600', productId: 2, patron: 'Princess Ananya', occasion: 'Royal Sangeet Night', product: 'Royal Kundan Choker Set' },
  { id: 3, url: 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&q=80&w=600', productId: 3, patron: 'Lady Beatrice', occasion: 'Valkyrie Soirée', product: 'Valkyrie Diamond Tiara' },
  { id: 4, url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=600', productId: 11, patron: 'Aria Sterling', occasion: 'Traditional Haldi Ceremony', product: 'Marigold Floral Haldi Choker' },
  { id: 5, url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600', productId: 5, patron: 'Meera Rajput', occasion: 'Spring Mehndi Celebration', product: 'Ethereal Floral Haldi Set' },
  { id: 6, url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600', productId: 7, patron: 'Viscountess Diana', occasion: 'Engagement Gala', product: 'Royal Solitaire Engagement Ring' }
];

function Home() {
  const { products, addToCart, toggleWishlist, wishlist, user } = useLuxe();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeLook, setActiveLook] = useState(null);

  // Select 4 trending items from our actual products catalog (IDs: 3, 1, 2, 4)
  const trendingItems = products.filter(p => [3, 1, 2, 4].includes(p.id));

  // Auto-play slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-luxury-black text-slate-100 min-h-screen">
      
      {/* Full-Screen Hero Slider */}
      <section className="relative h-[85vh] overflow-hidden flex items-center justify-center">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/60 z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover transform scale-105 animate-kenburns"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-20 px-6 animate-fade-up">
              <span className="text-xs md:text-sm tracking-[0.4em] text-luxury-gold uppercase font-bold mb-4">
                {slide.tagline}
              </span>
              <h1 className="text-4xl md:text-7xl font-serif text-white font-bold leading-tight tracking-wider mb-6 max-w-4xl">
                {slide.title}
              </h1>
              <p className="text-slate-300 text-sm md:text-lg max-w-2xl font-light leading-relaxed mb-8">
                {slide.desc}
              </p>
              <Link
                to={slide.link}
                className="px-8 py-3.5 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black font-semibold text-xs tracking-[0.3em] uppercase transition-all duration-300"
              >
                DISCOVER COLLECTION
              </Link>
            </div>

          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-30">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full border border-luxury-gold transition-all duration-300 ${
                idx === currentSlide ? 'bg-luxury-gold scale-125' : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Luxury Promo Bar */}
      <section className="bg-luxury-dark border-y border-gold-500/10 py-6">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-1">
            <h4 className="text-xs uppercase tracking-widest text-white font-semibold">REFUNDABLE DEPOSIT</h4>
            <p className="text-[10px] text-slate-500">100% secure deposits returned instantly on item checkout review</p>
          </div>
          <div className="space-y-1 border-y md:border-y-0 md:border-x border-slate-800 py-4 md:py-0">
            <h4 className="text-xs uppercase tracking-widest text-white font-semibold">INSURED SHIPPING</h4>
            <p className="text-[10px] text-slate-500">Fully door-to-door transit insurance for absolute peace of mind</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs uppercase tracking-widest text-white font-semibold">PRISTINE HYGIENE</h4>
            <p className="text-[10px] text-slate-500">Ultrasonically sanitized and polished before every rental dispatch</p>
          </div>
        </div>
      </section>

      {/* Wedding Collections Highlights */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs tracking-[0.3em] text-luxury-gold uppercase font-semibold">The Bridal Vault</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white">Wedding Collections</h2>
          <div className="w-16 h-[1px] bg-luxury-gold mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {WEDDING_COLLECTIONS.map((c, idx) => (
            <Link key={idx} to={c.link} className="group relative overflow-hidden rounded-xl border border-slate-900 aspect-[3/4]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <img
                src={c.image}
                alt={c.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <h3 className="text-sm font-serif text-white tracking-widest uppercase mb-1">{c.name}</h3>
                <span className="text-[9px] text-luxury-gold uppercase tracking-[0.2em] font-light opacity-0 group-hover:opacity-100 transition-opacity">Explore Vault ➔</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Luxury Promo Banner */}
      <section className="relative py-28 flex items-center justify-center overflow-hidden bg-luxury-dark/60">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1600" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-3xl text-center px-6 space-y-6">
          <span className="text-xs uppercase tracking-widest text-luxury-gold">Exclusive Offer</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white">Become a Platinum Member</h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto font-light">
            Unlock premium rentals with zero security deposit options, custom fitting sessions, and private concierge jewelry planning.
          </p>
          {!user ? (
            <Link
              to="/register"
              className="inline-block px-8 py-3 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-wider uppercase hover:shadow-lg transition-all"
            >
              Create Account
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-block px-8 py-3 border border-gold-500/30 text-gold-300 font-semibold text-xs tracking-wider uppercase hover:bg-gold-500/10 transition-all"
            >
              Go to Profile Dashboard
            </Link>
          )}

        </div>
      </section>

      {/* Festival Collections */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs tracking-[0.3em] text-luxury-gold uppercase font-semibold">Occasional Splendor</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white">Festival Collections</h2>
          <div className="w-16 h-[1px] bg-luxury-gold mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FESTIVAL_COLLECTIONS.map((c, idx) => (
            <Link key={idx} to={c.link} className="group relative overflow-hidden rounded-xl border border-slate-900 aspect-video">
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
              <img
                src={c.image}
                alt={c.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 z-20">
                <h3 className="text-base font-serif text-white tracking-widest uppercase mb-1">{c.name}</h3>
                <span className="text-[10px] text-luxury-gold font-light tracking-widest">VIEW OCCASIONS ➔</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Jewelry Showcase (FIXED & FULLY FUNCTIONAL) */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs tracking-[0.3em] text-luxury-gold uppercase font-semibold">Highly Coveted</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white">Trending Vault Rentals</h2>
          <div className="w-16 h-[1px] bg-luxury-gold mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingItems.map((item) => {
            const isWishlisted = wishlist.includes(item.id);
            return (
              <div key={item.id} className="glass-panel p-4 rounded-xl space-y-4 hover:border-gold-500/40 transition-colors group flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      onClick={() => toggleWishlist(item.id)}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-luxury-black/60 border border-gold-500/10 text-slate-300 hover:text-luxury-gold transition-colors z-20"
                    >
                      <svg className="w-3.5 h-3.5" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-1 mt-3">
                    <h3 className="font-serif text-white text-sm font-medium line-clamp-1">{item.name}</h3>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] text-slate-500">Rent Rate</span>
                      <span className="text-xs font-semibold text-luxury-gold">${item.dailyRent}/day</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    to={`/product/${item.id}`}
                    className="text-center w-full py-2 border border-slate-800 hover:border-gold-500 text-[10px] text-slate-300 hover:text-white transition-colors uppercase font-medium rounded-lg"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => addToCart(item, 1)}
                    className="w-full py-2 gold-gradient-bg text-luxury-black font-semibold text-[10px] uppercase rounded-lg hover:opacity-90 active:scale-[0.97] transition-all"
                  >
                    Rent Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="bg-luxury-dark py-20 border-t border-gold-500/10">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <span className="text-xs tracking-[0.3em] text-luxury-gold uppercase">PATRON REVIEWS</span>
          <div className="text-xl md:text-2xl font-serif text-slate-300 italic leading-relaxed">
            "Trinkets was absolutely magical. I rented the Imperial Emerald Necklace for my reception ceremony, and it stole the night. The delivery was perfectly secure, and returning was seamless."
          </div>
          <div className="space-y-1">
            <h4 className="text-white text-sm font-serif font-bold">Lady Isabella Sterling</h4>
            <p className="text-[10px] text-luxury-gold uppercase tracking-widest font-light">Bridal Client, New York</p>
          </div>
        </div>
      </section>

      {/* Instagram Gallery Mockup */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-center font-serif text-lg text-white mb-8 tracking-widest uppercase">SHARE YOUR VAULT LOOKS #TRINKETS</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {VAULT_LOOKS.map((look) => (
            <div 
              key={look.id} 
              onClick={() => setActiveLook(look)}
              className="aspect-square overflow-hidden rounded-lg border border-slate-900 hover:border-gold-500/50 hover:shadow-lg hover:shadow-gold-500/5 transition-all duration-300 cursor-pointer group"
            >
              <img 
                src={look.url} 
                alt={look.product} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox / Patron Spotlight Modal */}
      {activeLook && (
        <div 
          className="fixed inset-0 bg-luxury-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setActiveLook(null)}
        >
          <div 
            className="glass-panel max-w-md w-full rounded-2xl border border-gold-500/20 p-6 space-y-6 relative overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setActiveLook(null)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg transition-colors focus:outline-none"
            >
              ✕
            </button>
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-luxury-dark border border-slate-900 shadow-inner">
              <img src={activeLook.url} alt={activeLook.product} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-2">
              <span className="text-[9px] text-luxury-gold tracking-[0.25em] uppercase font-semibold">PATRON SPOTLIGHT</span>
              <h4 className="text-xl font-serif text-white font-medium">{activeLook.patron}</h4>
              <p className="text-xs text-slate-400 font-light italic">Adored for the {activeLook.occasion}</p>
              <p className="text-xs text-slate-300 font-light pt-2">
                Featured Piece: <strong className="text-luxury-gold font-serif font-normal">{activeLook.product}</strong>
              </p>
            </div>
            <div className="pt-2 flex gap-3">
              <Link 
                to={`/product/${activeLook.productId}`}
                onClick={() => setActiveLook(null)}
                className="flex-1 py-3 text-center gold-gradient-bg text-luxury-black font-semibold text-xs tracking-widest uppercase rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
              >
                View Vault Item
              </Link>
              <button 
                onClick={() => setActiveLook(null)} 
                className="px-5 py-3 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 text-xs tracking-widest uppercase rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brand Partners */}
      <section className="border-t border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-12 text-slate-600 text-xs tracking-[0.4em] uppercase font-serif">
          <span>CARTIER</span>
          <span>TIFFANY & CO.</span>
          <span>BVLGARI</span>
          <span>SWAROVSKI</span>
          <span>BLUE NILE</span>
        </div>
      </section>

    </div>
  );
}

export default Home;
