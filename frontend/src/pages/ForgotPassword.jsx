import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLuxe } from '../context/LuxeContext.jsx';
import toast from 'react-hot-toast';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useLuxe();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error('Please enter your email.');
    setLoading(true);
    const success = await forgotPassword(email.trim());
    setLoading(false);
    if (success) {
      navigate('/otp-verification', { state: { email: email.trim() } });
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20 min-h-[60vh] flex flex-col justify-center animate-fade-in">
      <div className="glass-panel p-8 rounded-xl border border-gold-500/15 space-y-6">
        <h1 className="text-2xl font-serif text-white text-center">Recover Password</h1>
        <p className="text-xs text-slate-500 text-center">Enter your registered email to receive a 6-digit OTP code</p>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="amit@example.com" 
              className="w-full bg-luxury-charcoal border border-slate-800 rounded p-3 text-xs text-slate-200 focus:outline-none focus:border-gold-500 transition-colors" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-2.5 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-widest uppercase rounded hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Sending OTP...' : 'Send OTP Code'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
