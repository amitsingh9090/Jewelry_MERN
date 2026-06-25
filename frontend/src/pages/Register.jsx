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
              placeholder="Amit Singh"
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
              placeholder="amit@example.com"
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
              placeholder="+91 98765 43210"
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500 transition-colors" 
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Shipping Address</label>
            <textarea 
              required 
              placeholder="Enter your shipping address for secure transit delivery..."
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              rows="2"
              className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500 transition-colors resize-none" 
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Password</label>
              <input 
                type="password" 
                required 
                placeholder="••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500 transition-colors" 
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Confirm</label>
              <input 
                type="password" 
                required 
                placeholder="••••••"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500 transition-colors" 
              />
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
