import React, { useState, useEffect } from 'react';
import { useLuxe } from '../context/LuxeContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function Checkout() {
  const { cart, updateCartItem, removeFromCart, placeOrder, user, updateUserProfile } = useLuxe();
  const navigate = useNavigate();

  // Enforce login for checkout
  useEffect(() => {
    if (!user) {
      toast.error('Please sign in to complete your checkout.');
      navigate('/login');
    }
  }, [user, navigate]);

  // Billing & Shipping fields
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  
  // Card Payment fields
  const [cardName, setCardName] = useState(user?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardType, setCardType] = useState('visa');

  // Format Card Number (XXXX-XXXX-XXXX-XXXX)
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(value);
    }

    // Dynamic Card Type detection
    if (value.startsWith('4')) setCardType('visa');
    else if (value.startsWith('5')) setCardType('mastercard');
    else if (value.startsWith('3')) setCardType('amex');
    else setCardType('visa');
  };

  // Format Card Expiry (MM/YY)
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length >= 2) {
      value = `${value.substring(0, 2)}/${value.substring(2)}`;
    }
    setCardExpiry(value);
  };

  // Calculate rental days helper
  const getRentalDays = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.max(0, e.getTime() - s.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
  };

  // Calculate totals
  const totals = cart.reduce((acc, item) => {
    const days = getRentalDays(item.startDate, item.endDate);
    acc.rent += item.product.dailyRent * days * item.qty;
    acc.deposit += item.product.deposit * item.qty;
    return acc;
  }, { rent: 0, deposit: 0 });

  const serviceTax = Math.round(totals.rent * 0.08);
  const grandTotal = totals.rent + totals.deposit + serviceTax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error('Your rental vault is currently empty.');
    if (!fullName || !phone || !address || !cardNumber || !cardExpiry || !cardCvv) {
      return toast.error('Please fill in all security and shipping details.');
    }

    // Silently update user profile with latest shipping address & phone if changed
    if (address !== user.address || phone !== user.phone || fullName !== user.name) {
      await updateUserProfile(user.email, { name: fullName, address, phone });
    }

    const orderId = await placeOrder(grandTotal);
    if (orderId) {
      toast.success('Your premium booking has been confirmed!');
      navigate('/login'); // Redirect to profile dashboard
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center space-y-6">
        <div className="w-16 h-16 bg-luxury-charcoal border border-gold-500/10 rounded-full flex items-center justify-center mx-auto text-gold-500 text-xl font-serif">
          Ø
        </div>
        <h2 className="text-2xl font-serif text-white">Your Rental Vault is Empty</h2>
        <p className="text-slate-400 text-xs font-light leading-relaxed">
          Before checkout, select a masterpiece from our catalog and choose your rental schedule.
        </p>
        <Link to="/collections" className="inline-block px-6 py-3 gold-gradient-bg text-luxury-black font-semibold text-xs rounded uppercase tracking-wider">
          Explore Ornaments
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-left mb-8">
        <span className="text-xs uppercase text-luxury-gold tracking-widest font-semibold">PATRON RESERVATION</span>
        <h1 className="text-4xl font-serif text-white mt-1">Prestige Rental Checkout</h1>
        <div className="w-12 h-[1px] bg-luxury-gold mt-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Vault Items & Details Form */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 1. Cart Items with Inline Editor */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-900 space-y-4">
            <h2 className="text-lg font-serif text-white flex justify-between items-center">
              <span>Selected Vault Pieces</span>
              <span className="text-xs text-luxury-gold font-sans font-light">({cart.length} Masterpieces)</span>
            </h2>
            
            <div className="space-y-6 divide-y divide-slate-900/60">
              {cart.map((item, idx) => {
                const days = getRentalDays(item.startDate, item.endDate);
                return (
                  <div key={item.product.id} className={`flex flex-col sm:flex-row gap-4 ${idx > 0 ? 'pt-6' : ''}`}>
                    {/* Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-luxury-dark border border-slate-900 flex-shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Editor Content */}
                    <div className="flex-grow space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-serif text-white">{item.product.name}</h3>
                          <p className="text-[10px] text-luxury-gold uppercase tracking-wider">{item.product.category}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.product.id)} className="text-[10px] text-red-400 hover:text-red-300 font-medium uppercase tracking-wider">
                          Remove
                        </button>
                      </div>

                      {/* Inline Date & Quantity Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-luxury-charcoal/40 p-3 rounded-lg border border-slate-900/50">
                        <div>
                          <label className="block text-[8px] text-slate-400 uppercase tracking-widest mb-1">Start Date</label>
                          <input 
                            type="date" 
                            value={item.startDate} 
                            onChange={(e) => updateCartItem(item.product.id, { startDate: e.target.value })} 
                            className="w-full bg-luxury-charcoal border border-slate-800 rounded p-1 text-[11px] text-slate-300 focus:outline-none focus:border-gold-500" 
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] text-slate-400 uppercase tracking-widest mb-1">End Date</label>
                          <input 
                            type="date" 
                            value={item.endDate} 
                            onChange={(e) => updateCartItem(item.product.id, { endDate: e.target.value })} 
                            className="w-full bg-luxury-charcoal border border-slate-800 rounded p-1 text-[11px] text-slate-300 focus:outline-none focus:border-gold-500" 
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] text-slate-400 uppercase tracking-widest mb-1">Quantity</label>
                          <input 
                            type="number" 
                            min="1" 
                            value={item.qty} 
                            onChange={(e) => updateCartItem(item.product.id, { qty: Math.max(1, parseInt(e.target.value) || 1) })} 
                            className="w-full bg-luxury-charcoal border border-slate-800 rounded p-1 text-[11px] text-slate-300 focus:outline-none focus:border-gold-500" 
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-baseline text-xs text-slate-400 font-light pt-1">
                        <span>Duration: <strong>{days} {days === 1 ? 'day' : 'days'}</strong></span>
                        <span>Rate: <strong className="text-white">${item.product.dailyRent}/day</strong></span>
                        <span>Item Total: <strong className="text-white">${item.product.dailyRent * days * item.qty}</strong></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Patron Information */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-900 space-y-4">
            <h2 className="text-lg font-serif text-white">Shipping & Contact Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500" 
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Contact Phone</label>
                <input 
                  type="tel" 
                  required 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500" 
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Shipping & Vault Pick-up Address</label>
                <input 
                  type="text" 
                  required 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Card & Pricing Breakdowns */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-8">
          
          {/* Card Layout & Card Form */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-900 space-y-6">
            <h2 className="text-lg font-serif text-white">Security Deposit Authorization</h2>

            {/* Visual Credit Card */}
            <div className="relative h-44 w-full rounded-2xl bg-gradient-to-br from-neutral-800 via-luxury-black to-neutral-900 border border-gold-500/25 p-5 shadow-2xl overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 rounded-full blur-2xl" />
              <div className="flex justify-between items-start">
                <div className="font-serif italic text-gold-400 text-lg tracking-widest font-bold">TRINKETS</div>
                <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold font-sans">
                  {cardType === 'visa' ? 'Visa Signature' : cardType === 'mastercard' ? 'Mastercard Gold' : 'Amex Platinum'}
                </div>
              </div>

              {/* Chip representation */}
              <div className="w-9 h-7 rounded bg-amber-500/20 border border-amber-500/40 relative overflow-hidden">
                <div className="absolute top-1 left-1 w-2 h-1 bg-amber-500/10 rounded-sm" />
                <div className="absolute bottom-1 right-1 w-2 h-1 bg-amber-500/10 rounded-sm" />
              </div>

              <div className="space-y-3">
                <div className="font-mono text-base text-slate-100 tracking-widest">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[7px] uppercase tracking-widest text-slate-400 mb-0.5">Cardholder</div>
                    <div className="text-[11px] font-sans text-slate-200 tracking-wider truncate max-w-[150px] uppercase">
                      {cardName || 'PATRON NAME'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[7px] uppercase tracking-widest text-slate-400 mb-0.5">Expiry</div>
                    <div className="text-[11px] font-mono text-slate-200">
                      {cardExpiry || 'MM/YY'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Inputs */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Cardholder Name</label>
                <input 
                  type="text" 
                  required 
                  value={cardName} 
                  onChange={(e) => setCardName(e.target.value)} 
                  className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500" 
                />
              </div>
              
              <div>
                <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Card Number</label>
                <input 
                  type="text" 
                  required 
                  placeholder="4000 1234 5678 9010" 
                  value={cardNumber} 
                  onChange={handleCardNumberChange} 
                  className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500 font-mono" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Expiration Date</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="MM/YY" 
                    value={cardExpiry} 
                    onChange={handleExpiryChange} 
                    className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500 font-mono" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Security Code (CVV)</label>
                  <input 
                    type="password" 
                    required 
                    maxLength="3" 
                    placeholder="•••" 
                    value={cardCvv} 
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 3))} 
                    className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500 font-mono" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Ledger */}
          <div className="glass-panel p-6 rounded-2xl border border-gold-500/20 space-y-4">
            <h2 className="text-lg font-serif text-white">Payment Ledger</h2>
            
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Rental Charge Subtotal</span>
                <span className="text-white">${totals.rent}</span>
              </div>
              <div className="flex justify-between">
                <span>Refundable Security Deposit</span>
                <span className="text-white">${totals.deposit}</span>
              </div>
              <div className="flex justify-between">
                <span>Government Luxury Tax (8%)</span>
                <span className="text-white">${serviceTax}</span>
              </div>
              
              <div className="border-t border-slate-900/60 pt-4 mt-2 space-y-2">
                <div className="flex justify-between text-white font-serif text-base font-bold">
                  <span>Grand Total</span>
                  <span className="text-luxury-gold font-bold">${grandTotal}</span>
                </div>
                <p className="text-[9px] text-slate-500 leading-normal font-light">
                  * Note: The security deposit of <strong className="text-slate-400">${totals.deposit}</strong> will be fully refunded to your card upon secure return and inspection of all ornaments.
                </p>
              </div>
            </div>

            <button 
              onClick={handleSubmit} 
              className="w-full py-3.5 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-widest uppercase rounded-lg hover:opacity-90 transition-all shadow-lg"
            >
              Authorize Bond & Place Order
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;
