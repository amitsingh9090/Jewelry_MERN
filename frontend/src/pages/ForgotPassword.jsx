import React, { useState } from 'react';
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
