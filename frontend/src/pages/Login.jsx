import React, { useState } from 'react';
import { useLuxe } from '../context/LuxeContext.jsx';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function Login() {
  const { login, logout, user, orders, tickets, addTicket, wishlist, products, toggleWishlist, addToCart, returnOrder, setUser } = useLuxe();
  
  // Login input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Dashboard Active Tab
  const [activeTab, setActiveTab] = useState('overview');

  // Support ticket form states
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Settings form states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState(user ? user.phone : '');
  const [shipAddress, setShipAddress] = useState(user ? user.address : '');

  // Address book states
  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Default Shipping', detail: '742 Park Avenue, New York, NY 10021' },
    { id: 2, label: 'Office Address', detail: '350 Fifth Ave, Empire State Building, NY 10118' }
  ]);
  const [newLabel, setNewLabel] = useState('');
  const [newDetail, setNewDetail] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password.');
      return;
    }
    login(email, password);
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!subject || !message) return;
    addTicket(subject, message);
    setSubject('');
    setMessage('');
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newLabel || !newDetail) return;
    setAddresses(prev => [...prev, { id: Date.now(), label: newLabel, detail: newDetail }]);
    setNewLabel('');
    setNewDetail('');
    toast.success('Address added to book.');
  };

  const handleRemoveAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    toast.error('Address deleted.');
  };

  const handleUpdateSettings = (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setUser(prev => ({
      ...prev,
      phone: phone || prev.phone,
      address: shipAddress || prev.address
    }));
    toast.success('Profile settings updated.');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Derived arrays
  const wishlistedItems = products.filter(p => wishlist.includes(p.id));
  const activeRentals = orders.filter(o => o.status === 'Active');
  const pastRentals = orders.filter(o => o.status === 'Returned');

  if (user) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-900 pb-6">
          <div className="flex items-center gap-4">
            <img src={user.avatar} className="w-16 h-16 rounded-full border border-gold-500/30" alt="" />
            <div>
              <h1 className="text-3xl font-serif text-white">Welcome, {user.name}</h1>
              <p className="text-xs text-luxury-gold uppercase tracking-widest mt-0.5">Luxe Vault Club Patron</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="px-5 py-2 border border-rose-500/20 text-rose-400 hover:bg-rose-550/10 text-xs font-semibold uppercase tracking-widest rounded"
          >
            Sign Out
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Nav */}
          <div className="lg:col-span-3 glass-panel p-4 rounded-xl space-y-1">
            <button 
              onClick={() => setActiveTab('overview')} 
              className={`w-full text-left px-4 py-2.5 rounded text-xs uppercase tracking-widest font-medium transition-colors ${activeTab === 'overview' ? 'bg-gold-500/10 text-luxury-gold' : 'text-slate-400 hover:bg-luxury-charcoal/30'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('rentals')} 
              className={`w-full text-left px-4 py-2.5 rounded text-xs uppercase tracking-widest font-medium transition-colors ${activeTab === 'rentals' ? 'bg-gold-500/10 text-luxury-gold' : 'text-slate-400 hover:bg-luxury-charcoal/30'}`}
            >
              Active Rentals ({activeRentals.length})
            </button>
            <button 
              onClick={() => setActiveTab('history')} 
              className={`w-full text-left px-4 py-2.5 rounded text-xs uppercase tracking-widest font-medium transition-colors ${activeTab === 'history' ? 'bg-gold-500/10 text-luxury-gold' : 'text-slate-400 hover:bg-luxury-charcoal/30'}`}
            >
              Rental History ({pastRentals.length})
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')} 
              className={`w-full text-left px-4 py-2.5 rounded text-xs uppercase tracking-widest font-medium transition-colors ${activeTab === 'wishlist' ? 'bg-gold-500/10 text-luxury-gold' : 'text-slate-400 hover:bg-luxury-charcoal/30'}`}
            >
              My Wishlist ({wishlist.length})
            </button>
            <button 
              onClick={() => setActiveTab('addresses')} 
              className={`w-full text-left px-4 py-2.5 rounded text-xs uppercase tracking-widest font-medium transition-colors ${activeTab === 'addresses' ? 'bg-gold-500/10 text-luxury-gold' : 'text-slate-400 hover:bg-luxury-charcoal/30'}`}
            >
              Saved Addresses
            </button>
            <button 
              onClick={() => setActiveTab('tickets')} 
              className={`w-full text-left px-4 py-2.5 rounded text-xs uppercase tracking-widest font-medium transition-colors ${activeTab === 'tickets' ? 'bg-gold-500/10 text-luxury-gold' : 'text-slate-400 hover:bg-luxury-charcoal/30'}`}
            >
              Support Tickets
            </button>
            <button 
              onClick={() => setActiveTab('settings')} 
              className={`w-full text-left px-4 py-2.5 rounded text-xs uppercase tracking-widest font-medium transition-colors ${activeTab === 'settings' ? 'bg-gold-500/10 text-luxury-gold' : 'text-slate-400 hover:bg-luxury-charcoal/30'}`}
            >
              Account Settings
            </button>
          </div>

          {/* Main Dashboard Panel */}
          <div className="lg:col-span-9">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="glass-panel p-5 rounded-xl border border-slate-900 text-center">
                    <span className="text-slate-500 text-[10px] uppercase tracking-widest block mb-1">Active Rentals</span>
                    <strong className="text-2xl text-white font-serif">{activeRentals.length}</strong>
                  </div>
                  <div className="glass-panel p-5 rounded-xl border border-slate-900 text-center">
                    <span className="text-slate-500 text-[10px] uppercase tracking-widest block mb-1">Items Wishlisted</span>
                    <strong className="text-2xl text-white font-serif">{wishlist.length}</strong>
                  </div>
                  <div className="glass-panel p-5 rounded-xl border border-slate-900 text-center">
                    <span className="text-slate-500 text-[10px] uppercase tracking-widest block mb-1">Support Requests</span>
                    <strong className="text-2xl text-white font-serif">{tickets.length}</strong>
                  </div>
                  <div className="glass-panel p-5 rounded-xl border border-slate-900 text-center">
                    <span className="text-slate-500 text-[10px] uppercase tracking-widest block mb-1">Club Membership</span>
                    <strong className="text-sm text-luxury-gold uppercase tracking-widest block mt-1 font-semibold">Platinum</strong>
                  </div>
                </div>

                {/* Dashboard Intro */}
                <div className="glass-panel p-6 rounded-xl border border-gold-500/10 space-y-4">
                  <h3 className="text-lg font-serif text-white">Luxury Vault Status</h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    Your Platinum credentials grant you express door-to-door insured transit and zero-security deposit terms on eligible pieces. For seasonal fittings or custom design adjustments, click the Help Desk tab to initiate support.
                  </p>
                </div>
              </div>
            )}

            {/* ACTIVE RENTALS TAB */}
            {activeTab === 'rentals' && (
              <div className="glass-panel p-6 rounded-xl space-y-4 animate-fade-in">
                <h3 className="text-lg font-serif text-white border-b border-slate-900 pb-2">Rented Vault Pieces</h3>
                {activeRentals.length === 0 ? (
                  <p className="text-xs text-slate-500 font-light py-4 text-center">No active rental agreements found.</p>
                ) : (
                  <div className="space-y-4">
                    {activeRentals.map((ord) => (
                      <div key={ord.id} className="p-4 border border-gold-500/15 bg-gold-950/5 rounded-lg space-y-4">
                        <div className="flex justify-between items-center text-xs text-slate-300">
                          <span>Booking ID: <strong className="text-white">{ord.id}</strong></span>
                          <span className="px-2 py-0.5 rounded bg-emerald-950/20 text-emerald-400 border border-emerald-500/20">Active Out</span>
                        </div>
                        
                        {ord.items.map((i, idx) => {
                          const catalogItem = products.find(p => p.id === i.productId);
                          return (
                            <div key={idx} className="flex gap-4 items-center border-t border-slate-900 pt-3">
                              <img src={catalogItem?.image} alt="" className="w-12 h-12 object-cover rounded border border-slate-800" />
                              <div className="flex-grow text-xs">
                                <h4 className="font-serif text-white font-medium">{i.name}</h4>
                                <p className="text-[10px] text-slate-400 mt-0.5">Rental Duration: {i.days || 3} Days | Daily Rate: ${i.dailyRent}</p>
                              </div>
                              <span className="text-xs text-white font-semibold">${i.dailyRent * (i.days || 3)}</span>
                            </div>
                          );
                        })}

                        <div className="flex justify-between items-center text-xs text-slate-400 pt-3 border-t border-slate-900/60">
                          <span>Delivery terms: Insured Signature Drop</span>
                          <button 
                            onClick={() => returnOrder(ord.id)}
                            className="px-4 py-1.5 bg-luxury-charcoal border border-gold-500/30 text-gold-300 text-[10px] font-bold tracking-wider uppercase rounded-md hover:bg-gold-500/10 transition-colors"
                          >
                            Return Ornaments
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* RENTAL HISTORY TAB */}
            {activeTab === 'history' && (
              <div className="glass-panel p-6 rounded-xl space-y-4 animate-fade-in">
                <h3 className="text-lg font-serif text-white border-b border-slate-900 pb-2">Past Rental Archives</h3>
                {pastRentals.length === 0 ? (
                  <p className="text-xs text-slate-500 font-light py-4 text-center">No returned rental histories registered.</p>
                ) : (
                  <div className="space-y-4">
                    {pastRentals.map((ord) => (
                      <div key={ord.id} className="p-4 border border-slate-800 rounded-lg text-xs space-y-3">
                        <div className="flex justify-between items-center text-slate-400">
                          <span>Booking Ref: <strong>{ord.id}</strong></span>
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-500">Returned</span>
                        </div>
                        <div className="space-y-1">
                          {ord.items.map((i, idx) => (
                            <div key={idx} className="flex justify-between text-slate-400">
                              <span>{i.name}</span>
                              <span>${ord.total}</span>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={() => toast.success('Mock invoice download initiated.')}
                          className="px-3 py-1 border border-gold-500/20 text-gold-300 rounded text-[10px] font-semibold hover:bg-gold-500/5 uppercase"
                        >
                          Download Invoice PDF
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* EMBEDDED WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="glass-panel p-6 rounded-xl space-y-4 animate-fade-in">
                <h3 className="text-lg font-serif text-white border-b border-slate-900 pb-2">My Favorite Vaults</h3>
                {wishlistedItems.length === 0 ? (
                  <p className="text-xs text-slate-500 font-light py-4 text-center">Your wishlist is empty. Add items from the catalog.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistedItems.map((p) => (
                      <div key={p.id} className="p-4 border border-slate-800 rounded-lg flex gap-4 items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={p.image} className="w-12 h-12 object-cover rounded border border-slate-800" alt="" />
                          <div>
                            <h4 className="font-serif text-white text-xs font-semibold">{p.name}</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5">${p.dailyRent}/day</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => toggleWishlist(p.id)}
                            className="p-1 text-slate-500 hover:text-rose-500 text-xs" 
                            title="Remove"
                          >
                            🗑️
                          </button>
                          <button 
                            onClick={() => { addToCart(p, 1); toggleWishlist(p.id); }}
                            className="px-3 py-1 bg-gold-500 text-luxury-black text-[10px] font-bold uppercase rounded"
                          >
                            Rent
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SAVED ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="glass-panel p-6 rounded-xl space-y-6 animate-fade-in">
                <h3 className="text-lg font-serif text-white border-b border-slate-900 pb-2">Address Directory</h3>
                
                <div className="space-y-3">
                  {addresses.map((a) => (
                    <div key={a.id} className="p-3.5 border border-slate-800 rounded flex justify-between items-center text-xs">
                      <div>
                        <strong className="text-white block font-serif mb-0.5">{a.label}</strong>
                        <span className="text-slate-400 font-light">{a.detail}</span>
                      </div>
                      <button 
                        onClick={() => handleRemoveAddress(a.id)}
                        className="text-rose-500 hover:text-rose-400 text-xs px-2"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new address */}
                <form onSubmit={handleAddAddress} className="space-y-3 border-t border-slate-900 pt-4">
                  <h4 className="text-xs font-serif text-white uppercase tracking-widest">Add Shipping Location</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Label (e.g. Home, Office)" 
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      required 
                      className="bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none" 
                    />
                    <input 
                      type="text" 
                      placeholder="Address Detail" 
                      value={newDetail}
                      onChange={(e) => setNewDetail(e.target.value)}
                      required 
                      className="bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none" 
                    />
                  </div>
                  <button type="submit" className="px-4 py-2 border border-gold-500/30 text-xs text-gold-300 rounded hover:bg-gold-500/10">Add Location</button>
                </form>
              </div>
            )}

            {/* SUPPORT TICKETS TAB */}
            {activeTab === 'tickets' && (
              <div className="glass-panel p-6 rounded-xl space-y-6 animate-fade-in">
                <h3 className="text-lg font-serif text-white border-b border-slate-900 pb-2">Support Tickets</h3>
                
                <div className="space-y-3">
                  {tickets.map((t) => (
                    <div key={t.id} className="p-3 border border-slate-800 rounded bg-luxury-dark/40 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-white">{t.subject}</div>
                        <div className="text-slate-500">{t.message}</div>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">{t.status}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSupportSubmit} className="space-y-3 border-t border-slate-900 pt-4">
                  <h4 className="text-xs font-serif text-white uppercase tracking-widest">New Support Request</h4>
                  <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none" />
                  <textarea placeholder="Describe your request..." value={message} onChange={(e) => setMessage(e.target.value)} required rows="2" className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none"></textarea>
                  <button type="submit" className="px-4 py-2 border border-gold-500/30 text-xs text-gold-300 rounded hover:bg-gold-500/10">Submit Ticket</button>
                </form>
              </div>
            )}

            {/* ACCOUNT SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="glass-panel p-6 rounded-xl space-y-4 animate-fade-in">
                <h3 className="text-lg font-serif text-white border-b border-slate-900 pb-2">Profile & Security Settings</h3>
                
                <form onSubmit={handleUpdateSettings} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Phone Number</label>
                      <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-300 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Default Shipping Address</label>
                      <input type="text" value={shipAddress} onChange={(e) => setShipAddress(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-300 focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-900 pt-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Change Password</label>
                      <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-300 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Confirm New Password</label>
                      <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-300 focus:outline-none" />
                    </div>
                  </div>

                  <button type="submit" className="px-6 py-2.5 gold-gradient-bg text-luxury-black font-semibold text-xs uppercase tracking-widest rounded">
                    Save Changes
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20 min-h-[60vh] flex flex-col justify-center animate-fade-in">
      <div className="glass-panel p-8 rounded-xl border border-gold-500/15 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-white">Client Login</h1>
          <p className="text-xs text-slate-500 mt-1">Unlock your rentals & client overview</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Account Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-luxury-charcoal border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500" />
          </div>
          <div className="flex justify-between items-center text-xs">
            <Link to="/forgot-password" className="text-gold-500 hover:underline">Forgot password?</Link>
          </div>
          <button type="submit" className="w-full py-2.5 gold-gradient-bg text-luxury-black font-semibold text-xs tracking-widest uppercase rounded">Login</button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don't have an account? <Link to="/register" className="text-gold-500 hover:underline font-semibold">Register Here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
