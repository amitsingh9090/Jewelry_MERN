import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-6 min-h-[60vh] flex flex-col justify-center items-center">
      <div className="space-y-2">
        <span className="text-xs tracking-[0.3em] text-luxury-gold uppercase font-semibold">VALENTINA LUXE</span>
        <h1 className="text-3xl md:text-5xl font-serif text-white font-medium">Vault Piece Not Found (404)</h1>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
      </div>
      
      <p className="text-slate-400 text-sm max-w-md font-light leading-relaxed">
        The requested luxury page or vault item does not exist or has been temporarily removed. Please use the menu navigation or explore our premium collections.
      </p>

      <div className="pt-4 flex gap-4">
        <Link to="/" className="px-6 py-2 bg-gold-500 text-luxury-black text-xs font-semibold uppercase tracking-widest rounded transition-opacity hover:opacity-90">
          Return Home
        </Link>
        <Link to="/collections" className="px-6 py-2 border border-gold-500/30 text-gold-300 text-xs font-semibold uppercase tracking-widest rounded hover:bg-gold-500/10">
          Browse Catalog
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
