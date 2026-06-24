import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLuxe } from '../context/LuxeContext.jsx';

const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

function Header() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart, categories, occasions, cultures, festivals } = useLuxe();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-gold-500/10 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Mobile/Tablet Menu Button & Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden text-slate-300 bg-slate-900/40 border border-gold-500/10 backdrop-blur-md p-2 rounded-full shadow-lg hover:text-luxury-gold hover:border-gold-500/30 transition-all duration-300 focus:outline-none flex items-center justify-center cursor-pointer"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <Link to="/" className="flex flex-col items-center select-none group">
            <span className="text-2xl md:text-3xl font-serif tracking-[0.2em] text-white font-bold group-hover:text-luxury-gold transition-colors duration-300">
              TRINKETS
            </span>
            <span className="text-[8px] tracking-[0.25em] text-luxury-gold uppercase font-light -mt-0.5">
              Jewelry Rental Store
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-xs tracking-[0.2em] font-light text-slate-300">
          <Link to="/" className="hover:text-luxury-gold transition-colors py-2">HOME</Link>
          <Link to="/about" className="hover:text-luxury-gold transition-colors py-2">ABOUT</Link>

          {/* Collections Dropdown */}
          <div className="relative" onMouseEnter={() => setActiveDropdown('collections')} onMouseLeave={() => setActiveDropdown(null)}>
            <button className="hover:text-luxury-gold transition-colors py-2 flex items-center gap-1 focus:outline-none">
              COLLECTIONS
              <span className="text-[10px]">▼</span>
            </button>
            {activeDropdown === 'collections' && (
              <div className="absolute top-full left-0 w-64 bg-luxury-dark/95 border border-gold-500/10 rounded-lg p-4 shadow-xl grid gap-2.5 z-50 backdrop-blur-md">
                <Link to="/collections" className="text-[10px] text-slate-300 hover:text-luxury-gold tracking-widest block transition-colors font-semibold border-b border-slate-800 pb-1">ALL COLLECTIONS</Link>
                {categories.map((cat) => (
                  <Link 
                    key={cat}
                    to={`/collections/${slugify(cat)}`} 
                    className="text-[10px] text-slate-300 hover:text-luxury-gold tracking-widest block transition-colors uppercase"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Wedding Dropdown */}
          <div className="relative" onMouseEnter={() => setActiveDropdown('wedding')} onMouseLeave={() => setActiveDropdown(null)}>
            <button className="hover:text-luxury-gold transition-colors py-2 flex items-center gap-1 focus:outline-none">
              WEDDING VAULT
              <span className="text-[10px]">▼</span>
            </button>
            {activeDropdown === 'wedding' && (
              <div className="absolute top-full left-0 w-64 bg-luxury-dark/95 border border-gold-500/10 rounded-lg p-4 shadow-xl grid gap-2.5 z-50 backdrop-blur-md">
                <Link to="/wedding" className="text-[10px] text-slate-300 hover:text-luxury-gold tracking-widest block transition-colors font-semibold border-b border-slate-800 pb-1">ALL WEDDING JEWELRY</Link>
                {occasions.map((occ) => (
                  <Link 
                    key={occ}
                    to={`/wedding/${slugify(occ)}`} 
                    className="text-[10px] text-slate-300 hover:text-luxury-gold tracking-widest block transition-colors uppercase"
                  >
                    {occ}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Cultures Dropdown */}
          <div className="relative" onMouseEnter={() => setActiveDropdown('culture')} onMouseLeave={() => setActiveDropdown(null)}>
            <button className="hover:text-luxury-gold transition-colors py-2 flex items-center gap-1 focus:outline-none">
              CULTURES
              <span className="text-[10px]">▼</span>
            </button>
            {activeDropdown === 'culture' && (
              <div className="absolute top-full left-0 w-64 bg-luxury-dark/95 border border-gold-500/10 rounded-lg p-4 shadow-xl grid gap-2.5 z-50 backdrop-blur-md">
                <Link to="/cultural" className="text-[10px] text-slate-300 hover:text-luxury-gold tracking-widest block transition-colors font-semibold border-b border-slate-800 pb-1">ALL CULTURAL</Link>
                {cultures.map((cult) => (
                  <Link 
                    key={cult}
                    to={`/cultural/${slugify(cult)}`} 
                    className="text-[10px] text-slate-300 hover:text-luxury-gold tracking-widest block transition-colors uppercase"
                  >
                    {cult}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Festivals Dropdown */}
          <div className="relative" onMouseEnter={() => setActiveDropdown('festivals')} onMouseLeave={() => setActiveDropdown(null)}>
            <button className="hover:text-luxury-gold transition-colors py-2 flex items-center gap-1 focus:outline-none">
              FESTIVALS
              <span className="text-[10px]">▼</span>
            </button>
            {activeDropdown === 'festivals' && (
              <div className="absolute top-full left-0 w-64 bg-luxury-dark/95 border border-gold-500/10 rounded-lg p-4 shadow-xl grid gap-2.5 z-50 backdrop-blur-md">
                <Link to="/festivals" className="text-[10px] text-slate-300 hover:text-luxury-gold tracking-widest block transition-colors font-semibold border-b border-slate-800 pb-1">ALL FESTIVALS</Link>
                {festivals.map((fest) => (
                  <Link 
                    key={fest}
                    to={`/festivals/${slugify(fest)}`} 
                    className="text-[10px] text-slate-300 hover:text-luxury-gold tracking-widest block transition-colors uppercase"
                  >
                    {fest}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/contact" className="hover:text-luxury-gold transition-colors py-2">CONTACT</Link>
        </nav>

        {/* User / Cart Actions */}
        <div className="flex items-center gap-5 text-slate-300">
          <Link to="/cart" className="hover:text-luxury-gold transition-colors relative" title="Shopping Cart">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-luxury-gold text-luxury-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cart.reduce((sum, item) => sum + item.qty, 0)}
              </span>
            )}
          </Link>
          <Link to="/login" className="hover:text-luxury-gold transition-colors" title="Account Dashboard">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Mobile/Tablet Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-luxury-black/95 border-b border-gold-500/10 p-6 shadow-2xl backdrop-blur-md z-40 max-h-[85vh] overflow-y-auto space-y-6">
          <div className="flex flex-col gap-4 text-xs tracking-[0.25em] font-light text-slate-300">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-luxury-gold transition-colors py-1.5 border-b border-slate-900">HOME</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-luxury-gold transition-colors py-1.5 border-b border-slate-900">ABOUT</Link>
            
            {/* Collections Section */}
            <div className="space-y-2 py-1.5 border-b border-slate-900">
              <span className="text-[10px] text-luxury-gold uppercase tracking-[0.2em] font-bold block mb-1">COLLECTIONS</span>
              <Link to="/collections" onClick={() => setMobileMenuOpen(false)} className="block pl-4 text-[11px] text-slate-300 hover:text-luxury-gold transition-colors py-1">ALL COLLECTIONS</Link>
              {categories.map((cat) => (
                <Link key={cat} to={`/collections/${slugify(cat)}`} onClick={() => setMobileMenuOpen(false)} className="block pl-4 text-[11px] text-slate-400 hover:text-luxury-gold transition-colors py-1 uppercase">{cat}</Link>
              ))}
            </div>

            {/* Wedding Vault Section */}
            <div className="space-y-2 py-1.5 border-b border-slate-900">
              <span className="text-[10px] text-luxury-gold uppercase tracking-[0.2em] font-bold block mb-1">WEDDING VAULT</span>
              <Link to="/wedding" onClick={() => setMobileMenuOpen(false)} className="block pl-4 text-[11px] text-slate-300 hover:text-luxury-gold transition-colors py-1">ALL WEDDING JEWELRY</Link>
              {occasions.map((occ) => (
                <Link key={occ} to={`/wedding/${slugify(occ)}`} onClick={() => setMobileMenuOpen(false)} className="block pl-4 text-[11px] text-slate-400 hover:text-luxury-gold transition-colors py-1 uppercase">{occ}</Link>
              ))}
            </div>

            {/* Cultures Section */}
            <div className="space-y-2 py-1.5 border-b border-slate-900">
              <span className="text-[10px] text-luxury-gold uppercase tracking-[0.2em] font-bold block mb-1">CULTURES</span>
              <Link to="/cultural" onClick={() => setMobileMenuOpen(false)} className="block pl-4 text-[11px] text-slate-300 hover:text-luxury-gold transition-colors py-1">ALL CULTURAL</Link>
              {cultures.map((cult) => (
                <Link key={cult} to={`/cultural/${slugify(cult)}`} onClick={() => setMobileMenuOpen(false)} className="block pl-4 text-[11px] text-slate-400 hover:text-luxury-gold transition-colors py-1 uppercase">{cult}</Link>
              ))}
            </div>

            {/* Festivals Section */}
            <div className="space-y-2 py-1.5 border-b border-slate-900">
              <span className="text-[10px] text-luxury-gold uppercase tracking-[0.2em] font-bold block mb-1">FESTIVALS</span>
              <Link to="/festivals" onClick={() => setMobileMenuOpen(false)} className="block pl-4 text-[11px] text-slate-300 hover:text-luxury-gold transition-colors py-1">ALL FESTIVALS</Link>
              {festivals.map((fest) => (
                <Link key={fest} to={`/festivals/${slugify(fest)}`} onClick={() => setMobileMenuOpen(false)} className="block pl-4 text-[11px] text-slate-400 hover:text-luxury-gold transition-colors py-1 uppercase">{fest}</Link>
              ))}
            </div>

            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-luxury-gold transition-colors py-1.5">CONTACT</Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
