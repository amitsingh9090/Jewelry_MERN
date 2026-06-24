import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <span className="text-xs tracking-[0.3em] text-luxury-gold uppercase font-semibold">OUR HERITAGE & ARTISTRY</span>
        <h1 className="text-4xl md:text-6xl font-serif text-white font-medium">Valentina Luxe Vault</h1>
        <div className="w-16 h-[1px] bg-luxury-gold mx-auto mt-4" />
        <p className="text-slate-400 text-sm max-w-xl mx-auto font-light leading-relaxed pt-2">
          Crafting exceptional rental experiences for patrons of fine jewelry across generations.
        </p>
      </div>

      {/* Legacy Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-serif text-white">Legacy of Excellence</h2>
          <p className="text-slate-300 text-sm font-light leading-relaxed">
            Founded with a vision to democratize the luxury of high-fine jewelry, Valentina Luxe offers temporary custody of the world's most exquisite necklaces, tiaras, and heritage gold collections.
          </p>
          <p className="text-slate-400 text-sm font-light leading-relaxed">
            Every piece in our vault is curated by our head gemologists and secured under maximum-grade insurance policies, ensuring that you can adorn royal masterworks with absolute confidence and ease.
          </p>
        </div>
        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-luxury-dark border border-gold-500/10 shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800" 
            alt="Artisan Craftsmanship" 
            className="w-full h-full object-cover opacity-90"
          />
        </div>
      </div>

      {/* Core Values / Service Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        <div className="glass-panel p-6 rounded-2xl border border-gold-500/5 space-y-3">
          <span className="text-luxury-gold text-2xl font-serif">01</span>
          <h3 className="text-lg font-serif text-white">Pristine Gemstones</h3>
          <p className="text-slate-400 text-xs font-light leading-relaxed">
            We only acquire high-carat diamonds, Zambian emeralds, and certified gold alloys. Every item is detailed, polished, and micro-cleaned between rental periods.
          </p>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-gold-500/5 space-y-3">
          <span className="text-luxury-gold text-2xl font-serif">02</span>
          <h3 className="text-lg font-serif text-white">White-Glove Delivery</h3>
          <p className="text-slate-400 text-xs font-light leading-relaxed">
            Our premium bookings come with private courier delivery in secure armored boxes, complete with on-site sizing adjustments and security check seals.
          </p>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-gold-500/5 space-y-3">
          <span className="text-luxury-gold text-2xl font-serif">03</span>
          <h3 className="text-lg font-serif text-white">Ethical Sourcing</h3>
          <p className="text-slate-400 text-xs font-light leading-relaxed">
            All diamond mines and gemstone suppliers strictly adhere to the Kimberley Process, securing a transparent conflict-free supply chain.
          </p>
        </div>
      </div>

      {/* Return to Action */}
      <div className="text-center pt-8 space-y-4">
        <h3 className="font-serif text-xl text-white">Ready to experience the Valentina standard?</h3>
        <div className="flex justify-center gap-4">
          <Link to="/collections" className="px-6 py-3 bg-gold-500 text-luxury-black text-xs font-semibold uppercase tracking-widest rounded hover:opacity-90 transition-opacity">
            Explore Vault
          </Link>
          <Link to="/calculator" className="px-6 py-3 border border-gold-500/30 text-gold-300 text-xs font-semibold uppercase tracking-widest rounded hover:bg-gold-500/10 transition-colors">
            Rate Calculator
          </Link>
        </div>
      </div>
    </div>
  );
}

export default About;
