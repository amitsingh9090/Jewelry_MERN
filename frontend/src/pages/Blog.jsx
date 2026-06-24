import React from 'react';

const MOCK_POSTS = [
  { title: 'Choosing Bridal Emeralds vs Diamonds', date: 'June 18, 2026', snippet: 'Read our expert guide on pairing deep Zambian emerald necklaces with reception couture...', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=300' },
  { title: 'The Sacred History of Temple Gold Coins', date: 'May 28, 2026', snippet: 'Explore the deep mythological roots and casting histories of South Indian Kasumalas...', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=300' }
];

function Blog() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-serif text-white text-center mb-12">The Luxe Journal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_POSTS.map((post, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-xl border border-slate-800 flex gap-6 items-center">
            <img src={post.img} className="w-24 h-24 object-cover rounded-lg border border-gold-500/10" alt="" />
            <div className="space-y-2">
              <span className="text-[10px] text-luxury-gold tracking-widest">{post.date}</span>
              <h3 className="font-serif text-white text-base font-semibold">{post.title}</h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">{post.snippet}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blog;
