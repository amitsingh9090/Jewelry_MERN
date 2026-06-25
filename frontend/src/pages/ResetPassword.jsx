import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function ResetPassword() {
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Your password has been reset successfully! Please log in.');
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
