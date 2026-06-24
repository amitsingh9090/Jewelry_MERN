import React from 'react';
import { useLuxe } from '../context/LuxeContext.jsx';
import { Link } from 'react-router-dom';

function Wishlist() {
  const { wishlist, products, toggleWishlist, addToCart } = useLuxe();

  const wishlistedItems = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-serif text-white mb-8 border-b border-slate-900 pb-4">Your Wishlist</h1>

      {wishlistedItems.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <p className="text-slate-500 font-light">Your wishlist is empty.</p>
          <Link to="/collections" className="inline-block px-6 py-2.5 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-wider rounded uppercase">Explore Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistedItems.map((p) => (
            <div key={p.id} className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-luxury-dark">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                <button onClick={() => toggleWishlist(p.id)} className="absolute top-3 right-3 p-2 bg-luxury-black/60 rounded-full text-rose-500 hover:text-slate-300">🗑️</button>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-white text-base">{p.name}</h3>
                <p className="text-xs text-luxury-gold font-semibold">${p.dailyRent}/day</p>
              </div>

              <button
                onClick={() => { addToCart(p, 1); toggleWishlist(p.id); alert('Moved to Cart!'); }}
                className="w-full py-2.5 gold-gradient-bg text-luxury-black font-semibold text-xs rounded-lg uppercase tracking-wider"
              >
                Move to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
