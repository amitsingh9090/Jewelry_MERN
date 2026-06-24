import React from 'react';
import { Link } from 'react-router-dom';

function TermsConditions() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs tracking-[0.3em] text-luxury-gold uppercase font-semibold">PATRON AGREEMENT</span>
        <h1 className="text-4xl font-serif text-white">Terms & Conditions</h1>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6 text-sm text-slate-300 font-light leading-relaxed">
        <p>
          Welcome to Trinkets. By renting our premium jewelry, you agree to comply with the terms of custody and return outlined in this agreement.
        </p>

        <h3 className="text-base font-serif text-white font-semibold">1. Security Deposits & Verification</h3>
        <p>
          Every rental requires a credit card authorization or security deposit value as specified in the product description. The deposit is held to guarantee the return of the piece and will be refunded in full within 3-5 business days after our gemologists confirm the item is returned in original condition.
        </p>

        <h3 className="text-base font-serif text-white font-semibold">2. Care & Custody</h3>
        <p>
          Patrons are expected to treat rented vault assets with utmost care. Do not expose fine gold, emeralds, or diamonds to harsh chemicals, perfumes, or water. Keep the items secured in the provided luxury vault box when not in use.
        </p>

        <h3 className="text-base font-serif text-white font-semibold">3. Transit & Returns</h3>
        <p>
          Return pickup will be coordinated on the final day of your rental cycle. Our private courier will arrive with a secure, tamper-evident seal bag. The item must be returned inside this bag. Late returns may incur penalty fees equivalent to the daily rental rate.
        </p>

        <h3 className="text-base font-serif text-white font-semibold">4. Damage & Insurance</h3>
        <p>
          While basic wear and tear is covered under our premium transit insurance, significant damages (e.g. missing diamonds, bent settings, severe scratches) will be evaluated, and repair costs will be deducted from your security deposit.
        </p>
      </div>

      <div className="text-center">
        <Link to="/" className="inline-block px-6 py-2.5 bg-gold-500 text-luxury-black font-semibold text-xs tracking-widest uppercase rounded hover:opacity-90 transition-opacity">
          Accept & Return Home
        </Link>
      </div>
    </div>
  );
}

export default TermsConditions;
