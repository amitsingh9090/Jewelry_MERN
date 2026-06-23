import fs from 'fs';
import path from 'path';

const PAGES_DIR = './frontend/src/pages';

const categoryPages = [
  { file: 'PremiumJewelry.jsx', filterType: 'category', value: 'Premium Jewelry', title: 'Premium Diamond & Emerald Vault', desc: 'The absolute pinnacle of luxury jewelry rentals. Wear diamonds and pristine gemstones.' },
  { file: 'TempleJewelry.jsx', filterType: 'category', value: 'Temple Jewelry', title: 'Temple Antique Jewelry', desc: 'Handcrafted classics reflecting deep spiritual heritage and traditional gold coin designs.' },
  { file: 'CulturalJewelry.jsx', filterType: 'category', value: 'Cultural Jewelry', title: 'Cultural Heritage Wear', desc: 'Traditional designs across historic dynasties, Mughal polki, and hand-carved details.' },
  { file: 'TraditionalJewelry.jsx', filterType: 'category', value: 'Traditional Jewelry', title: 'Traditional Gold & Polki', desc: 'Timeless master creations that capture legacy wedding ornaments.' }
];

const occasionPages = [
  { file: 'WeddingJewelry.jsx', value: 'Wedding Jewelry', title: 'The Bridal Wedding Vault', desc: 'Exquisite bridal necklaces, chokers, and tiaras for your wedding celebrations.' },
  { file: 'HaldiCollection.jsx', value: 'Haldi Collection', title: 'Haldi Collection', desc: 'Radiant enamel, floral, and light-gold accents crafted for auspicious Haldi ceremonies.' },
  { file: 'MehndiCollection.jsx', value: 'Mehndi Traditions', desc: 'Charming meenakari, pearl, and gemstone creations designed for lively Mehndi events.' },
  { file: 'EngagementCollection.jsx', value: 'Engagement Vault', desc: 'Make your engagement memories eternal with high-carat diamond rings and tiaras.' },
  { file: 'ReceptionCollection.jsx', value: 'Reception Elegance', desc: 'Modern high-fashion statement jewelry sets to elevate your evening reception look.' }
];

// Write Category Pages
categoryPages.forEach((p) => {
  const code = `import React from 'react';
import { useLuxe } from '../context/LuxeContext.jsx';
import { Link } from 'react-router-dom';

function ${p.file.replace('.jsx', '')}() {
  const { products, addToCart, toggleWishlist, wishlist } = useLuxe();

  const filtered = products.filter(prod => prod.category === "${p.value}");

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12 space-y-2">
        <span className="text-xs tracking-[0.3em] text-luxury-gold uppercase font-semibold">VALENTINA CATEGORIES</span>
        <h1 className="text-4xl md:text-5xl font-serif text-white">${p.title}</h1>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
        <p className="text-slate-400 text-sm max-w-lg mx-auto font-light pt-2">${p.desc}</p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-slate-500 py-16">No items currently active in this vault section.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((prod) => {
            const isWishlisted = wishlist.includes(prod.id);
            return (
              <div key={prod.id} className="glass-panel p-5 rounded-2xl space-y-4 hover:border-gold-500/30 transition-all group flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-luxury-dark">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <button onClick={() => toggleWishlist(prod.id)} className="absolute top-4 right-4 p-2.5 rounded-full bg-luxury-black/60 border border-gold-500/10 text-slate-300 hover:text-luxury-gold transition-colors z-20">
                      <svg className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-2 mt-4">
                    <h3 className="font-serif text-white text-lg font-medium">{prod.name}</h3>
                    <p className="text-xs text-slate-400 font-light line-clamp-2">{prod.description}</p>
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-slate-900/50 mt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-500">Rental Rate</span>
                    <div>
                      <span className="text-lg font-semibold text-white">\${prod.dailyRent}</span>
                      <span className="text-[10px] text-slate-400">/day</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to={\`/product/\${prod.id}\`} className="text-center py-2.5 border border-slate-800 hover:border-gold-500 text-xs text-slate-300 hover:text-white transition-all uppercase rounded-lg">View Details</Link>
                    <button onClick={() => { addToCart(prod, 1); alert(\`\${prod.name} added to cart!\`); }} className="py-2.5 gold-gradient-bg text-luxury-black text-xs font-semibold uppercase tracking-wider rounded-lg hover:opacity-90 transition-all">Rent Now</button>
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

export default ${p.file.replace('.jsx', '')};
`;
  fs.writeFileSync(path.join(PAGES_DIR, p.file), code);
});

// Write Occasion Pages
occasionPages.forEach((p) => {
  const code = `import React from 'react';
import { useLuxe } from '../context/LuxeContext.jsx';
import { Link } from 'react-router-dom';

function ${p.file.replace('.jsx', '')}() {
  const { products, addToCart, toggleWishlist, wishlist } = useLuxe();

  const filtered = products.filter(prod => prod.occasions && prod.occasions.includes("${p.value}"));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12 space-y-2">
        <span className="text-xs tracking-[0.3em] text-luxury-gold uppercase font-semibold">WEDDING OCCASIONS</span>
        <h1 className="text-4xl md:text-5xl font-serif text-white">${p.title}</h1>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
        <p className="text-slate-400 text-sm max-w-lg mx-auto font-light pt-2">${p.desc}</p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-slate-500 py-16">No items currently active in this wedding catalog segment.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((prod) => {
            const isWishlisted = wishlist.includes(prod.id);
            return (
              <div key={prod.id} className="glass-panel p-5 rounded-2xl space-y-4 hover:border-gold-500/30 transition-all group flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-luxury-dark">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <button onClick={() => toggleWishlist(prod.id)} className="absolute top-4 right-4 p-2.5 rounded-full bg-luxury-black/60 border border-gold-500/10 text-slate-300 hover:text-luxury-gold transition-colors z-20">
                      <svg className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-2 mt-4">
                    <h3 className="font-serif text-white text-lg font-medium">{prod.name}</h3>
                    <p className="text-xs text-slate-400 font-light line-clamp-2">{prod.description}</p>
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-slate-900/50 mt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-500">Rental Rate</span>
                    <div>
                      <span className="text-lg font-semibold text-white">\${prod.dailyRent}</span>
                      <span className="text-[10px] text-slate-400">/day</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to={\`/product/\${prod.id}\`} className="text-center py-2.5 border border-slate-800 hover:border-gold-500 text-xs text-slate-300 hover:text-white transition-all uppercase rounded-lg">View Details</Link>
                    <button onClick={() => { addToCart(prod, 1); alert(\`\${prod.name} added to cart!\`); }} className="py-2.5 gold-gradient-bg text-luxury-black text-xs font-semibold uppercase tracking-wider rounded-lg hover:opacity-90 transition-all">Rent Now</button>
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

export default ${p.file.replace('.jsx', '')};
`;
  fs.writeFileSync(path.join(PAGES_DIR, p.file), code);
});

// Write Festivals.jsx separately
const festivalsCode = `import React, { useState } from 'react';
import { useLuxe } from '../context/LuxeContext.jsx';
import { Link } from 'react-router-dom';

function Festivals() {
  const { products, addToCart, toggleWishlist, wishlist } = useLuxe();
  const [selectedFestival, setSelectedFestival] = useState('All');

  const festivalsList = ['All', 'Diwali Sparkle', 'Eid Opulence', 'Navratri Heritage'];

  const filtered = products.filter(prod => {
    if (!prod.festivals) return false;
    return selectedFestival === 'All' || prod.festivals.includes(selectedFestival);
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12 space-y-2">
        <span className="text-xs tracking-[0.3em] text-luxury-gold uppercase font-semibold">CELEBRATIONAL ORNAMENTS</span>
        <h1 className="text-4xl md:text-5xl font-serif text-white">Festival Collections</h1>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
        <p className="text-slate-400 text-sm max-w-lg mx-auto font-light pt-2">Dazzle in gold and diamond sets tailored specifically for ethnic celebrations.</p>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        {festivalsList.map((fest) => (
          <button
            key={fest}
            onClick={() => setSelectedFestival(fest)}
            className={\`px-4 py-2 text-xs tracking-widest uppercase rounded border transition-all \${
              selectedFestival === fest
                ? 'bg-luxury-gold text-luxury-black border-luxury-gold font-semibold'
                : 'border-slate-800 text-slate-400 hover:border-gold-500/30'
            }\`}
          >
            {fest}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-slate-500 py-16">No items matching this festival selection.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((prod) => {
            const isWishlisted = wishlist.includes(prod.id);
            return (
              <div key={prod.id} className="glass-panel p-5 rounded-2xl space-y-4 hover:border-gold-500/30 transition-all group flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-luxury-dark">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <button onClick={() => toggleWishlist(prod.id)} className="absolute top-4 right-4 p-2.5 rounded-full bg-luxury-black/60 border border-gold-500/10 text-slate-300 hover:text-luxury-gold transition-colors z-20">
                      <svg className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-2 mt-4">
                    <h3 className="font-serif text-white text-lg font-medium">{prod.name}</h3>
                    <p className="text-xs text-slate-400 font-light line-clamp-2">{prod.description}</p>
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-slate-900/50 mt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-500">Rental Rate</span>
                    <div>
                      <span className="text-lg font-semibold text-white">\${prod.dailyRent}</span>
                      <span className="text-[10px] text-slate-400">/day</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to={\`/product/\${prod.id}\`} className="text-center py-2.5 border border-slate-800 hover:border-gold-500 text-xs text-slate-300 hover:text-white transition-all uppercase rounded-lg">View Details</Link>
                    <button onClick={() => { addToCart(prod, 1); alert(\`\${prod.name} added to cart!\`); }} className="py-2.5 gold-gradient-bg text-luxury-black text-xs font-semibold uppercase tracking-wider rounded-lg hover:opacity-90 transition-all">Rent Now</button>
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

export default Festivals;
`;
fs.writeFileSync(path.join(PAGES_DIR, 'Festivals.jsx'), festivalsCode);

console.log('Successfully completed filtered page generation!');
