import React from 'react';
import { Link } from 'react-router-dom';

function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-6 min-h-[60vh] flex flex-col justify-center items-center">
      <div className="space-y-2">
        <span className="text-xs tracking-[0.3em] text-luxury-gold uppercase font-semibold">VALENTINA LUXE</span>
        <h1 className="text-3xl md:text-5xl font-serif text-white">Privacy Policy</h1>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
      </div>
      
      <p className="text-slate-400 text-sm max-w-md font-light leading-relaxed">
        ${p.desc} This page is fully structured and connected. In the next modules, we will bind it to the Prisma REST API database handlers.
      </p>

      <div className="pt-4 flex gap-4">
        <Link to="/" className="px-6 py-2 bg-gold-500 text-luxury-black text-xs font-semibold uppercase tracking-widest rounded transition-opacity hover:opacity-90">
          Return Home
        </Link>
        <Link to="/calculator" className="px-6 py-2 border border-gold-500/30 text-gold-300 text-xs font-semibold uppercase tracking-widest rounded hover:bg-gold-500/10">
          Try Calculator
        </Link>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
