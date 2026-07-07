import React, { useState } from 'react';
import { useLuxe } from '../context/LuxeContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Register() {
  const { register } = useLuxe();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password || !confirmPassword || !phone.trim() || !address.trim()) {
      return toast.error('Please fill in all fields.');
    }
    
    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return toast.error('Please enter a valid email address.');
    }

    // Password strength check
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters.');
    }

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }

    const success = await register(
      name.trim(),
      email.trim().toLowerCase(),
      password,
      phone.trim(),
      address.trim()
    );

    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12 min-h-[80vh] flex flex-col justify-center animate-fade-in">
      <div className="glass-panel p-8 rounded-xl border border-gold-500/15 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-white">Create Profile</h1>
          <p className="text-xs text-slate-500 mt-1">Join the Trinkets rental circle</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
            <input 
              type="text" 
              required 
              placeholder="enter the name"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500 transition-colors" 
            />
          </div>
          
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="enter the email address"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500 transition-colors" 
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Phone Contact</label>
            <input 
              type="tel" 
              required 
              placeholder="enter the phone contact"
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500 transition-colors" 
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Shipping Address</label>
            <textarea 
              required 
              placeholder="enter the shipping address"
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              rows="2"
              className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500 transition-colors resize-none" 
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="enter the password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 pr-10 text-xs text-slate-200 focus:outline-none focus:border-gold-500 transition-colors" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Confirm</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  required 
                  placeholder="enter the confirm password"
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 pr-10 text-xs text-slate-200 focus:outline-none focus:border-gold-500 transition-colors" 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full py-2.5 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-widest uppercase rounded hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer mt-2">
            Register Account
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 border-t border-slate-900 pt-4">
          Already have an account? <Link to="/login" className="text-gold-500 hover:underline font-semibold">Login Here</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
