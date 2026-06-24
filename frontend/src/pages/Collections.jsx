import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLuxe } from '../context/LuxeContext.jsx';

const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

function Collections() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { products, categories, addToCart, toggleWishlist, wishlist } = useLuxe();

  const selectedCategory = useMemo(() => {
    if (!categoryName) return 'All';
    const found = categories.find(cat => slugify(cat) === categoryName);
    return found || 'All';
  }, [categoryName, categories]);

  const filtered = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter(prod => prod.category === selectedCategory);
  }, [selectedCategory, products]);

  const handleCategorySelect = (category) => {
    if (category === 'All') {
      navigate('/collections');
    } else {
      navigate(`/collections/${slugify(category)}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12 space-y-2">
        <span className="text-xs tracking-[0.3em] text-luxury-gold uppercase font-semibold">TRINKETS VAULT</span>
        <h1 className="text-4xl md:text-5xl font-serif text-white">
          {selectedCategory === 'All' ? 'The Prestige Collections' : selectedCategory}
        </h1>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
        <p className="text-slate-400 text-sm max-w-lg mx-auto font-light pt-2">
          Explore our curated vault of world-class ornaments, hand-selected for elite patrons.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <button
          onClick={() => handleCategorySelect('All')}
          className={`px-5 py-2 text-xs tracking-widest uppercase rounded border transition-all ${
            selectedCategory === 'All'
              ? 'bg-luxury-gold text-luxury-black border-luxury-gold font-semibold'
              : 'border-slate-800 text-slate-400 hover:border-gold-500/30'
          }`}
        >
          All Pieces
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
            className={`px-5 py-2 text-xs tracking-widest uppercase rounded border transition-all ${
              selectedCategory === cat
                ? 'bg-luxury-gold text-luxury-black border-luxury-gold font-semibold'
                : 'border-slate-800 text-slate-400 hover:border-gold-500/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="text-center text-slate-500 py-16">No items currently active in this vault section.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((prod) => {
            const isWishlisted = wishlist.includes(prod.id);
            return (
              <div key={prod.id} className="glass-panel p-5 rounded-2xl space-y-4 hover:border-gold-500/30 transition-all group flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-luxury-dark">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <button onClick={() => toggleWishlist(prod.id)} className="absolute top-4 right-4 p-2.5 rounded-full bg-luxury-black/60 border border-gold-500/10 text-slate-300 hover:text-luxury-gold transition-colors z-20">
                      <svg className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-luxury-gold uppercase tracking-widest">{prod.category}</span>
                      {prod.rating && <span className="text-[10px] text-slate-400">⭐ {prod.rating}</span>}
                    </div>
                    <h3 className="font-serif text-white text-lg font-medium">{prod.name}</h3>
                    <p className="text-xs text-slate-400 font-light line-clamp-2">{prod.description}</p>
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-slate-900/50 mt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-500">Rental Rate</span>
                    <div>
                      <span className="text-lg font-semibold text-white">${prod.dailyRent}</span>
                      <span className="text-[10px] text-slate-400">/day</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to={`/product/${prod.id}`} className="text-center py-2.5 border border-slate-800 hover:border-gold-500 text-xs text-slate-300 hover:text-white transition-all uppercase rounded-lg">View Details</Link>
                    <button onClick={() => { addToCart(prod, 1); }} className="py-2.5 gold-gradient-bg text-luxury-black text-xs font-semibold uppercase tracking-wider rounded-lg hover:opacity-90 transition-all">Rent Now</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Collections;
