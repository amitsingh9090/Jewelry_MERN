import React, { useState } from 'react';

function Contact() {
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you ' + name + '! Your message was successfully sent to the concierge team.');
    setName('');
    setMsg('');
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-serif text-white mb-2">Concierge & Support</h1>
        <p className="text-slate-400 text-sm">Reach out for bespoke fittings, sizing customizations, or queries</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-xl space-y-4 border border-slate-800">
        <div>
          <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-3 text-xs text-slate-300 focus:outline-none" />
        </div>
        <div>
          <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Describe Query</label>
          <textarea required value={msg} onChange={(e) => setMsg(e.target.value)} rows="4" className="w-full bg-luxury-charcoal border border-slate-800 rounded p-3 text-xs text-slate-300 focus:outline-none"></textarea>
        </div>
        <button type="submit" className="w-full py-3 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-widest uppercase rounded">Send Support Query</button>
      </form>
    </div>
  );
}

export default Contact;
