import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLuxe } from '../context/LuxeContext.jsx';
import toast from 'react-hot-toast';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { resetPassword } = useLuxe();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const code = location.state?.code;

  // Enforce secure navigation: user must have verified OTP first
  useEffect(() => {
    if (!email || !code) {
      toast.error('Session expired or invalid access. Please start recovery again.');
      navigate('/forgot-password', { replace: true });
    }
  }, [email, code, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      return toast.error('Please fill in both password fields.');
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters.');
    }

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }

    setLoading(true);
    const success = await resetPassword(email, code, password);
    setLoading(false);

    if (success) {
      navigate('/login', { replace: true });
    }
  };

  if (!email || !code) return null;

  return (
    <div className="max-w-md mx-auto px-6 py-20 min-h-[60vh] flex flex-col justify-center animate-fade-in">
      <div className="glass-panel p-8 rounded-xl border border-gold-500/15 space-y-6">
        <h1 className="text-2xl font-serif text-white text-center">Set New Password</h1>
        <p className="text-xs text-slate-500 text-center">Choose a secure password for your account</p>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">New Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="New Password (min 6 chars)" 
                className="w-full bg-luxury-charcoal border border-slate-800 rounded p-3 text-xs text-slate-200 focus:outline-none focus:border-gold-500 transition-colors pr-10" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs focus:outline-none cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Confirm Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              required 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="Confirm New Password" 
              className="w-full bg-luxury-charcoal border border-slate-800 rounded p-3 text-xs text-slate-200 focus:outline-none focus:border-gold-500 transition-colors" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-widest uppercase rounded hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Resetting Password...' : 'Reset Access Key'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
