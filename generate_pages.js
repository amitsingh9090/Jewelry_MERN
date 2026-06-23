import fs from 'fs';
import path from 'path';

const PAGES_DIR = './frontend/src/pages';

if (!fs.existsSync(PAGES_DIR)) {
  fs.mkdirSync(PAGES_DIR, { recursive: true });
}

const pages = [
  { file: 'About.jsx', title: 'Our Heritage & Artistry', desc: 'Crafting luxury experiences for generations.' },
  { file: 'Collections.jsx', title: 'The Prestige Collections', desc: 'Browse our curated catalog of elite accessories.' },
  { file: 'Festivals.jsx', title: 'Festival Occasional Splendor', desc: 'Adorn heritage jewelry for auspicious celebrations.' },
  { file: 'WeddingJewelry.jsx', title: 'The Bridal Wedding Vault', desc: 'Exquisite tiaras, necklaces, and chokers for your wedding.' },
  { file: 'HaldiCollection.jsx', title: 'Haldi Collection', desc: 'Radiant floral and light-gold accents for the Haldi ceremony.' },
  { file: 'MehndiCollection.jsx', title: 'Mehndi Traditions', desc: 'Charming meenakari and gemstone creations.' },
  { file: 'EngagementCollection.jsx', title: 'Engagement Ring & Tiara Vault', desc: 'Make the moment eternal with high-carat diamonds.' },
  { file: 'ReceptionCollection.jsx', title: 'Reception Opulence', desc: 'Modern high-fashion statement jewelry sets.' },
  { file: 'TempleJewelry.jsx', title: 'Temple Antique Jewelry', desc: 'Handcrafted classics reflecting deep spiritual heritage.' },
  { file: 'CulturalJewelry.jsx', title: 'Cultural Heritage Wear', desc: 'Traditional designs across historic dynasties.' },
  { file: 'TraditionalJewelry.jsx', title: 'Traditional Gold & Polki', desc: 'Timeless masterpieces that never fade.' },
  { file: 'PremiumJewelry.jsx', title: 'Premium Diamond & Emerald Vault', desc: 'The absolute pinnacle of luxury rentals.' },
  { file: 'ProductDetails.jsx', title: 'Product Details', desc: 'Zoom preview, 360° layout, material specifications, and reviews.' },
  { file: 'Cart.jsx', title: 'Your Shopping Cart', desc: 'Review your selected items and dates before checkout.' },
  { file: 'Wishlist.jsx', title: 'Your Wishlist', desc: 'Keep track of your favorite pieces from the vault.' },
  { file: 'Checkout.jsx', title: 'Secure Checkout', desc: 'Confirm your booking terms, security deposit, and billing address.' },
  { file: 'Login.jsx', title: 'Access Your Vault', desc: 'Sign in to manage your bookings and billing accounts.' },
  { file: 'Register.jsx', title: 'Create Client Profile', desc: 'Join the Valentina Luxe club for premium jewelry access.' },
  { file: 'ForgotPassword.jsx', title: 'ForgotPassword', desc: 'Recover your account access key.' },
  { file: 'OtpVerification.jsx', title: 'OtpVerification', desc: 'Enter the verification code sent to your registered email.' },
  { file: 'ResetPassword.jsx', title: 'ResetPassword', desc: 'Set a new secure access key for your account.' },
  { file: 'Contact.jsx', title: 'Contact Our Concierge', desc: 'Connect with a private jewelry planner.' },
  { file: 'Faqs.jsx', title: 'Frequently Asked Questions', desc: 'Understand rentals, shipping insurance, deposits, and returns.' },
  { file: 'Blog.jsx', title: 'The Luxe Journal', desc: 'Read expert advice on matching jewelry with your occasions.' },
  { file: 'PrivacyPolicy.jsx', title: 'Privacy Policy', desc: 'How we guard your identity and payment transactions.' },
  { file: 'TermsConditions.jsx', title: 'Terms & Conditions', desc: 'General rules, deposit refund conditions, and returns agreement.' },
  { file: 'NotFound.jsx', title: 'Vault Piece Not Found (404)', desc: 'The requested luxury item or page could not be located.' }
];

pages.forEach((p) => {
  const filePath = path.join(PAGES_DIR, p.file);
  const code = `import React from 'react';
import { Link } from 'react-router-dom';

function ${p.file.replace('.jsx', '')}() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-6 min-h-[60vh] flex flex-col justify-center items-center">
      <div className="space-y-2">
        <span className="text-xs tracking-[0.3em] text-luxury-gold uppercase font-semibold">VALENTINA LUXE</span>
        <h1 className="text-3xl md:text-5xl font-serif text-white">${p.title}</h1>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
      </div>
      
      <p className="text-slate-400 text-sm max-w-md font-light leading-relaxed">
        \${p.desc} This page is fully structured and connected. In the next modules, we will bind it to the Prisma REST API database handlers.
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

export default ${p.file.replace('.jsx', '')};
`;

  fs.writeFileSync(filePath, code);
  console.log(`Successfully created page: \${p.file}`);
});
