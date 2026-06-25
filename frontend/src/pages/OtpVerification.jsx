import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLuxe } from '../context/LuxeContext.jsx';
import toast from 'react-hot-toast';

function OtpVerification() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { verifyOtp, forgotPassword } = useLuxe();
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Enforce secure navigation: user must have entered their email first
  useEffect(() => {
    if (!email) {
      toast.error('Session expired or invalid access. Please enter your email first.');
      navigate('/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || code.trim().length !== 6) {
      return toast.error('Please enter the 6-digit verification code.');
    }
    
    setLoading(true);
    const success = await verifyOtp(email, code.trim());
    setLoading(false);
    
    if (success) {
      navigate('/reset-password', { state: { email, code: code.trim() } });
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    await forgotPassword(email);
    setResending(false);
  };

  if (!email) return null;

  return (
    <div className="max-w-md mx-auto px-6 py-20 min-h-[60vh] flex flex-col justify-center animate-fade-in">
      <div className="glass-panel p-8 rounded-xl border border-gold-500/15 space-y-6">
        <h1 className="text-2xl font-serif text-white text-center">OTP Verification</h1>
        <p className="text-xs text-slate-500 text-center">
          Enter the 6-digit verification code sent to <strong className="text-slate-300 font-normal">{email}</strong>
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            maxLength="6" 
            required 
            value={code} 
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} 
            placeholder="0 0 0 0 0 0" 
            className="w-full bg-luxury-charcoal border border-slate-800 rounded p-3 text-center text-lg text-white font-bold tracking-widest focus:outline-none focus:border-gold-500 transition-colors" 
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-widest uppercase rounded hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Verifying Code...' : 'Verify Code'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 border-t border-slate-900 pt-4 flex justify-between items-center">
          <span>Didn't receive the code?</span>
          <button 
            type="button" 
            onClick={handleResend}
            disabled={resending}
            className="text-gold-500 hover:underline font-semibold bg-transparent border-none cursor-pointer disabled:opacity-50"
          >
            {resending ? 'Resending...' : 'Resend Code'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OtpVerification;
