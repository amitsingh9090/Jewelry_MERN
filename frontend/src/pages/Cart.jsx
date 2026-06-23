import React from 'react';
import { useLuxe } from '../context/LuxeContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Cart() {
  const { cart, removeFromCart, updateCartQty, toggleWishlist, user } = useLuxe();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }
    
    // Auth Check
    if (!user) {
      toast.error('Authentication Required! Please register or log in to reserve luxury rentals.', {
        duration: 4000,
        style: {
          background: '#111113',
          color: '#cca26a',
          border: '1px solid rgba(204, 162, 106, 0.3)'
        }
      });
      navigate('/login');
      return;
    }

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
                      <span className="text-sm font-semibold text-white">${item.product.dailyRent * days * item.qty}</span>
                      <span className="block text-[10px] text-slate-500">Deposit: ${item.product.deposit * item.qty}</span>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => { toggleWishlist(item.product.id); removeFromCart(item.product.id); }} className="text-xs text-gold-500 hover:text-gold-300" title="Move to Wishlist">❤️</button>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-xs text-rose-500 hover:text-rose-400" title="Remove">🗑️</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-4 glass-panel p-6 rounded-xl border border-gold-500/20 space-y-6">
            <h2 className="text-xl font-serif text-white border-b border-slate-900 pb-3">Rental Summary</h2>
            
            {!user && (
              <div className="p-3 bg-gold-950/20 border border-gold-500/10 text-[11px] text-luxury-gold rounded leading-relaxed">
                📢 You are currently browsing as a guest. You will need to log in or register before checking out.
              </div>
            )}

            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex justify-between"><span>Rental Subtotal</span><span className="text-white">${totals.rent}</span></div>
              <div className="flex justify-between"><span>Security Deposit (Refundable)</span><span className="text-white">${totals.deposit}</span></div>
              <div className="flex justify-between"><span>Estimated Tax (8%)</span><span>${tax}</span></div>
              <div className="flex justify-between text-base font-serif text-white font-bold border-t border-gold-500/20 pt-4">
                <span className="gold-gradient-text">Grand Total</span><span>${grandTotal}</span>
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
