import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to Trinkets newsletter!');
  };

  return (
    <footer className="bg-luxury-dark border-t border-gold-500/10 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand details */}
        <div className="space-y-4">
          <Link to="/" className="flex flex-col select-none">
            <span className="text-xl font-serif tracking-[0.2em] text-white font-bold">
              TRINKETS
            </span>
            <span className="text-[8px] tracking-[0.25em] text-luxury-gold uppercase font-light -mt-0.5">
              Jewelry Rental Store
            </span>
          </Link>
          <p className="text-xs text-slate-500 font-light leading-relaxed">
            Curated high-end jewelry rentals. Wear the most iconic diamond, emerald, and traditional creations for your most remarkable memories.
          </p>
        </div>

        {/* Categories / Occasions */}
        <div className="space-y-3">
          <h4 className="text-white text-xs font-serif tracking-widest uppercase font-bold">OCCASIONS</h4>
          <ul className="space-y-2 text-xs font-light">
            <li><Link to="/wedding" className="hover:text-luxury-gold transition-colors">Wedding Vault</Link></li>
            <li><Link to="/wedding/haldi" className="hover:text-luxury-gold transition-colors">Haldi Collection</Link></li>
            <li><Link to="/wedding/mehndi" className="hover:text-luxury-gold transition-colors">Mehndi Collection</Link></li>
            <li><Link to="/wedding/engagement" className="hover:text-luxury-gold transition-colors">Engagement Vault</Link></li>
            <li><Link to="/wedding/reception" className="hover:text-luxury-gold transition-colors">Reception Collection</Link></li>
          </ul>
        </div>

        {/* Legal & Info */}
        <div className="space-y-3">
          <h4 className="text-white text-xs font-serif tracking-widest uppercase font-bold">INFORMATION</h4>
          <ul className="space-y-2 text-xs font-light">
            <li><Link to="/about" className="hover:text-luxury-gold transition-colors">Our History</Link></li>
            <li><Link to="/contact" className="hover:text-luxury-gold transition-colors">Contact Support</Link></li>
            <li><Link to="/faq" className="hover:text-luxury-gold transition-colors">FAQs & Guides</Link></li>
            <li><Link to="/privacy" className="hover:text-luxury-gold transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-luxury-gold transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/admin" className="hover:text-luxury-gold transition-colors text-luxury-gold font-medium">Backoffice Admin</Link></li>

          </ul>
        </div>

        {/* Newsletter Signup */}
        <div className="space-y-4">
          <h4 className="text-white text-xs font-serif tracking-widest uppercase font-bold">THE VAULT CLUB</h4>
          <p className="text-xs text-slate-500 font-light leading-relaxed">
            Subscribe to receive exclusive collection updates, seasonal catalogs, and member discounts.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="flex-1 bg-luxury-charcoal border border-slate-800 rounded px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-gold-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gold-500 text-luxury-black font-semibold text-xs rounded hover:opacity-90 transition-opacity"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-slate-900 py-6 text-center text-[10px] text-slate-600 tracking-wider">
        <p>© 2026 TRINKETS (Jewelry Rental Store). Powered by React 19 & Express. Created under Gemini Antigravity.</p>
      </div>
    </footer>
  );
}

export default Footer;
