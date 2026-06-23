import fs from 'fs';
import path from 'path';

const PAGES_DIR = './frontend/src/pages';

// ProductDetails.jsx
const productDetailsCode = `import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLuxe } from '../context/LuxeContext.jsx';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist, addProductReview } = useLuxe();
  
  const product = useMemo(() => {
    return products.find(p => p.id === Number(id)) || products[0];
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
              <div className="flex justify-between"><span>Rental Base Cost ({rentalDays} days)</span><span className="text-white font-semibold">\${product.dailyRent * rentalDays * qty}</span></div>
              <div className="flex justify-between"><span>Security Deposit (Refundable)</span><span>\${product.deposit * qty}</span></div>
              <div className="flex justify-between text-white font-serif border-t border-slate-900 pt-2 font-bold">
                <span>Total</span><span>\${(product.dailyRent * rentalDays * qty) + (product.deposit * qty) + Math.round(product.dailyRent * rentalDays * qty * 0.08)}</span>
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
`;

// Cart.jsx
const cartCode = `import React from 'react';
import { useLuxe } from '../context/LuxeContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart, updateCartQty, toggleWishlist } = useLuxe();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) return alert('Your cart is currently empty.');
    navigate('/checkout');
  };

  const totals = cart.reduce((acc, item) => {
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);
    const diff = Math.max(0, end.getTime() - start.getTime());
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;

    const rent = item.product.dailyRent * days * item.qty;
    const dep = item.product.deposit * item.qty;
    
    acc.rent += rent;
    acc.deposit += dep;
    return acc;
  }, { rent: 0, deposit: 0 });

  const tax = Math.round(totals.rent * 0.08);
  const grandTotal = totals.rent + totals.deposit + tax;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-serif text-white mb-8 border-b border-slate-900 pb-4">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <p className="text-slate-500 font-light">Your shopping cart is empty.</p>
          <Link to="/collections" className="inline-block px-6 py-2.5 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-wider rounded uppercase">Browse Vaults</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => {
              const start = new Date(item.startDate);
              const end = new Date(item.endDate);
              const diff = Math.max(0, end.getTime() - start.getTime());
              const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;

              return (
                <div key={item.product.id} className="glass-panel p-5 rounded-xl flex flex-col md:flex-row gap-6 items-center justify-between border border-slate-800">
                  <div className="flex items-center gap-4">
                    <img src={item.product.image} alt="" className="w-16 h-16 object-cover rounded-lg border border-gold-500/10" />
                    <div>
                      <h3 className="font-serif text-white font-medium">{item.product.name}</h3>
                      <p className="text-[10px] text-slate-500">Duration: {days} days ({item.startDate} to {item.endDate})</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-slate-800 rounded">
                      <button onClick={() => updateCartQty(item.product.id, item.qty - 1)} className="px-3 py-1 text-slate-400 hover:text-white">-</button>
                      <span className="px-2 text-xs text-white">{item.qty}</span>
                      <button onClick={() => updateCartQty(item.product.id, item.qty + 1)} className="px-3 py-1 text-slate-400 hover:text-white">+</button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-semibold text-white">\${item.product.dailyRent * days * item.qty}</span>
                      <span className="block text-[10px] text-slate-500">Deposit: \${item.product.deposit * item.qty}</span>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => { toggleWishlist(item.product.id); removeFromCart(item.product.id); alert('Moved to wishlist!'); }} className="text-xs text-gold-500 hover:text-gold-300" title="Move to Wishlist">❤️</button>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-xs text-rose-500 hover:text-rose-400" title="Remove">🗑️</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-4 glass-panel p-6 rounded-xl border border-gold-500/20 space-y-6">
            <h2 className="text-xl font-serif text-white border-b border-slate-900 pb-3">Rental Summary</h2>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex justify-between"><span>Rental Subtotal</span><span className="text-white">\${totals.rent}</span></div>
              <div className="flex justify-between"><span>Security Deposit (Refundable)</span><span className="text-white">\${totals.deposit}</span></div>
              <div className="flex justify-between"><span>Estimated Tax (8%)</span><span>\${tax}</span></div>
              <div className="flex justify-between text-base font-serif text-white font-bold border-t border-gold-500/20 pt-4">
                <span className="gold-gradient-text">Grand Total</span><span>\${grandTotal}</span>
              </div>
            </div>
            <button onClick={handleCheckout} className="w-full py-3 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-widest uppercase rounded-lg">
              Proceed to Secure Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
`;

// Wishlist.jsx
const wishlistCode = `import React from 'react';
import { useLuxe } from '../context/LuxeContext.jsx';
import { Link } from 'react-router-dom';

function Wishlist() {
  const { wishlist, products, toggleWishlist, addToCart } = useLuxe();

  const wishlistedItems = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-serif text-white mb-8 border-b border-slate-900 pb-4">Your Wishlist</h1>

      {wishlistedItems.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <p className="text-slate-500 font-light">Your wishlist is empty.</p>
          <Link to="/collections" className="inline-block px-6 py-2.5 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-wider rounded uppercase">Explore Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistedItems.map((p) => (
            <div key={p.id} className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-luxury-dark">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                <button onClick={() => toggleWishlist(p.id)} className="absolute top-3 right-3 p-2 bg-luxury-black/60 rounded-full text-rose-500 hover:text-slate-300">🗑️</button>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-white text-base">{p.name}</h3>
                <p className="text-xs text-luxury-gold font-semibold">\${p.dailyRent}/day</p>
              </div>

              <button
                onClick={() => { addToCart(p, 1); toggleWishlist(p.id); alert('Moved to Cart!'); }}
                className="w-full py-2.5 gold-gradient-bg text-luxury-black font-semibold text-xs rounded-lg uppercase tracking-wider"
              >
                Move to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
`;

// Checkout.jsx
const checkoutCode = `import React, { useState } from 'react';
import { useLuxe } from '../context/LuxeContext.jsx';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const { cart, placeOrder } = useLuxe();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [card, setCard] = useState('');

  const totals = cart.reduce((acc, item) => {
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);
    const diff = Math.max(0, end.getTime() - start.getTime());
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
    acc.rent += item.product.dailyRent * days * item.qty;
    acc.deposit += item.product.deposit * item.qty;
    return acc;
  }, { rent: 0, deposit: 0 });

  const grandTotal = totals.rent + totals.deposit + Math.round(totals.rent * 0.08);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !address || !card) return alert('Please complete all billing fields.');
    const orderId = placeOrder(grandTotal);
    alert(\`Order \${orderId} Placed Successfully!\`);
    navigate('/login'); // Sends to login dashboard
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-serif text-white mb-8 border-b border-slate-900 pb-4">Secure Checkout</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Details */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-xl space-y-4">
          <h2 className="text-lg font-serif text-white">Shipping & Billing Details</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Shipping Address</label>
              <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Card Number</label>
              <input type="text" required placeholder="XXXX XXXX XXXX XXXX" value={card} onChange={(e) => setCard(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-xl border border-gold-500/20 space-y-4">
          <h2 className="text-lg font-serif text-white">Payment Breakdown</h2>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex justify-between"><span>Rental Subtotal</span><span>\${totals.rent}</span></div>
            <div className="flex justify-between"><span>Deposit</span><span>\${totals.deposit}</span></div>
            <div className="flex justify-between text-white font-serif text-sm pt-2 border-t border-slate-900 font-bold">
              <span>Grand Total</span><span>\${grandTotal}</span>
            </div>
          </div>
          <button type="submit" className="w-full py-3 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-widest uppercase rounded">
            Authorize Payment & Book
          </button>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
`;

// Login.jsx & Dashboards wrapper
const loginCode = `import React, { useState } from 'react';
import { useLuxe } from '../context/LuxeContext.jsx';
import { Link } from 'react-router-dom';

function Login() {
  const { login, logout, user, orders, tickets, addTicket } = useLuxe();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Support ticket form
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return alert('Fill credentials');
    login(email, password);
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!subject || !message) return;
    addTicket(subject, message);
    setSubject('');
    setMessage('');
    alert('Ticket submitted!');
  };

  if (user) {
    // Renders the Client Profile Dashboard directly when logged in!
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Profile overview */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-xl space-y-4 text-center">
          <img src={user.avatar} className="w-24 h-24 rounded-full mx-auto border-2 border-gold-500" alt="" />
          <div>
            <h2 className="text-xl font-serif text-white">{user.name}</h2>
            <p className="text-xs text-luxury-gold uppercase tracking-widest">Luxe Member</p>
          </div>
          <div className="text-left text-xs text-slate-400 space-y-2 pt-4 border-t border-slate-800">
            <div><span className="text-slate-500">Email:</span> {user.email}</div>
            <div><span className="text-slate-500">Phone:</span> {user.phone}</div>
            <div><span className="text-slate-500">Address:</span> {user.address}</div>
          </div>
          <button onClick={logout} className="w-full py-2 bg-rose-950/20 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded uppercase tracking-wider hover:bg-rose-900/10">Logout</button>
        </div>

        {/* Right Side: Orders and Support Tickets */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Bookings */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="text-lg font-serif text-white border-b border-slate-900 pb-2">Active Vault Rentals</h3>
            {orders.length === 0 ? (
              <p className="text-xs text-slate-500 font-light">No rentals booked yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-4 border border-slate-800 rounded-lg text-xs space-y-2">
                    <div className="flex justify-between items-center text-slate-300 font-medium">
                      <span>Order Reference: <strong>{ord.id}</strong></span>
                      <span className="px-2 py-0.5 rounded bg-gold-950/20 text-luxury-gold border border-gold-500/20">{ord.status}</span>
                    </div>
                    <div className="text-slate-500">Date Placed: {ord.date}</div>
                    <div className="space-y-1">
                      {ord.items.map((i, idx) => (
                        <div key={idx} className="flex justify-between text-slate-400">
                          <span>{i.name} (x{ord.items[0].qty || 1}) - {ord.items[0].days || 3} days</span>
                          <span>\${i.dailyRent * ord.items[0].days * ord.items[0].qty}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between font-bold text-white border-t border-slate-900 pt-2 text-sm">
                      <span>Total Invoice</span>
                      <span>\${ord.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Support Tickets Section */}
          <div className="glass-panel p-6 rounded-xl space-y-6">
            <h3 className="text-lg font-serif text-white border-b border-slate-900 pb-2">Support Tickets</h3>
            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t.id} className="p-3 border border-slate-800 rounded bg-luxury-dark/40 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-semibold text-white">{t.subject}</div>
                    <div className="text-slate-500">{t.message}</div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{t.status}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSupportSubmit} className="space-y-3 border-t border-slate-900 pt-4">
              <h4 className="text-xs font-serif text-white uppercase tracking-widest">New Support Request</h4>
              <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none" />
              <textarea placeholder="Describe your request..." value={message} onChange={(e) => setMessage(e.target.value)} required rows="2" className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none"></textarea>
              <button type="submit" className="px-4 py-2 border border-gold-500/30 text-xs text-gold-300 rounded hover:bg-gold-500/10">Submit Ticket</button>
            </form>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20 min-h-[60vh] flex flex-col justify-center">
      <div className="glass-panel p-8 rounded-xl border border-gold-500/15 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-white">Client Login</h1>
          <p className="text-xs text-slate-500 mt-1">Unlock your rentals & client overview</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Account Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500" />
          </div>
          <div className="flex justify-between items-center text-xs">
            <Link to="/forgot-password" className="text-gold-500 hover:underline">Forgot password?</Link>
          </div>
          <button type="submit" className="w-full py-2.5 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-widest uppercase rounded">Login</button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don't have an account? <Link to="/register" className="text-gold-500 hover:underline font-semibold">Register Here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
`;

// Register.jsx
const registerCode = `import React, { useState } from 'react';
import { useLuxe } from '../context/LuxeContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const { register } = useLuxe();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) return alert('Please complete fields');
    register(name, email, password);
    alert('Account Created successfully!');
    navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20 min-h-[60vh] flex flex-col justify-center">
      <div className="glass-panel p-8 rounded-xl border border-gold-500/15 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-white">Create Profile</h1>
          <p className="text-xs text-slate-500 mt-1">Join the Valentina Luxe circle</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Set Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none" />
          </div>
          <button type="submit" className="w-full py-2.5 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-widest uppercase rounded">Register Account</button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already have an account? <Link to="/login" className="text-gold-500 hover:underline">Login Here</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
`;

// ForgotPassword.jsx
const forgotPasswordCode = `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    alert('OTP sent to ' + email);
    navigate('/otp-verification');
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20 min-h-[60vh] flex flex-col justify-center">
      <div className="glass-panel p-8 rounded-xl border border-gold-500/15 space-y-6">
        <h1 className="text-2xl font-serif text-white text-center">Recover Password</h1>
        <p className="text-xs text-slate-500 text-center">Enter email to receive OTP</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full bg-luxury-charcoal border border-slate-800 rounded p-3 text-xs text-slate-200 focus:outline-none" />
          <button type="submit" className="w-full py-2.5 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-widest uppercase rounded">Send OTP Code</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
`;

// OtpVerification.jsx
const otpVerificationCode = `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function OtpVerification() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code === '1234' || code.length === 4) {
      alert('Code verified!');
      navigate('/reset-password');
    } else {
      alert('Enter any 4-digit code (e.g. 1234)');
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20 min-h-[60vh] flex flex-col justify-center">
      <div className="glass-panel p-8 rounded-xl border border-gold-500/15 space-y-6">
        <h1 className="text-2xl font-serif text-white text-center">OTP Verification</h1>
        <p className="text-xs text-slate-500 text-center">Enter the 4-digit code (Use "1234")</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" maxLength="4" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="0 0 0 0" className="w-full bg-luxury-charcoal border border-slate-800 rounded p-3 text-center text-lg text-white font-bold tracking-widest focus:outline-none" />
          <button type="submit" className="w-full py-2.5 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-widest uppercase rounded">Verify Code</button>
        </form>
      </div>
    </div>
  );
}

export default OtpVerification;
`;

// ResetPassword.jsx
const resetPasswordCode = `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Password updated! Please login.');
    navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20 min-h-[60vh] flex flex-col justify-center">
      <div className="glass-panel p-8 rounded-xl border border-gold-500/15 space-y-6">
        <h1 className="text-2xl font-serif text-white text-center">Set New Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" required value={pass} onChange={(e) => setPass(e.target.value)} placeholder="New Password" className="w-full bg-luxury-charcoal border border-slate-800 rounded p-3 text-xs text-slate-200 focus:outline-none" />
          <button type="submit" className="w-full py-2.5 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-widest uppercase rounded">Reset Access Key</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
`;

// Contact.jsx
const contactCode = `import React, { useState } from 'react';

function Contact() {
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you ' + name + '! Your message was successfully sent to the concierge team.');
    setName('');
    setMsg('');
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-serif text-white mb-2">Concierge & Support</h1>
        <p className="text-slate-400 text-sm">Reach out for bespoke fittings, sizing customizations, or queries</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-xl space-y-4 border border-slate-800">
        <div>
          <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-3 text-xs text-slate-300 focus:outline-none" />
        </div>
        <div>
          <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Describe Query</label>
          <textarea required value={msg} onChange={(e) => setMsg(e.target.value)} rows="4" className="w-full bg-luxury-charcoal border border-slate-800 rounded p-3 text-xs text-slate-300 focus:outline-none"></textarea>
        </div>
        <button type="submit" className="w-full py-3 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-widest uppercase rounded">Send Support Query</button>
      </form>
    </div>
  );
}

export default Contact;
`;

// Faqs.jsx
const faqsCode = `import React, { useState } from 'react';

const FAQ_ITEMS = [
  { q: 'How long can I rent a vault piece?', a: 'Standard rental cycles are 3, 5, or 7 days. If you require longer periods for destination weddings, please contact our support desk.' },
  { q: 'Is the security deposit fully refundable?', a: 'Yes. The deposit is refunded in full to your original card payment once the jewelry returns and passes inspections.' },
  { q: 'How do you handle hygiene and safety?', a: 'Every vault piece is ultrasonically sanitized, polished, and vacuum-sealed in a clean box environment prior to delivery.' },
  { q: 'What happens if a piece is accidentally damaged?', a: 'We secure transit insurance on all orders. Basic wear is covered. Critical cracks or lost gemstones will involve deductions from the security deposit.' }
];

function Faqs() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-serif text-white text-center mb-10">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => (
          <div key={idx} className="glass-panel rounded-xl overflow-hidden border border-slate-800">
            <button onClick={() => setOpenIdx(openIdx === idx ? null : idx)} className="w-full p-5 text-left text-sm text-white font-serif flex justify-between items-center focus:outline-none">
              <span>{item.q}</span>
              <span>{openIdx === idx ? '▲' : '▼'}</span>
            </button>
            {openIdx === idx && (
              <div className="p-5 border-t border-slate-900 text-xs text-slate-400 leading-relaxed font-light bg-luxury-dark/30">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Faqs;
`;

// Blog.jsx
const blogCode = `import React from 'react';

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
`;

fs.writeFileSync(path.join(PAGES_DIR, 'ProductDetails.jsx'), productDetailsCode);
fs.writeFileSync(path.join(PAGES_DIR, 'Cart.jsx'), cartCode);
fs.writeFileSync(path.join(PAGES_DIR, 'Wishlist.jsx'), wishlistCode);
fs.writeFileSync(path.join(PAGES_DIR, 'Checkout.jsx'), checkoutCode);
fs.writeFileSync(path.join(PAGES_DIR, 'Login.jsx'), loginCode);
fs.writeFileSync(path.join(PAGES_DIR, 'Register.jsx'), registerCode);
fs.writeFileSync(path.join(PAGES_DIR, 'ForgotPassword.jsx'), forgotPasswordCode);
fs.writeFileSync(path.join(PAGES_DIR, 'OtpVerification.jsx'), otpVerificationCode);
fs.writeFileSync(path.join(PAGES_DIR, 'ResetPassword.jsx'), resetPasswordCode);
fs.writeFileSync(path.join(PAGES_DIR, 'Contact.jsx'), contactCode);
fs.writeFileSync(path.join(PAGES_DIR, 'Faqs.jsx'), faqsCode);
fs.writeFileSync(path.join(PAGES_DIR, 'Blog.jsx'), blogCode);

console.log('Successfully completed interactive pages generation!');
