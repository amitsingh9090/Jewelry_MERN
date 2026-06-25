import React, { useState } from 'react';
import { useLuxe } from '../context/LuxeContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Register() {
  const { register } = useLuxe();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      return toast.error('Please fill in all fields.');
    }
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }
    const success = await register(name, email, password);
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20 min-h-[60vh] flex flex-col justify-center">
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
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none" 
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none" 
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Set Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none" 
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Confirm Password</label>
            <input 
              type="password" 
              required 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none" 
            />
          </div>
          <button type="submit" className="w-full py-2.5 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-widest uppercase rounded">Register Account</button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already have an account? <Link to="/login" className="text-gold-500 hover:underline">Login Here</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
