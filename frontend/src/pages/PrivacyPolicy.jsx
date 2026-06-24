import React from 'react';
import { Link } from 'react-router-dom';

function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs tracking-[0.3em] text-luxury-gold uppercase font-semibold">LEGAL & TRUST</span>
        <h1 className="text-4xl font-serif text-white">Privacy Policy</h1>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6 text-sm text-slate-300 font-light leading-relaxed">
        <p>
          At Trinkets, we recognize that privacy is of paramount importance to our distinguished patrons. This policy outlines how we handle, protect, and process your personal and transaction data.
        </p>

        <h3 className="text-base font-serif text-white font-semibold">1. Collection of Personal Information</h3>
        <p>
          To facilitate premium jewelry rentals, we collect contact details (full name, email address, shipping address, and phone number) as well as identification verification documents required for high-carat vault access.
        </p>

        <h3 className="text-base font-serif text-white font-semibold">2. Transactional & Payment Security</h3>
        <p>
          All credit card transactions, billing data, and security deposits are processed through PCI-DSS compliant payment gateways. Trinkets does not store raw credit card details on our local servers.
        </p>

        <h3 className="text-base font-serif text-white font-semibold">3. Insured Delivery Data</h3>
        <p>
          We share your contact and shipping information with our specialized private courier partners solely to execute secure transit delivery and pickup of rented assets.
        </p>

        <h3 className="text-base font-serif text-white font-semibold">4. Your Data Rights</h3>
        <p>
          You may request access to, correction of, or deletion of your client profile at any time by contacting our concierge desk.
        </p>
      </div>

      <div className="text-center">
        <Link to="/" className="inline-block px-6 py-2.5 bg-gold-500 text-luxury-black font-semibold text-xs tracking-widest uppercase rounded hover:opacity-90 transition-opacity">
          Return Home
        </Link>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
