import React, { useState } from 'react';
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
