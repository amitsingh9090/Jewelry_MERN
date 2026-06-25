import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLuxe } from '../context/LuxeContext.jsx';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist, addProductReview } = useLuxe();
  
  const product = useMemo(() => {
    return products.find(p => String(p.id) === String(id)) || products[0];
  }, [id, products]);

  // Date and calc state
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 3);
    return tomorrow.toISOString().split('T')[0];
  });
  const [qty, setQty] = useState(1);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  const rentalDays = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.max(0, end.getTime() - start.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
  }, [startDate, endDate]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 min-h-[60vh] flex flex-col justify-center items-center text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-luxury-gold"></div>
        <p className="text-sm text-slate-500 font-light">Retrieving pristine vault item details...</p>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return alert('Please fill in all review fields.');
    addProductReview(product.id, { name: reviewName, comment: reviewComment, rating: reviewRating });
    setReviewName('');
    setReviewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-6">
        <Link to="/collections" className="text-xs text-luxury-gold tracking-widest uppercase hover:underline">← Back to Collections</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Images */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-luxury-dark border border-gold-500/10">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="aspect-square rounded-lg border border-gold-500/20 overflow-hidden"><img src={product.image} className="w-full h-full object-cover" /></div>
            <div className="aspect-square rounded-lg border border-slate-900 overflow-hidden bg-luxury-dark flex items-center justify-center text-xs text-slate-500 font-serif">360° Preview</div>
            <div className="aspect-square rounded-lg border border-slate-900 overflow-hidden bg-luxury-dark flex items-center justify-center text-xs text-slate-500 font-serif">Video Walk</div>
          </div>
        </div>

        {/* Info & Side Calculator */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs uppercase text-luxury-gold tracking-widest font-semibold">{product.category}</span>
            <h1 className="text-3xl md:text-4xl font-serif text-white mt-1">{product.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs text-slate-400">⭐ {product.rating} / 5.0 (42 Patron Reviews)</span>
            </div>
          </div>

          <p className="text-slate-300 text-sm font-light leading-relaxed">{product.description}</p>

          <div className="border-y border-slate-900 py-4 grid grid-cols-3 gap-4 text-xs font-light text-slate-400">
            <div><span className="block text-slate-500">Weight:</span> <strong className="text-white">{product.weight}</strong></div>
            <div><span className="block text-slate-500">Material:</span> <strong className="text-white">{product.material}</strong></div>
            <div><span className="block text-slate-500">Sizing:</span> <strong className="text-white">{product.size}</strong></div>
          </div>

          {/* Calculator Widget inside Detail */}
          <div className="glass-panel p-6 rounded-xl border border-gold-500/15 space-y-4">
            <h3 className="font-serif text-white text-sm">Calculate & Rent</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Quantity</label>
              <input type="number" min="1" value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none" />
            </div>

            <div className="border-t border-slate-800 pt-3 text-xs text-slate-400 space-y-2">
              <div className="flex justify-between"><span>Rental Base Cost ({rentalDays} days)</span><span className="text-white font-semibold">${product.dailyRent * rentalDays * qty}</span></div>
              <div className="flex justify-between"><span>Security Deposit (Refundable)</span><span>${product.deposit * qty}</span></div>
              <div className="flex justify-between text-white font-serif border-t border-slate-900 pt-2 font-bold">
                <span>Total</span><span>${(product.dailyRent * rentalDays * qty) + (product.deposit * qty) + Math.round(product.dailyRent * rentalDays * qty * 0.08)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button onClick={() => toggleWishlist(product.id)} className="w-full py-3 border border-slate-800 hover:border-gold-500 rounded-lg text-xs text-slate-300 font-semibold uppercase tracking-wider transition-colors">
                {isWishlisted ? '❤️ Wishlisted' : '🤍 Add Wishlist'}
              </button>
              <button onClick={() => { addToCart(product, qty, startDate, endDate); alert('Added to cart!'); }} className="w-full py-3 gold-gradient-bg text-luxury-black font-semibold text-xs rounded-lg uppercase tracking-wider">
                Rent Vault Piece
              </button>
            </div>
          </div>

          {/* Review form */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="font-serif text-white text-base">Client Reviews</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Your Name" value={reviewName} onChange={(e) => setReviewName(e.target.value)} className="bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none" />
                <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} className="bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none">
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                </select>
              </div>
              <textarea placeholder="Write your review comments..." value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows="3" className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none"></textarea>
              <button type="submit" className="px-4 py-2 border border-gold-500/30 text-xs text-gold-300 rounded hover:bg-gold-500/10">Submit Review</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
