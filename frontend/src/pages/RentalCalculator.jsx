import React, { useState, useMemo, useEffect } from 'react';
import { useLuxe } from '../context/LuxeContext.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function RentalCalculator() {
  const { products, addToCart } = useLuxe();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    if (products.length > 0 && !selectedId) {
      setSelectedId(products[0].id);
    }
  }, [products, selectedId]);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 3);
    return tomorrow.toISOString().split('T')[0];
  });
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const selectedItem = useMemo(() => {
    return products.find(item => String(item.id) === String(selectedId)) || products[0] || { id: '', name: 'Loading...', dailyRent: 0, deposit: 0, image: '' };
  }, [selectedId, products]);

  const rentalDays = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.max(0, end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  }, [startDate, endDate]);

  const rentalCost = selectedItem.dailyRent * rentalDays * quantity;
  const deposit = selectedItem.deposit * quantity;
  const tax = Math.round(rentalCost * 0.08);
  const discount = isCouponApplied ? Math.round(rentalCost * 0.2) : 0;
  const grandTotal = rentalCost + deposit + tax - discount;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'LUXURY20') {
      setIsCouponApplied(true);
      toast.success('20% discount code applied successfully!');
    } else {
      setIsCouponApplied(false);
      toast.error('Invalid promo code. You can use code "LUXURY20" for a 20% discount.');
    }
  };

  const handleBookRental = () => {
    if (!selectedItem.id) return toast.error('Please select an item first.');
    addToCart(selectedItem, quantity, startDate, endDate);
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif text-white mb-2">Luxury Rental Calculator</h1>
        <p className="text-slate-400 text-sm font-light">Estimate your custom booking quotes instantaneously</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Settings Form */}
        <div className="lg:col-span-7 glass-panel p-8 rounded-xl space-y-6">
          <h2 className="text-xl font-serif text-white border-b border-gold-500/10 pb-3">Specify Booking Terms</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-medium">Select Piece</label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full bg-luxury-charcoal border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-gold-500"
              >
                {products.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-medium">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-luxury-charcoal border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-medium">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-luxury-charcoal border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-medium">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-luxury-charcoal border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Live Total Summary */}
        <div className="lg:col-span-5 glass-panel p-8 rounded-xl border border-gold-500/20 space-y-6">
          <h2 className="text-xl font-serif text-white border-b border-gold-500/10 pb-3">Pricing Quote</h2>

          <div className="flex gap-4 items-center">
            <img src={selectedItem.image} alt="" className="w-16 h-16 object-cover rounded-lg border border-gold-500/10" />
            <div>
              <h3 className="font-serif text-sm text-white">{selectedItem.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Rate: ${selectedItem.dailyRent}/day</p>
            </div>
          </div>

          <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Promo Code (Try LUXURY20)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 bg-luxury-charcoal border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
            />
            <button type="submit" className="px-4 py-2 border border-gold-500/40 text-xs text-gold-300 rounded-lg hover:bg-gold-500/10">Apply</button>
          </form>

          <div className="border-t border-slate-800/80 pt-4 space-y-3 text-xs font-light text-slate-400">
            <div className="flex justify-between"><span>Rental Base Cost</span><span className="text-white font-semibold">${rentalCost}</span></div>
            <div className="flex justify-between"><span>Security Deposit</span><span>${deposit}</span></div>
            <div className="flex justify-between"><span>Tax (8%)</span><span>${tax}</span></div>
            {discount > 0 && <div className="flex justify-between text-emerald-400"><span>Discount (20%)</span><span>-${discount}</span></div>}
            <div className="flex justify-between text-base font-serif text-white font-bold border-t border-gold-500/20 pt-4">
              <span className="gold-gradient-text">Estimated Quote</span><span className="text-white">${grandTotal}</span>
            </div>
          </div>

          <button onClick={handleBookRental} className="w-full py-3 rounded-lg gold-gradient-bg text-luxury-black font-semibold text-xs tracking-widest uppercase">
            Book Rental Vault
          </button>
        </div>
      </div>
    </div>
  );
}

export default RentalCalculator;
