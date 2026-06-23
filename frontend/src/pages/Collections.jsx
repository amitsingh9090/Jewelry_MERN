import React, { useState } from 'react';
import { useLuxe } from '../context/LuxeContext.jsx';
import { Link, useParams, useNavigate } from 'react-router-dom';

const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

function Collections() {
  const { products, addToCart, toggleWishlist, wishlist, categories } = useLuxe();
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Default');

  // Determine active category based on URL parameter slug
  const activeCategory = categoryName 
    ? (categories.find(c => slugify(c) === categoryName) || 'All')
    : 'All';

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.dailyRent - b.dailyRent;
    if (sortBy === 'price-desc') return b.dailyRent - a.dailyRent;
    if (sortBy === 'rating-desc') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-10 space-y-2">
        <span className="text-xs tracking-[0.3em] text-luxury-gold uppercase font-semibold">VALENTINA VAULTS</span>
        <h1 className="text-4xl md:text-5xl font-serif text-white">The Prestige Collections</h1>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
      </div>

      {/* Filters, Sorting, and Search */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-8 border-b border-slate-900 pb-6">
        <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
          <button
            onClick={() => navigate('/collections')}
            className={`px-4 py-2 text-xs tracking-widest uppercase rounded border transition-all ${
              activeCategory === 'All'
                ? 'bg-luxury-gold text-luxury-black border-luxury-gold font-semibold'
                : 'border-slate-800 text-slate-400 hover:border-gold-500/30'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => navigate(`/collections/${slugify(cat)}`)}
              className={`px-4 py-2 text-xs tracking-widest uppercase rounded border transition-all ${
                activeCategory === cat
                  ? 'bg-luxury-gold text-luxury-black border-luxury-gold font-semibold'
                  : 'border-slate-800 text-slate-400 hover:border-gold-500/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="flex gap-4 w-full lg:w-auto items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-luxury-charcoal border border-slate-800 rounded px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-gold-500"
          >
            <option value="Default">Sort: Default</option>
            <option value="price-asc">Rent: Low to High</option>
            <option value="price-desc">Rent: High to Low</option>
            <option value="rating-desc">Rating: Highest</option>
          </select>

          <input
            type="text"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-luxury-charcoal border border-slate-800 rounded px-4 py-2 text-xs text-slate-300 focus:outline-none focus:border-gold-500 flex-1 lg:flex-initial lg:w-64"
          />
        </div>
      </div>

      {/* Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-center text-slate-500 py-16">
          No luxury pieces found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProducts.map((p) => {
            const isWishlisted = wishlist.includes(p.id);
            return (
              <div key={p.id} className="glass-panel p-5 rounded-2xl space-y-4 hover:border-gold-500/30 transition-all group flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-luxury-dark">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="absolute top-4 right-4 p-2.5 rounded-full bg-luxury-black/60 border border-gold-500/10 text-slate-300 hover:text-luxury-gold transition-colors z-20"
                    >
                      <svg className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                    <span className="absolute bottom-4 left-4 bg-luxury-black/75 px-3 py-1 rounded text-[10px] text-luxury-gold tracking-widest uppercase">
                      {p.category}
                    </span>
                  </div>

                  <div className="space-y-2 mt-4">
                    <h3 className="font-serif text-white text-lg font-medium tracking-wide">{p.name}</h3>
                    <p className="text-xs text-slate-400 font-light line-clamp-2 leading-relaxed">{p.description}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-900/50 mt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-500">Rental Rate</span>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-white">${p.dailyRent}</span>
                      <span className="text-[10px] text-slate-400">/day</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to={`/product/${p.id}`}
                      className="text-center py-2.5 border border-slate-800 hover:border-gold-500 text-xs text-slate-300 hover:text-white transition-all uppercase font-medium rounded-lg"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => addToCart(p, 1)}
                      className="py-2.5 gold-gradient-bg text-luxury-black text-xs font-semibold uppercase tracking-wider rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                      Rent Now
                    </button>
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