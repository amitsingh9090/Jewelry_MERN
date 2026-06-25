import React, { useState, useEffect } from 'react';
import { useLuxe } from '../context/LuxeContext.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Checkout() {
  const { cart, placeOrder, user } = useLuxe();
  const navigate = useNavigate();

  // Enforce login for checkout
  useEffect(() => {
    if (!user) {
      toast.error('Please login to complete checkout.');
      navigate('/login');
    }
  }, [user, navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !address || !card) return toast.error('Please complete all billing fields.');
    const orderId = await placeOrder(grandTotal);
    if (orderId) {
      toast.success(`Booking Placed successfully!`);
      navigate('/login'); // Sends to login dashboard
    }
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
