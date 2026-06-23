import React, { useState } from 'react';
import { useLuxe } from '../context/LuxeContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function Checkout() {
  const { cart, placeOrder, user } = useLuxe();
  const navigate = useNavigate();

  const [name, setName] = useState(user ? user.name : '');
  const [address, setAddress] = useState(user ? user.address : '');
  const [card, setCard] = useState('');

  // If user is not logged in, block page viewing
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center space-y-6 min-h-[60vh] flex flex-col justify-center items-center">
        <div className="space-y-2">
          <span className="text-xs tracking-[0.3em] text-rose-500 uppercase font-semibold">ACCESS RESTRICTED</span>
          <h1 className="text-3xl font-serif text-white">Authentication Required</h1>
          <div className="w-12 h-[1px] bg-rose-500 mx-auto mt-2" />
        </div>
        
        <p className="text-slate-400 text-sm max-w-sm font-light leading-relaxed">
          You must have an active client account to access the secure reservation checkout. Please log in or sign up.
        </p>

        <div className="pt-4 flex gap-4">
          <Link to="/login" className="px-6 py-2.5 gold-gradient-bg text-luxury-black text-xs font-semibold uppercase tracking-widest rounded transition-opacity hover:opacity-90">
            Login
          </Link>
          <Link to="/register" className="px-6 py-2.5 border border-gold-500/30 text-gold-300 text-xs font-semibold uppercase tracking-widest rounded hover:bg-gold-500/10">
            Register
          </Link>
        </div>
      </div>
    );
  }

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
    if (!name || !address || !card) {
      toast.error('Please complete all billing fields.');
      return;
    }
    const orderId = placeOrder(grandTotal);
    navigate('/login'); // Redirect to dashboard to see active bookings
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
            <div className="flex justify-between"><span>Rental Subtotal</span><span>${totals.rent}</span></div>
            <div className="flex justify-between"><span>Deposit</span><span>${totals.deposit}</span></div>
            <div className="flex justify-between text-white font-serif text-sm pt-2 border-t border-slate-900 font-bold">
              <span>Grand Total</span><span>${grandTotal}</span>
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
